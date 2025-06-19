# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build args (supabase env buat build time)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Validasi arg
RUN if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then echo "Error: NEXT_PUBLIC_SUPABASE_URL is not set"; exit 1; fi
RUN if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then echo "Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"; exit 1; fi

# Inject arg ke env (buat Next.js build time)
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build Next.js
RUN npm run build

# Stage 2: Run
FROM node:18-alpine AS runner

WORKDIR /app

# Copy build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Declare runtime env vars
ENV NEXT_PUBLIC_SUPABASE_URL=""
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=""
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]