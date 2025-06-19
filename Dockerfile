# Gunakan image Node.js ringan
FROM node:20-alpine AS builder

# Set workdir
WORKDIR /app

# Salin file dependency
COPY package.json package-lock.json* ./

# Install dependency (ci untuk production lock)
RUN npm ci

# Salin semua source code
COPY . .

# Salin env production (kalau ada file .env.production di repo)
COPY .env.production .env.production

# Set env untuk build
ENV NODE_ENV=production

# Build Next.js app
RUN npm run build

# ----------------------------------------
# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Salin dependency hanya untuk production (lebih ringan)
COPY --from=builder /app/node_modules ./node_modules

# Salin Next.js .next output
COPY --from=builder /app/.next ./.next

# Salin public assets
COPY --from=builder /app/public ./public

# Salin package.json untuk start
COPY --from=builder /app/package.json ./

# Salin env production ke runtime (opsional, atau inject dari EC2 env)
COPY --from=builder /app/.env.production .env.production

# Expose port
EXPOSE 3000

# Jalankan app
ENV NODE_ENV=production
CMD ["npm", "start"]
