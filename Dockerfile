# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install frontend dependencies and build frontend
RUN cd frontend && npm install && npm run build

# Install backend dependencies
RUN cd backend && npm install

# Expose backend port (change if different)
EXPOSE 4000

# Start backend server (adjust path if needed)
CMD ["node", "backend/server.js"]
