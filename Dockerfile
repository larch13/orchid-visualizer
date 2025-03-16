FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy all files
COPY . .

# Enable Docker to cache the node_modules
VOLUME [ "/app/node_modules" ]

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "dev"]