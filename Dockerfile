# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV MOOD=PROD

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 5000

# Run the backend server
CMD ["npm", "run", "start"]
