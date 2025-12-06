# Use an official node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema BEFORE running npm install
COPY prisma ./prisma/

# Install dependencies (this will run prisma generate via postinstall)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 7777

# Define the command to run your application
CMD npx prisma migrate deploy && node ./src/server.js