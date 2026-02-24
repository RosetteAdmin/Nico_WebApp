# # Use the official Node.js image as the base image
# FROM node:17

# # Set the working directory
# WORKDIR /app

# # Set the NODE_OPTIONS environment variable to include --openssl-legacy-provider
# ENV NODE_OPTIONS=--openssl-legacy-provider

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code to the working directory
# COPY . .

# # Build the React application
# RUN npm run build

# # Install a simple HTTP server to serve the static files
# RUN npm install -g serve

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the application
# CMD ["serve", "-s", "build"]

# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx (tiny image, no node_modules shipped)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Custom nginx config to handle React routing
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]