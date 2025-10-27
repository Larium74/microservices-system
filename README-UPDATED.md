# Sistema de Microservicios con NestJS y Prisma

## 📋 Descripción

Sistema completo de microservicios desarrollado con **NestJS**, **TypeScript** y **Prisma ORM**, que incluye:

- 🌐 **API Gateway** - Punto de entrada principal con autenticación JWT
- 👤 **User Service** - Gestión de usuarios con PostgreSQL y Prisma
- 📦 **Product Service** - Gestión de productos con MongoDB y Prisma  
- 🔔 **Notification Service** - Notificaciones en tiempo real con WebSockets y Redis
- 📨 **NATS** - Sistema de mensajería para comunicación entre microservicios

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   User Service  │    │ Product Service │
│    (Port 3000)  │────│   (Port 3001)   │    │   (Port 3002)   │
│                 │    │ PostgreSQL+Prisma│    │ MongoDB+Prisma  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        └────────┬───────────────┘
         │              ┌─────────────────┐│              
         └──────────────│Notification Svc ││              
                        │   (Port 3003)   ││              
                        │ WebSockets+Redis││              
                        └─────────────────┘│              
                               │           │
                        ┌─────────────────┐│
                        │      NATS       ││
                        │   Message Bus   ││
                        │   (Port 4222)   ││
                        └─────────────────┘│
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- PowerShell (Windows) o Bash (Linux/Mac)
- Node.js 20+ (opcional, para desarrollo local)

### 1. Clonar el repositorio
```bash
git clone https://github.com/jaimeirazabal1/microservicios-base-nestjs
cd microservice-project
```

### 2. Iniciar todos los servicios (Recomendado)
```powershell
# Windows PowerShell
.\start-dev.ps1

# Linux/Mac Bash
./scripts/start-dev.sh
```

### 3. Inicio manual alternativo
```bash
# Construir e iniciar servicios
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f
```

### 4. Verificar servicios
- 🌐 API Gateway: http://localhost:3000
- 👤 User Service: http://localhost:3001  
- 📦 Product Service: http://localhost:3002
- 🔔 Notification Service: http://localhost:3003
- 📡 NATS Monitoring: http://localhost:8222

## 🔗 Prisma Integration

### Características principales:
- ✅ **Type-safe database queries** con Prisma Client
- ✅ **Database migrations** automáticas en Docker
- ✅ **Multi-database support** (PostgreSQL + MongoDB)
- ✅ **Development tooling** con Prisma Studio

### Prisma Studio (Database GUI)
```bash
# User Service (PostgreSQL)
docker-compose exec user-service npm run prisma:studio

# Product Service (MongoDB)  
docker-compose exec product-service npm run prisma:studio
```

### Database Schemas

#### User Service (PostgreSQL)
```prisma
model User {
  id         String    @id @default(uuid())
  email      String    @unique
  password   String
  name       String
  lastName   String?
  phone      String?
  avatar     String?
  roles      String[]  @default(["user"])
  isActive   Boolean   @default(true)
  lastLogin  DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}
```

#### Product Service (MongoDB)
```prisma
model Product {
  id            String    @id @map("_id") @default(auto()) @db.ObjectId
  name          String
  description   String
  sku           String    @unique
  price         Float
  stock         Int
  categoryId    String    @db.ObjectId
  images        String[]
  tags          String[]
  isActive      Boolean   @default(true)
  reviews       Review[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Category {
  id          String   @id @map("_id") @default(auto()) @db.ObjectId
  name        String   @unique
  description String
  slug        String   @unique
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 📊 Servicios y Puertos

| Servicio | Puerto | Base de Datos | ORM | Descripción |
|----------|--------|---------------|-----|-------------|
| API Gateway | 3000 | - | - | Enrutamiento y autenticación |
| User Service | 3001 | PostgreSQL:5432 | Prisma | Gestión de usuarios |
| Product Service | 3002 | MongoDB:27017 | Prisma | Gestión de productos |
| Notification Service | 3003 | Redis:6379 | - | Notificaciones tiempo real |
| NATS | 4222 | - | - | Message broker |

## 🔧 Desarrollo Local

### Variables de entorno
Cada servicio tiene su archivo `.env` configurado automáticamente:

```bash
# User Service
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/userdb

# Product Service  
DATABASE_URL=mongodb://mongo:mongo123@mongodb:27017/productdb?authSource=admin

# Notification Service
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis123
```

### Comandos útiles de Prisma
```bash
# Generar cliente Prisma
docker-compose exec user-service npm run prisma:generate
docker-compose exec product-service npm run prisma:generate

# Aplicar cambios de schema a la BD
docker-compose exec user-service npm run prisma:push
docker-compose exec product-service npm run prisma:push

# Crear nueva migración
docker-compose exec user-service npm run prisma:migrate
```

### Ver logs de servicios
```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f user-service
docker-compose logs -f product-service
docker-compose logs -f notification-service
```

## 📡 API Endpoints

### Autenticación (via API Gateway)
```http
POST /api/v1/auth/register    # Registro de usuario
POST /api/v1/auth/login       # Login con JWT
GET  /api/v1/auth/profile     # Perfil de usuario (JWT requerido)
```

### Usuarios
```http
GET    /api/v1/users          # Listar usuarios (paginado)
GET    /api/v1/users/:id      # Obtener usuario por ID
POST   /api/v1/users          # Crear nuevo usuario
PUT    /api/v1/users/:id      # Actualizar usuario
DELETE /api/v1/users/:id      # Eliminar usuario
```

### Productos
```http
GET    /api/v1/products              # Listar productos (con filtros)
GET    /api/v1/products/:id          # Obtener producto por ID
POST   /api/v1/products              # Crear nuevo producto
PUT    /api/v1/products/:id          # Actualizar producto
DELETE /api/v1/products/:id          # Eliminar producto
POST   /api/v1/products/:id/reviews  # Agregar reseña
GET    /api/v1/products/featured     # Productos destacados
```

### Categorías
```http
GET    /api/v1/categories       # Listar categorías
GET    /api/v1/categories/:id   # Obtener categoría por ID
POST   /api/v1/categories       # Crear nueva categoría
PUT    /api/v1/categories/:id   # Actualizar categoría
DELETE /api/v1/categories/:id   # Eliminar categoría
```

### Notificaciones
```http
GET  /api/v1/notifications           # Obtener notificaciones del usuario
POST /api/v1/notifications/send      # Enviar notificación
POST /api/v1/notifications/:id/read  # Marcar como leída
GET  /api/v1/notifications/unread-count # Contador de no leídas
POST /api/v1/notifications/broadcast # Enviar a todos los usuarios
```

## 🔌 WebSockets (Notificaciones en Tiempo Real)

### Conexión
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3003/notifications', {
  query: { userId: 'user-id-here' }
});
```

### Eventos disponibles
```javascript
// Escuchar nueva notificación
socket.on('new_notification', (notification) => {
  console.log('Nueva notificación:', notification);
});

// Escuchar actualizaciones de contador
socket.on('unread_count_update', (data) => {
  console.log('Notificaciones no leídas:', data.count);
});

// Eventos de conexión
socket.on('connect', () => {
  console.log('Conectado al servidor de notificaciones');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});
```

## 🗄️ Bases de Datos

### PostgreSQL (User Service con Prisma)
```bash
# Conectar a la base de datos
docker exec -it microservices-postgres psql -U postgres -d userdb

# Ver tablas
\dt

# Consultar usuarios
SELECT * FROM "User";
```

### MongoDB (Product Service con Prisma)
```bash
# Conectar a MongoDB
docker exec -it microservices-mongo mongosh -u mongo -p mongo123 --authenticationDatabase admin

# Usar base de datos
use productdb

# Ver colecciones
show collections

# Consultar productos
db.Product.find().pretty()
```

### Redis (Notification Service)
```bash
# Conectar a Redis
docker exec -it microservices-redis redis-cli -a redis123

# Ver todas las claves
KEYS *

# Ver notificaciones de un usuario
LRANGE notifications:user123 0 -1
```

## 🛠️ Scripts y Comandos Útiles

### PowerShell (Windows)
```powershell
# Iniciar desarrollo completo
.\start-dev.ps1

# Detener todos los servicios
.\stop-dev.ps1
```

### Bash (Linux/Mac)
```bash
# Iniciar desarrollo
./scripts/start-dev.sh

# Detener servicios
./scripts/stop-dev.sh

# Construir todos los servicios
./scripts/build-all.sh
```

### Docker Compose manual
```bash
# Construir e iniciar
docker-compose up -d --build

# Solo bases de datos
docker-compose up -d postgres mongodb redis nats

# Solo microservicios
docker-compose up -d user-service product-service notification-service api-gateway

# Reconstruir servicio específico
docker-compose up -d --build user-service

# Ver estado de servicios
docker-compose ps

# Limpiar todo (⚠️ elimina datos)
docker-compose down -v
```

## 🧪 Testing y Verificación

### Health checks automáticos
Todos los servicios incluyen health checks:
```bash
# Ver estado de salud de servicios
docker-compose ps
```

### Pruebas manuales
```bash
# Test de conectividad
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Test de autenticación
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## 📦 Estructura del Proyecto

```
microservice-project/
├── microservices/
│   ├── api-gateway/          # Gateway principal
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── .env
│   ├── user-service/         # Gestión de usuarios + Prisma
│   │   ├── src/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── Dockerfile
│   │   └── .env
│   ├── product-service/      # Gestión de productos + Prisma
│   │   ├── src/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── Dockerfile
│   │   └── .env
│   └── notification-service/ # Notificaciones + Redis
│       ├── src/
│       ├── Dockerfile
│       └── .env
├── shared/                   # Código compartido
├── scripts/                  # Scripts de automatización
├── docker-compose.yml        # Orquestación unificada
├── start-dev.ps1            # Script de inicio (PowerShell)
├── stop-dev.ps1             # Script de parada (PowerShell)
└── .env.example             # Variables de entorno de ejemplo
```

## 🔐 Autenticación y Autorización

### JWT Configuration
```typescript
// Configuración en cada servicio
{
  secret: 'your-super-secret-jwt-key-change-in-production',
  expiresIn: '24h'
}
```

### Uso de tokens
```javascript
// Obtener token
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com', 
    password: 'password123' 
  })
});

const { access_token } = await response.json();

// Usar token en peticiones protegidas
const userResponse = await fetch('/api/v1/users/profile', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

## 🚨 Solución de Problemas

### Problemas con Prisma
```bash
# Regenerar cliente Prisma
docker-compose exec user-service npm run prisma:generate
docker-compose exec product-service npm run prisma:generate

# Reset completo de base de datos (⚠️ elimina datos)
docker-compose exec user-service npx prisma migrate reset --force
```

### Problemas de conectividad
```bash
# Verificar que las redes Docker estén correctas
docker network ls
docker network inspect microservices-network

# Reiniciar servicios con dependencias
docker-compose restart
```

### Problemas de puertos
```bash
# Ver qué procesos usan los puertos
netstat -an | findstr "3000 3001 3002 3003"

# Modificar puertos en docker-compose.yml si es necesario
```

### Logs de debug
```bash
# Logs detallados de un servicio
docker-compose logs -f --tail=100 user-service

# Logs de todas las bases de datos
docker-compose logs postgres mongodb redis nats
```

## 📈 Próximos Pasos y Mejoras

- [ ] **Tests automatizados** (Unit + Integration)
- [ ] **Documentación Swagger/OpenAPI** automática
- [ ] **Circuit breakers** con resilience patterns
- [ ] **Monitoreo avanzado** (Prometheus + Grafana)
- [ ] **Logging centralizado** (ELK Stack)
- [ ] **CI/CD pipeline** completo
- [ ] **Rate limiting** por usuario/IP
- [ ] **Distributed tracing** con Jaeger
- [ ] **API versioning** strategy
- [ ] **Database seeders** con datos de prueba

## 🔗 Recursos Adicionales

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NATS Documentation](https://docs.nats.io/)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia UNLICENSED.

---

## ✅ Principales Cambios Realizados

### 🔄 Migración a Prisma ORM
- ✅ **User Service**: Configurado con Prisma + PostgreSQL
- ✅ **Product Service**: Configurado con Prisma + MongoDB  
- ✅ **Schemas actualizados** con modelos type-safe
- ✅ **Migraciones automáticas** en Docker containers

### 🐳 Docker Unificado
- ✅ **Un solo docker-compose.yml** centralizado
- ✅ **Health checks** para todas las bases de datos
- ✅ **Dependencias correctas** entre servicios
- ✅ **Variables de entorno** estandarizadas
- ✅ **Volúmenes persistentes** para datos

### 🛠️ Automatización
- ✅ **Scripts PowerShell** para Windows
- ✅ **Scripts Bash** para Linux/Mac  
- ✅ **Inicialización automática** de Prisma
- ✅ **Configuración de red** Docker optimizada

**¡Listo para usar! 🎉**

Para cualquier duda, ejecuta:
```powershell
.\start-dev.ps1  # y sigue las instrucciones en pantalla
```