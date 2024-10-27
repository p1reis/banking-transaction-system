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

# Copy configuration files:
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .

# Copy source code and Prisma files:
COPY ./src ./src

# Generate Prisma client
RUN pnpm exec prisma generate

# Build project
RUN pnpm run build

# Run the application
CMD ["pnpm", "run", "start"]