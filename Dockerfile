# Use the official Node.js image as the base image
FROM node:17

# Set the working directory
WORKDIR /app

# Set the NODE_OPTIONS environment variable to include --openssl-legacy-provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build"]