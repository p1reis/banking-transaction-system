# Define the base version Node.js image:
FROM node:22.10.0-alpine3.20 as build

# Set working directory:
WORKDIR /app

# Copy package*.json and pnpm-lock.json to the working directory:
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies:
RUN pnpm install

COPY . .

# Specify that the container will listen on port 3333 at runtime
EXPOSE 3333

# Generate Prisma client:
RUN pnpm exec prisma generate

# Run the application
CMD ["pnpm", "start"]