# ===============================================
# Microservices Development Stop Script (PowerShell)
# ===============================================

Write-Host "🛑 Stopping microservices development environment..." -ForegroundColor Red

# Detener y remover contenedores
Write-Host "📦 Stopping all containers..." -ForegroundColor Yellow
docker-compose down

# Limpiar volúmenes si se solicita
$cleanup = Read-Host "Do you want to remove volumes (database data)? (y/N)"
if ($cleanup -eq "y" -or $cleanup -eq "Y") {
    Write-Host "🗑️ Removing volumes..." -ForegroundColor Yellow
    docker-compose down -v
    Write-Host "⚠️ All data has been removed!" -ForegroundColor Red
}

# Limpiar imágenes no utilizadas
$cleanImages = Read-Host "Do you want to clean unused Docker images? (y/N)"
if ($cleanImages -eq "y" -or $cleanImages -eq "Y") {
    Write-Host "🧹 Cleaning unused images..." -ForegroundColor Yellow
    docker image prune -f
}

Write-Host "`n✅ Environment stopped successfully!" -ForegroundColor Green
Write-Host "👋 See you later!" -ForegroundColor Cyan