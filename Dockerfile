# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Salin semua source code (kecuali yang di .dockerignore)
COPY . .

# Salin env untuk build (file ini sudah ada di server saat build)
COPY .env.production .env.production

# Build Next.js untuk production
RUN npm run build

# --- Stage 2: Production image ---
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production deps
COPY --from=builder /app/node_modules ./node_modules

# Copy output build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Salin env file ke image (opsional kalau app butuh saat runtime)
COPY .env.production .env.production

EXPOSE 3000

CMD ["npm", "start"]
