# restart-dev.ps1 — Script untuk restart admin dev server dengan bersih
# Jalankan: powershell -ExecutionPolicy Bypass -File restart-dev.ps1

Write-Host "=== SIKDMP Admin Dev Server Restart ===" -ForegroundColor Cyan

# 1. Kill proses yang pakai port 3000 dan 3001
Write-Host "`n[1/4] Mencari dan menghentikan proses di port 3000 dan 3001..." -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $processId = (netstat -ano | Select-String ":$port\s" | Select-String "LISTENING" | ForEach-Object { $_.ToString().Trim().Split()[-1] } | Select-Object -First 1)
    if ($processId) {
        Write-Host "  → Port $port dipakai PID $processId, menghentikan..." -ForegroundColor Red
        try {
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "  ✅ Proses PID $processId dihentikan" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️ Gagal hentikan PID $processId : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  ✅ Port $port bebas" -ForegroundColor Green
    }
}

# 2. Hapus .next folder
Write-Host "`n[2/4] Menghapus folder .next (build cache lama)..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  ✅ Folder .next berhasil dihapus" -ForegroundColor Green
} else {
    Write-Host "  ℹ️ Folder .next tidak ditemukan, skip" -ForegroundColor Gray
}

# 3. Hapus cache pnpm jika ada
Write-Host "`n[3/4] Membersihkan Next.js cache di node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "  ✅ Cache node_modules berhasil dihapus" -ForegroundColor Green
} else {
    Write-Host "  ℹ️ Tidak ada cache node_modules, skip" -ForegroundColor Gray
}

Write-Host "`n[4/4] Siap! Jalankan dev server dengan perintah berikut:" -ForegroundColor Cyan
Write-Host "  pnpm dev" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "`n=== Selesai ===" -ForegroundColor Cyan
