# Use an official node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application's code
COPY . .

# Build the app
RUN npm run build

# Serve the app
CMD [ "npm", "start" ]
