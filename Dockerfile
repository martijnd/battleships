# Base stage for building both client and server
FROM node:18-alpine AS base
WORKDIR /workspace

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-lock.yaml ./
COPY . ./

# Install dependencies for both apps
RUN pnpm install

# Build the client app
FROM base AS client-build
WORKDIR /workspace/apps/client
RUN pnpm build

# Nginx stage for serving the client app
FROM nginx:alpine AS nginx-client
COPY --from=client-build /workspace/apps/client/dist /usr/share/nginx/html

# Node.js stage for running the server
FROM base AS node-server
WORKDIR /workspace/apps/server
EXPOSE 3000
CMD ["pnpm", "start"]

