# Perbarui field (daftar isi, daftar gambar, daftar tabel) lalu ekspor PDF.
# Dipanggil oleh build-laporan.sh setelah DOCX selesai dirakit.

param(
    [string]$Docx = "Laporan.docx",
    [string]$Pdf  = "Laporan-word.pdf"
)

$ErrorActionPreference = "Stop"
$path = (Resolve-Path $Docx).Path
$out  = Join-Path (Split-Path $path) $Pdf

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($path)

    foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
    $doc.Fields.Update() | Out-Null
    $doc.Repaginate()
    $doc.Save()

    # 17 = wdExportFormatPDF
    $doc.ExportAsFixedFormat($out, 17)
    Write-Output ("PAGES=" + $doc.ComputeStatistics(2))
    Write-Output ("PDF=" + $out)

    $doc.Close($false)
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
