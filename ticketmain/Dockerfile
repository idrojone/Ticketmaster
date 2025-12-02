# ============================================
# Stage 1: Build the Angular application
# ============================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install for reproducibility
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production

# ============================================
# Stage 2: Serve the app with Nginx
# ============================================
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built app from the build stage
COPY --from=build /app/dist/ticketmain/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
