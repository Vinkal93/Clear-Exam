# ClearExam — Local Development & Environment Setup Guide

## Prerequisites
- **Node.js**: v20+ (v24.21.0 recommended)
- **npm**: v10+ (v11.19.0 recommended)
- **Java Development Kit (JDK)**: OpenJDK 17 LTS
- **Android SDK**: Android 35 / 36 platform and build-tools
- **Firebase CLI**: `npm install -g firebase-tools` (optional for emulator)

---

## 1. Initial Monorepo Setup
```bash
# Clone and checkout development branch
git checkout phase-00-foundation

# Install all workspace dependencies
npm install

# Build shared contracts package
npm run build --workspace=@clearexam/contracts
```

---

## 2. Running Services Locally

### 2.1 Backend API (`services/api`)
```bash
cd services/api
npm run dev
# Health check available at http://localhost:8080/healthz
```

### 2.2 Super Admin Web (`apps/admin-web`)
```bash
cd apps/admin-web
npm run dev
# Web admin dashboard available at http://localhost:3000
```

### 2.3 Android Student App (`apps/android`)
```bash
cd apps/android
./gradlew assembleDebug
# Or open apps/android in Android Studio and run on an emulator or physical device
```

### 2.4 Firebase Local Emulators
```bash
firebase emulators:start --only auth,firestore,storage
```

---

## 3. Environment Variables
Copy `.env.example` to `.env` in respective project directories:
- `services/api/.env.example` -> `services/api/.env`
- `apps/admin-web/.env.example` -> `apps/admin-web/.env.local`
- Note: Never commit `.env` or production credentials to version control.
