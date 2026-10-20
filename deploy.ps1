Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Compressing and Deploying to Live Server...        " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

$zip = Join-Path $env:TEMP "waqty-deploy.zip"
Remove-Item $zip -Force -ErrorAction SilentlyContinue

$files = @(
    "D:\sh\index.html",
    "D:\sh\style.css",
    "D:\sh\app.js",
    "D:\sh\scene3d.js",
    "D:\sh\screen_data.js",
    "D:\sh\logo.png",
    "D:\sh\logo-icon.png",
    "D:\sh\app-screen.jpg"
)

Compress-Archive -Path $files -DestinationPath $zip -Force

$res = curl.exe -s -X POST "https://ship.page/deploy" -H "Content-Type: application/zip" --data-binary ("@" + $zip)
$data = $res | ConvertFrom-Json

if ($data.url) {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host " [SUCCESS] Site Deployed Successfully!" -ForegroundColor Green
    Write-Host " Live URL: " -NoNewline -ForegroundColor Green
    Write-Host $data.url -ForegroundColor Yellow
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host ""
    Start-Process $data.url
} else {
    Write-Host "Deployment error:" -ForegroundColor Red
    Write-Host $res
}
