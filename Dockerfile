# ---- Stage 1: Build the App ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install packages
RUN npm install

# Copy the rest of your app's code
COPY . .

# Build the production files
RUN npm run build

# ---- Stage 2: Serve the App ----
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your built React/Vite app from Stage 1 into Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
