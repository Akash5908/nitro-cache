# 🚀 NitroCache

> A high-performance caching layer for Node.js APIs using Redis and Promise Memoization

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.2-green.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-5.10-red.svg)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-30.2-C21325.svg)](https://jestjs.io/)

## ⚡ Performance Metrics

| Metric                | Before            | After         | Improvement       |
| --------------------- | ----------------- | ------------- | ----------------- |
| **Response Time**     | 2000ms            | ~15ms         | **133x faster**   |
| **Database Queries**  | 100 per request   | 1 per request | **99% reduction** |
| **Concurrent Safety** | ❌ Cache Stampede | ✅ Protected  | **100% safe**     |

## 🎯 Problem Statement

High-traffic APIs face three critical challenges:

1. **Slow Database Queries**: Repeated identical queries waste resources
2. **Cache Stampede**: When cache expires, concurrent requests overwhelm the database
3. **Inconsistent Performance**: Response times vary wildly based on cache state

## 💡 Solution

NitroCache implements a **dual-layer caching strategy**:

```
Request → Layer 1: In-Memory Promise Memoization (Thundering Herd Protection)
       ↓
       Layer 2: Redis Distributed Cache (Persistent Storage)
       ↓
       Database (Fallback)
```

### Key Innovations

1. **🛡️ Promise Memoization** (Thundering Herd Protection)
   - Stores active promises instead of resolved values
   - Ensures only ONE database query per key, even with 1000+ concurrent requests
   - Automatic cleanup after resolution

2. **📦 Cache-Aside Pattern**
   - Application manages cache explicitly
   - Database remains source of truth
   - Flexible invalidation strategies

3. **⚡ Redis Integration**
   - Distributed caching across multiple instances
   - Exponential backoff with jitter for reconnection
   - Graceful degradation on Redis failure

## 🏗️ Architecture

```
nitrocache/
├── src/
│   ├── config/
│   │   └── redis.ts              # Redis client with retry logic
│   ├── controllers/
│   │   └── product.ts            # API routes with caching
│   ├── middlewares/
│   │   ├── cache.ts              # Cache-aside logic
│   │   └── rateLimiter.ts        # Rate limiting
│   ├── services/
│   │   └── product.ts            # Database interactions
│   ├── utils/
│   │   └── stampede.ts           # Promise memoization
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Entry point
├── tests/
│   ├── integration/
│   │   └── product.test.ts       # API integration tests
│   └── unit/
│       ├── cache.test.ts         # Cache middleware tests
│       └── stampede.test.ts      # Promise memoization tests
├── frontend/                     # 🎨 Dashboard UI
│   ├── index.html                # Main HTML file
│   ├── style.css                 # Styling
│   └── app.js                    # Frontend logic
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data generation
├── docker-compose.yml            # Development environment
└── README.md                     # This file
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.9
- **Framework**: Express.js 5.2
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 6.19
- **Cache**: Redis 7+
- **Testing**: Jest 30.2 + Supertest
- **Validation**: Zod
- **Rate Limiting**: Express Rate Limit
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)

## 📦 Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- pnpm (or npm/yarn)

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/nitrocache.git
cd nitrocache
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server
PORT=5001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nitrocache?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

4. **Start Redis & PostgreSQL** (using Docker)

```bash
docker-compose up -d
```

Or manually start Redis and PostgreSQL on your machine.

5. **Set up database**

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# Seed sample data (10,000 products)
pnpm prisma db seed
```

6. **Build the project**

```bash
pnpm tsc -b
```

7. **Run the application**

```bash
pnpm start
```

Server will start on `http://localhost:5001`

## 🎨 Frontend Dashboard

NitroCache includes a modern, interactive dashboard to visualize and test the caching functionality in real-time.

### Features

- **📊 Real-time Metrics**: Track response times, cache hit rates, and total requests
- **🎯 API Tester**: Interactive interface to test GET and PATCH endpoints
- **🏃 Load Testing**: Simulate concurrent requests to test cache stampede protection
- **📈 Performance Visualization**: See before/after performance comparisons
- **📜 Request History**: Log of all requests with cache hit/miss indicators

### Running the Frontend

1. **Navigate to the frontend directory**

```bash
cd frontend
```

2. **Start a local server** (choose one):

Using Python (if installed):

```bash
python3 -m http.server 8080
```

Using Node.js (http-server):

```bash
npx http-server -p 8080
```

Using VS Code:

- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

3. **Open your browser**

```
http://localhost:8080
```

### Frontend Demo

![Dashboard Preview](docs/dashboard-preview.png)

_The dashboard shows real-time performance metrics and allows you to test the caching functionality with a single click._

### Frontend Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **Vanilla JavaScript** - No frameworks, pure performance
- **Fetch API** - Async HTTP requests
- **Responsive Design** - Works on mobile and desktop

### 🚀 Deploy Frontend on Vercel

Deploy the dashboard globally in seconds:

```bash
cd frontend

# Update the API URL in index.html
# window.API_URL = 'https://your-backend-url.render.com';

# Deploy with Vercel CLI
vercel --prod
```

**Prerequisites:**
- Backend API must be deployed first (Render, Railway, etc.)
- Update CORS settings on backend to allow your Vercel domain
- Install Vercel CLI: `npm i -g vercel`

**Full deployment guide:** See [frontend/DEPLOY.md](frontend/DEPLOY.md)

## 🧪 Testing

### Run All Tests

```bash
pnpm test
```

### Run Unit Tests Only

```bash
pnpm test -- tests/unit
```

### Run Integration Tests Only

```bash
pnpm test -- tests/integration
```

### Run Tests with Coverage

```bash
pnpm test -- --coverage
```

## 🚀 API Endpoints

### Products

#### Get Product by ID

```http
GET /api/products/:id
```

**Response** (Cache Hit):

```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "price": "99.99",
    "description": "Premium wireless headphones"
  }
}
```

**Response** (Cache Miss - First Request):

```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "price": "99.99",
    "description": "Premium wireless headphones"
  }
}
```

_Response Time: ~2000ms (database query)_

**Response** (Cache Hit - Subsequent Requests):

```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "price": "99.99",
    "description": "Premium wireless headphones"
  }
}
```

_Response Time: ~15ms (Redis cache)_

#### Update Product

```http
PATCH /api/products/:id
```

**Request Body**:

```json
{
  "name": "Updated Name",
  "price": "149.99",
  "description": "Updated description"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Successfully updated the product."
}
```

_Note: Updates both database and cache (Write-Through strategy)_

### Health Check

```http
GET /health
```

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2025-02-07T10:30:00Z"
}
```

## 🔥 Load Testing

Test cache stampede protection:

```bash
# Install Apache Bench (if not already installed)
# macOS: brew install apache2
# Ubuntu: sudo apt-get install apache2-utils

# Run 100 concurrent requests for product ID 1
ab -n 100 -c 100 http://localhost:5001/api/products/1
```

**Expected Results**:

- ✅ Only 1 database query executed (due to promise memoization)
- ✅ All 100 requests served successfully
- ✅ Response time: ~2000ms for first request, ~15ms for rest

## 🎯 Key Features

### 1. Promise Memoization (Thundering Herd Protection)

```typescript
// Before (1000 concurrent requests = 1000 DB queries)
const product = await prisma.product.findUnique({ where: { id } });

// After (1000 concurrent requests = 1 DB query)
const product = await PromiseMemorization(id);
```

**How it works**:

1. First request creates a promise and stores it in Map
2. Concurrent requests check Map and receive the same promise
3. After resolution, promise is deleted from Map
4. Subsequent requests hit Redis cache

### 2. Cache-Aside Pattern

```
Read: Check Redis → Miss? → Query DB → Store in Redis → Return
Write: Update DB → Update/Invalidate Redis → Return
```

### 3. Redis Reconnection Strategy

- Exponential backoff: 100ms → 200ms → 400ms → ... → 3000ms max
- Jitter added to prevent thundering herd on Redis recovery
- Graceful degradation (serves from DB if Redis down)

### 4. Rate Limiting

- Global rate limit: 100 requests per 15 minutes per IP
- Protection against DDoS and abuse
- Standard headers for rate limit info

## 🎓 Learning Outcomes

### Technical Skills

- ✅ **Redis**: Distributed caching, connection management, failover
- ✅ **Promise Patterns**: Advanced async handling, memoization
- ✅ **TypeScript**: Type safety, module systems, ES2020 features
- ✅ **Testing**: Unit tests, integration tests, load testing
- ✅ **Performance**: Optimization, benchmarking, monitoring

### Engineering Principles

- ✅ **Separation of Concerns**: Clear module boundaries
- ✅ **Fail-Safe Design**: Graceful degradation on cache failures
- ✅ **Observability**: Structured logging, health checks, metrics
- ✅ **Scalability**: Horizontal scaling ready with Redis

## 🐛 Known Issues

1. **Cache Drift**: If database is updated outside the API, cache becomes stale
   - **Workaround**: Use TTL or manual cache invalidation
   - **Fix**: Implement cache versioning or CDC (Change Data Capture)

2. **Redis Memory**: Large datasets may exceed Redis memory
   - **Workaround**: Implement LRU eviction policy
   - **Fix**: Add cache size limits and compression

## 📚 Resources

- [Redis Documentation](https://redis.io/documentation)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Cache Patterns](https://www.prisma.io/dataguide/managing-databases/introduction-database-caching)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Redis**: For the amazing in-memory data structure store
- **Prisma**: For the type-safe database toolkit
- **Express**: For the fast, unopinionated web framework

---

**Built with ❤️ by Akash**

**Connect with me:**

- Twitter: https://x.com/Akash6398_
- LinkedIn: https://www.linkedin.com/in/akash-kumar-7810622a5/

_Star ⭐ this repo if you found it helpful!_
