# Use a suitable Node.js base image
FROM node:18-slim

WORKDIR /app

# Install OpenSSL and necessary tools
RUN apt-get update -y && apt-get install -y openssl curl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Drizzle configuration and schema
COPY drizzle.config.ts ./
COPY src/ ./src/

# Expose the port that Cloud Run will use
EXPOSE 8080

# Run Drizzle Studio
CMD ["npx", "drizzle-kit", "studio", "--port", "8080", "--host", "0.0.0.0"]