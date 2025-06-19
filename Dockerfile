# Base image Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start Next.js production server
CMD ["npm", "start"]
