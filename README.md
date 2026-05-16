
# CarboNexFarm — Backend Setup

## Stack
- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **ML**: Built-in simulation (`ml/creditModel.js`) — swap with Flask/ONNX in production
- **Blockchain**: Simulation (`blockchain/verifier.js`) — swap with ethers.js/Web3.js in production

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Start (development)
npm run dev

# 4. Start (production)
npm start
```

## Environment Variables (`.env`)

| Variable          | Default                                    | Description                 |
|-------------------|--------------------------------------------|-----------------------------|
| `PORT`            | `5000`                                     | HTTP port                   |
| `MONGO_URI`       | `mongodb://localhost:27017/carbonexfarm`   | MongoDB connection string   |
| `JWT_SECRET`      | `carbonexfarm_secret_2026`                 | JWT signing secret          |
| `CLIENT_URL`      | `http://localhost:3000`                    | CORS allowed origin         |
| `BLOCKCHAIN_NETWORK` | `carbonex-mainnet-1`                   | Network label in tx records |

## API Endpoints

### Auth
| Method | Path                  | Auth | Description         |
|--------|-----------------------|------|---------------------|
| POST   | `/api/auth/register`  | —    | Register new user   |
| POST   | `/api/auth/login`     | —    | Login, get JWT      |
| GET    | `/api/auth/me`        | ✅   | Current user info   |

### Listings
| Method | Path                    | Auth | Description                 |
|--------|-------------------------|------|-----------------------------|
| GET    | `/api/listings`         | —    | All active listings         |
| GET    | `/api/listings/mine`    | ✅   | Farmer's own listings       |
| POST   | `/api/listings`         | ✅🌾  | Create listing (farmer only)|
| DELETE | `/api/listings/:id`     | ✅🌾  | Cancel listing              |

### Transactions
| Method | Path                          | Auth | Description                    |
|--------|-------------------------------|------|--------------------------------|
| POST   | `/api/transactions/buy`       | ✅🏢  | Purchase listing (company only)|
| GET    | `/api/transactions`           | ✅   | All transactions (paginated)   |
| GET    | `/api/transactions/mine`      | ✅   | User's own transactions        |
| GET    | `/api/transactions/verify/:hash` | — | Verify tx hash on blockchain|

### ML
| Method | Path                  | Auth | Description                  |
|--------|-----------------------|------|------------------------------|
| POST   | `/api/ml/generate`    | ✅🌾  | Generate carbon credits (farmer only) |

Request body:
```json
{ "farmSize": 50, "cropType": "Rice", "practices": ["Organic Farming"], "location": "Punjab" }
```

### Users
| Method | Path                    | Auth | Description           |
|--------|-------------------------|------|-----------------------|
| GET    | `/api/users/leaderboard`| —    | Top users by points   |
| GET    | `/api/users/:id`        | —    | Public user profile   |
| PATCH  | `/api/users/me`         | ✅   | Update own profile    |

## Points System
- Farmer lists credits → **+50 pts**
- Company buys credits → **+50 pts** (buyer)
- Farmer's credits sell → **+100 pts** (seller)

## ML Model
The ML model in `ml/creditModel.js` computes credits using:
```
credits = farmSize × 1.8 × cropMultiplier × practiceMultiplier × regionMultiplier
```
To swap in a real model, replace `generateCarbonCredits()` with an HTTP call to your Flask/FastAPI inference server.

## Blockchain
`blockchain/verifier.js` simulates a 2–3 second mining delay and returns a realistic tx receipt. To use a real EVM chain, replace `broadcastTransaction()` with an `ethers.js` contract call.
