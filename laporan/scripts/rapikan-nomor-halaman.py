#!/usr/bin/env python3
"""Rapikan penomoran halaman bagian awal (front matter) pada Laporan.docx.

Aturan yang diterapkan:
  - Halaman sampul        : tanpa nomor halaman
  - Lembar pengesahan     : angka Romawi kecil, dimulai dari ii
  - Kata pengantar s.d.
    daftar tabel          : angka Romawi kecil, melanjutkan (iii, iv, ...)
  - Bab I s.d. lampiran   : angka Arab, dimulai dari 1

Skrip ini dijalankan setelah build-docx.sh karena filter Lua hanya
menghasilkan dua kelompok penomoran (Romawi dan Arab).

Pemakaian:
  python3 scripts/rapikan-nomor-halaman.py Laporan.docx
"""

import re
import shutil
import sys
import zipfile
from pathlib import Path

SECT_RE = re.compile(r"<w:sectPr\b.*?</w:sectPr>", re.S)


def footer_id(sect):
    for m in re.finditer(r"<w:footerReference\b[^>]*/>", sect):
        tag = m.group(0)
        if 'w:type="default"' in tag:
            rid = re.search(r'r:id="([^"]+)"', tag)
            if rid:
                return rid.group(1)
    return None


def set_pgnum(sect, fmt, start=None):
    sect = re.sub(r"<w:pgNumType[^/]*/>", "", sect)
    attr = f' w:fmt="{fmt}"' if fmt else ""
    if start is not None:
        attr += f' w:start="{start}"'
    tag = f"<w:pgNumType{attr}/>"
    if "<w:cols" in sect:
        return sect.replace("<w:cols", tag + "<w:cols", 1)
    if "<w:pgSz" in sect:
        return sect.replace("<w:pgSz", tag + "<w:pgSz", 1)
    return sect.replace("</w:sectPr>", tag + "</w:sectPr>", 1)


def ensure_footer(sect, rid):
    if footer_id(sect):
        return sect
    ref = f'<w:footerReference r:id="{rid}" w:type="default" />'
    for anchor in ("<w:footnotePr>", "<w:pgSz", "</w:sectPr>"):
        if anchor in sect:
            return sect.replace(anchor, ref + anchor, 1)
    return sect


def main(path):
    src = Path(path)
    tmp = src.with_suffix(".tmp.docx")
    with zipfile.ZipFile(src) as zin:
        names = zin.namelist()
        data = {n: zin.read(n) for n in names}

    doc = data["word/document.xml"].decode("utf8")
    sects = list(SECT_RE.finditer(doc))

    if len(sects) < 3:
        print("[skip] jumlah section kurang dari tiga, penomoran tidak diubah")
        return

    # Section 1 = lembar pengesahan, section 2 = kata pengantar s.d. daftar tabel
    rid = footer_id(sects[2].group(0)) or footer_id(sects[3].group(0))

    new_sects = []
    for idx, m in enumerate(sects):
        s = m.group(0)
        if idx == 0:
            s = re.sub(r"<w:pgNumType[^/]*/>", "", s)          # sampul tanpa nomor
        elif idx == 1:
            if rid:
                s = ensure_footer(s, rid)
            s = set_pgnum(s, "lowerRoman", 2)                   # pengesahan = ii
        elif idx == 2:
            s = set_pgnum(s, "lowerRoman", None)                # lanjut iii, iv, ...
        elif idx == 3:
            s = set_pgnum(s, "decimal", 1)                      # BAB I = 1
        new_sects.append((m.start(), m.end(), s))

    for start, end, s in reversed(new_sects):
        doc = doc[:start] + s + doc[end:]

    data["word/document.xml"] = doc.encode("utf8")

    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for n in names:
            zout.writestr(n, data[n])

    shutil.move(tmp, src)
    print(f"[OK] penomoran halaman bagian awal dirapikan -> {src}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "Laporan.docx")
