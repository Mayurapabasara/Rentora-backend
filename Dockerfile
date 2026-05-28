# Use Base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json file
COPY package*.json ./

# install the dependencies
RUN npm install

# Copy the source code
COPY . .

EXPOSE 5000

CMD ["npm","start"]