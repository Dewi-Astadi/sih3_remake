#!/usr/bin/env python3
"""Normalisasi tabel pada Laporan.docx agar tidak melewati batas margin.

Pandoc menetapkan lebar kolom berdasarkan jumlah karakter pada baris
pemisah, sehingga tabel dengan banyak kolom dapat melebihi lebar area
teks (A4 dikurangi margin 4 cm kiri dan 3 cm kanan). Skrip ini:

  1. Menghitung lebar area teks dari sectPr.
  2. Menghitung bobot kolom dari panjang teks agar kolom keterangan
     memperoleh ruang lebih besar daripada kolom angka.
  3. Menskalakan gridCol dan lebar sel agar totalnya sama dengan lebar area.
  4. Mengulang baris judul tabel pada setiap halaman (tblHeader).

Pemakaian:
  python3 scripts/normalisasi-tabel.py Laporan.docx
"""

import re
import shutil
import sys
import zipfile
from pathlib import Path

TABLE_RE = re.compile(r"<w:tbl>.*?</w:tbl>", re.S)
ROW_RE = re.compile(r"<w:tr\b.*?</w:tr>", re.S)
CELL_RE = re.compile(r"<w:tc>.*?</w:tc>", re.S)
TEXT_RE = re.compile(r"<w:t(?:\s[^>]*)?>(.*?)</w:t>", re.S)
GRID_RE = re.compile(r'<w:gridCol w:w="(\d+)"\s*/>')
TCW_RE = re.compile(r"<w:tcW\b[^>]*/>")


def text_width(doc_xml):
    sect = re.search(r"<w:sectPr\b.*?</w:sectPr>", doc_xml, re.S)
    if not sect:
        return 7937
    s = sect.group(0)
    pg = re.search(r'<w:pgSz[^>]*w:w="(\d+)"', s)
    left = re.search(r'<w:pgMar[^>]*w:left="(\d+)"', s)
    right = re.search(r'<w:pgMar[^>]*w:right="(\d+)"', s)
    if not (pg and left and right):
        return 7937
    return int(pg.group(1)) - int(left.group(1)) - int(right.group(1))


def cell_texts(tbl):
    rows = []
    for r in ROW_RE.findall(tbl):
        rows.append(["".join(TEXT_RE.findall(c)).strip() for c in CELL_RE.findall(r)])
    return rows


def column_metrics(rows, ncol):
    """Kembalikan (bobot, lebar_minimum) setiap kolom.

    Bobot dihitung dari panjang teks rata-rata dan terpanjang. Lebar
    minimum dihitung dari kata terpanjang pada kolom tersebut agar kata
    pendek seperti "Positif" tidak terpotong menjadi dua baris.
    """
    weights, minimum = [], []
    for i in range(ncol):
        vals = [r[i] for r in rows if i < len(r) and r[i]]
        if not vals:
            weights.append(8.0)
            minimum.append(700)
            continue
        longest = max(len(v) for v in vals)
        mean = sum(len(v) for v in vals) / len(vals)
        longest_word = max((len(w) for v in vals for w in v.split()), default=1)
        numeric = all(v.replace(",", "").replace(".", "").isdigit() for v in vals)
        if numeric and longest <= 3:
            w = 6.0
        elif numeric:
            w = 9.0
        else:
            w = 0.55 * mean + 0.45 * longest
        weights.append(min(55.0, max(6.0, w)))
        minimum.append(min(3600, max(560, longest_word * 132 + 260)))
    return weights, minimum


def fix_table(tbl, width):
    grid = [int(x) for x in GRID_RE.findall(tbl)]
    if not grid:
        return tbl, 0

    rows = cell_texts(tbl)
    weights, minimum = column_metrics(rows, len(grid))

    # lebar minimum dijaga; kolom lebar yang dikorbankan bila melebihi area
    mins = list(minimum)
    while sum(mins) > width:
        i = max(range(len(mins)), key=lambda k: mins[k])
        over = sum(mins) - width
        take = min(over, max(0, mins[i] - 560))
        if take <= 0:
            break
        mins[i] -= take

    new_grid = list(mins)
    remaining = width - sum(new_grid)
    if remaining > 0:
        total_w = sum(weights)
        for i in range(len(new_grid)):
            new_grid[i] += int(remaining * weights[i] / total_w)
        sisa = width - sum(new_grid)
        if sisa:
            donor = max(range(len(new_grid)), key=lambda i: new_grid[i])
            new_grid[donor] += sisa

    idx = 0

    def repl_grid(m):
        nonlocal idx
        val = new_grid[idx] if idx < len(new_grid) else new_grid[-1]
        idx += 1
        return f'<w:gridCol w:w="{val}"/>'

    tbl = GRID_RE.sub(repl_grid, tbl)

    def fix_row(m):
        row = m.group(0)
        cells = list(CELL_RE.finditer(row))
        out, pos = [], 0
        for i, c in enumerate(cells):
            out.append(row[pos:c.start()])
            cell = c.group(0)
            w = new_grid[i] if i < len(new_grid) else new_grid[-1]
            tcw = f'<w:tcW w:w="{w}" w:type="dxa"/>'
            if TCW_RE.search(cell):
                cell = TCW_RE.sub(tcw, cell, count=1)
            elif re.search(r"<w:tcPr\s*/>", cell):
                cell = re.sub(r"<w:tcPr\s*/>", f"<w:tcPr>{tcw}</w:tcPr>", cell, count=1)
            elif "<w:tcPr>" in cell:
                cell = cell.replace("<w:tcPr>", f"<w:tcPr>{tcw}", 1)
            else:
                cell = cell.replace("<w:tc>", f"<w:tc><w:tcPr>{tcw}</w:tcPr>", 1)
            out.append(cell)
            pos = c.end()
        out.append(row[pos:])
        return "".join(out)

    tbl = ROW_RE.sub(fix_row, tbl)

    # lebar tabel tetap dalam satuan twips
    new_tblw = f'<w:tblW w:w="{width}" w:type="dxa"/>'
    if re.search(r"<w:tblW\b[^>]*/>", tbl):
        tbl = re.sub(r"<w:tblW\b[^>]*/>", new_tblw, tbl, count=1)
    elif "<w:tblPr>" in tbl:
        tbl = tbl.replace("<w:tblPr>", f"<w:tblPr>{new_tblw}", 1)

    # tabel dengan banyak kolom memakai huruf 10 pt agar isi tidak terpotong
    if len(new_grid) >= 5:
        def kecil(m):
            run = m.group(0)
            if "<w:rPr>" in run:
                return run.replace("<w:rPr>", '<w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/>', 1)
            return run.replace("<w:r>", '<w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>', 1)
        tbl = re.sub(r"<w:r>.*?</w:r>", kecil, tbl, flags=re.S)

    # cegah satu baris terpotong di antara dua halaman
    def nosplit(m):
        row = m.group(0)
        if "<w:trPr>" in row:
            if "<w:cantSplit" not in row:
                row = row.replace("<w:trPr>", "<w:trPr><w:cantSplit/>", 1)
        else:
            row = row.replace("<w:tr>", "<w:tr><w:trPr><w:cantSplit/></w:trPr>", 1)
        return row

    tbl = ROW_RE.sub(nosplit, tbl)

    # ulangi baris judul pada halaman berikutnya
    end_head = tbl.find("</w:tr>")
    if end_head > 0 and "<w:tblHeader" not in tbl[:end_head]:
        head = tbl[:end_head]
        if "<w:trPr>" in head:
            head = head.replace("<w:trPr>", "<w:trPr><w:tblHeader/>", 1)
        else:
            head = head.replace("<w:tr>", "<w:tr><w:trPr><w:tblHeader/></w:trPr>", 1)
        tbl = head + tbl[end_head:]

    return tbl, len(new_grid)


def main(path):
    src = Path(path)
    tmp = src.with_suffix(".tmp.docx")
    with zipfile.ZipFile(src) as zin:
        names = zin.namelist()
        data = {n: zin.read(n) for n in names}

    doc = data["word/document.xml"].decode("utf8")
    width = text_width(doc)

    count = 0

    def repl(m):
        nonlocal count
        tbl, _ = fix_table(m.group(0), width)
        count += 1
        return tbl

    doc = TABLE_RE.sub(repl, doc)
    data["word/document.xml"] = doc.encode("utf8")

    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for n in names:
            zout.writestr(n, data[n])

    shutil.move(tmp, src)
    print(f"[OK] {count} tabel dinormalisasi ke lebar {width} twips -> {src}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "Laporan.docx")
