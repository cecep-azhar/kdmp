Remove-Item -Path "src\app\layout.tsx" -Force
Remove-Item -Path "src\app\(payload)\layout.tsx" -Force
Remove-Item -Recurse -Force -Path ".next"
Write-Host "File layout.tsx yang bermasalah dan cache .next berhasil dihapus!"
Write-Host "Silakan jalankan ulang server Anda dengan perintah: pnpm dev"
