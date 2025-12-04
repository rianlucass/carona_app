# Script de instalação rápida
Write-Host "🔧 Instalando dependências do NativeWind..." -ForegroundColor Cyan

# Instalar dependências
Write-Host "`nInstalando pacotes..." -ForegroundColor Yellow
npm install

# Limpar cache
Write-Host "`nLimpando cache do Metro..." -ForegroundColor Yellow
Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue

# Verificar instalação
Write-Host "`n✅ Verificando instalação..." -ForegroundColor Green
$tailwind = Get-Content package.json | Select-String "tailwindcss"
$nativewind = Get-Content package.json | Select-String "nativewind"

if ($tailwind) {
    Write-Host "✓ tailwindcss instalado" -ForegroundColor Green
} else {
    Write-Host "✗ tailwindcss NÃO encontrado" -ForegroundColor Red
}

if ($nativewind) {
    Write-Host "✓ nativewind instalado" -ForegroundColor Green
} else {
    Write-Host "✗ nativewind NÃO encontrado" -ForegroundColor Red
}

Write-Host "`n🚀 Pronto! Execute 'npm start' para iniciar o app." -ForegroundColor Cyan
Write-Host "   Use 'npm start -- --clear' se as classes ainda não funcionarem." -ForegroundColor Yellow
