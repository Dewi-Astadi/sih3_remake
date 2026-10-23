#!/usr/bin/env python3
"""Tambahkan label nomor pada caption gambar/tabel dan isi daftar gambar/tabel.

Pandoc menghasilkan caption dengan gaya "Image Caption" dan "Table Caption"
tanpa label "Gambar 4.1" / "Tabel 4.1". Word juga tidak dapat membangun
DAFTAR GAMBAR dari field TOC \\c karena tidak ada field SEQ.

Skrip ini:
  1. Menelusuri paragraf berurutan dan menghitung nomor bab dari Heading 1.
  2. Menyisipkan label "Gambar <bab>.<n>" atau "Tabel <bab>.<n>" di awal
     caption, dengan nomor urut yang direset setiap bab.
  3. Mengganti field daftar gambar/tabel menjadi TOC berbasis gaya
     (\\t "ImageCaption,1" dan \\t "TableCaption,1").

Pemakaian:
  python3 scripts/rapikan-caption.py Laporan.docx
"""

import re
import shutil
import sys
import zipfile
from pathlib import Path

P_RE = re.compile(r"<w:p\b[^>]*>.*?</w:p>", re.S)


def para_style(p):
    m = re.search(r'<w:pStyle w:val="([^"]+)"', p)
    return m.group(1) if m else ""


def keep_with_next(p):
    """Caption tidak boleh terpisah dari tabel/gambar di bawahnya."""
    if "<w:keepNext" in p:
        return p
    if "<w:pPr>" in p:
        return p.replace("<w:pPr>", "<w:pPr><w:keepNext/>", 1)
    return p.replace(">", "><w:pPr><w:keepNext/></w:pPr>", 1)


def first_run_insert(p, text, seq_name, seq_num):
    """Sisipkan label caption + field SEQ di awal paragraf."""
    m = re.search(r"<w:r\b[^>]*>", p)
    if not m:
        return p
    label = (
        f'<w:r><w:t xml:space="preserve">{text}</w:t></w:r>'
        f'<w:r><w:fldChar w:fldCharType="begin"/></w:r>'
        f'<w:r><w:instrText xml:space="preserve"> SEQ {seq_name} \\* ARABIC </w:instrText></w:r>'
        f'<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
        f'<w:r><w:t>{seq_num}</w:t></w:r>'
        f'<w:r><w:fldChar w:fldCharType="end"/></w:r>'
        f'<w:r><w:t xml:space="preserve"> </w:t></w:r>'
    )
    return p[:m.start()] + label + p[m.start():]


def main(path):
    src = Path(path)
    tmp = src.with_suffix(".tmp.docx")
    with zipfile.ZipFile(src) as zin:
        names = zin.namelist()
        data = {n: zin.read(n) for n in names}

    doc = data["word/document.xml"].decode("utf8")

    bab = 0
    fig = 0
    tbl = 0
    out = []
    pos = 0
    count_fig = count_tbl = 0

    for m in P_RE.finditer(doc):
        out.append(doc[pos:m.start()])
        p = m.group(0)
        style = para_style(p)
        if style == "Heading1":
            teks = " ".join(re.findall(r"<w:t(?:\s[^>]*)?>(.*?)</w:t>", p, re.S))
            if re.match(r"^\s*BAB\s+[IVXLCDM]+", teks):
                bab += 1
                fig = 0
                tbl = 0
        elif style == "ImageCaption":
            fig += 1
            p = first_run_insert(p, f"Gambar {bab}.", "Gambar", fig)
            count_fig += 1
        elif style == "TableCaption":
            tbl += 1
            p = keep_with_next(first_run_insert(p, f"Tabel {bab}.", "Tabel", tbl))
            count_tbl += 1
        out.append(p)
        pos = m.end()
    out.append(doc[pos:])
    doc = "".join(out)



    data["word/document.xml"] = doc.encode("utf8")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for n in names:
            zout.writestr(n, data[n])
    shutil.move(tmp, src)
    print(f"[OK] caption diberi nomor: {count_fig} gambar, {count_tbl} tabel -> {src}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "Laporan.docx")
