# Script para copiar las imágenes de galería
$baseDir = Split-Path -Parent $PSScriptRoot
$destDir = Join-Path $PSScriptRoot "public"

# Buscar y copiar las imágenes
$files = Get-ChildItem -Path $baseDir -Filter "Galeria*.jpeg" -ErrorAction SilentlyContinue

if ($files.Count -eq 0) {
    Write-Host "No se encontraron archivos de galería en: $baseDir" -ForegroundColor Yellow
    Write-Host "Buscando en directorio alternativo..." -ForegroundColor Yellow
    $baseDir = "C:\Users\USUARIO\Desktop\Desarrollo\Clientes\Clínica San Juan"
    $files = Get-ChildItem -Path $baseDir -Filter "Galeria*.jpeg" -ErrorAction SilentlyContinue
}

if ($files.Count -gt 0) {
    $counter = 1
    foreach ($file in $files | Sort-Object Name) {
        $destName = "galeria-0$counter.jpg"
        $destPath = Join-Path $destDir $destName
        Copy-Item $file.FullName $destPath -Force
        Write-Host "Copiada: $($file.Name) -> $destName" -ForegroundColor Green
        $counter++
    }
    Write-Host "`n¡Imágenes copiadas exitosamente!" -ForegroundColor Cyan
} else {
    Write-Host "No se encontraron archivos de galería." -ForegroundColor Red
}
