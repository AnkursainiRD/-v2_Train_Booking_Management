FROM node:18

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (if your app uses port 3000, for example)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
