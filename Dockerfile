FROM node:lts-alpine

# Create app directory
WORKDIR /usr/app

# copy files
COPY package*.json ./
COPY tsconfig.json ./

# Install app dependencies
RUN npm install
# COPY ./src ./src

CMD ["npm", "run", "dev"]
