# ===============================================
# Microservices Development Startup Script (PowerShell)
# ===============================================

Write-Host "🚀 Starting microservices development environment..." -ForegroundColor Green

# Verificar si Docker está corriendo
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Crear red si no existe
Write-Host "🌐 Creating Docker network..." -ForegroundColor Yellow
docker network create microservices-network 2>$null

# Detener contenedores existentes
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Construir imágenes
Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
docker-compose build --no-cache

# Iniciar servicios de base de datos primero
Write-Host "🗄️ Starting database services..." -ForegroundColor Yellow
docker-compose up -d postgres mongodb redis nats

# Esperar que las bases de datos estén listas
Write-Host "⏳ Waiting for databases to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Iniciar todos los microservicios
Write-Host "🚀 Starting all microservices..." -ForegroundColor Yellow
docker-compose up -d

# Esperar un poco más para que los servicios se inicialicen
Start-Sleep -Seconds 10

# Mostrar el estado de los servicios
Write-Host "`n📋 Service status:" -ForegroundColor Cyan
docker-compose ps

Write-Host "`n✅ Microservices environment is ready!" -ForegroundColor Green

Write-Host "`n🌐 Available services:" -ForegroundColor Cyan
Write-Host "  - API Gateway:          http://localhost:3000" -ForegroundColor White
Write-Host "  - User Service:         http://localhost:3001" -ForegroundColor White
Write-Host "  - Product Service:      http://localhost:3002" -ForegroundColor White
Write-Host "  - Notification Service: http://localhost:3003" -ForegroundColor White

Write-Host "`n🗄️ Database connections:" -ForegroundColor Cyan
Write-Host "  - PostgreSQL:  localhost:5432 (user: postgres, password: postgres123)" -ForegroundColor White
Write-Host "  - MongoDB:     localhost:27017 (user: mongo, password: mongo123)" -ForegroundColor White
Write-Host "  - Redis:       localhost:6379 (password: redis123)" -ForegroundColor White
Write-Host "  - NATS:        localhost:4222 (monitoring: http://localhost:8222)" -ForegroundColor White

Write-Host "`n📊 Useful commands:" -ForegroundColor Cyan
Write-Host "  - View logs:     docker-compose logs -f [service-name]" -ForegroundColor White
Write-Host "  - View all logs: docker-compose logs -f" -ForegroundColor White
Write-Host "  - Stop all:      docker-compose down" -ForegroundColor White
Write-Host "  - Restart:       docker-compose restart [service-name]" -ForegroundColor White

Write-Host "`n🔧 Prisma commands:" -ForegroundColor Cyan
Write-Host "  - User Service Prisma Studio:    docker-compose exec user-service npm run prisma:studio" -ForegroundColor White
Write-Host "  - Product Service Prisma Studio: docker-compose exec product-service npm run prisma:studio" -ForegroundColor White

Write-Host "`n🎉 Happy coding!" -ForegroundColor Green