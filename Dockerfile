# Base image Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies)
RUN npm ci

# Copy semua file project
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
