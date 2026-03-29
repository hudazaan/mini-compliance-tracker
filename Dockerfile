# use Node 18 or 20
FROM node:18-alpine

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy the rest of the code
COPY . .

# build the Next.js app
RUN npm run build

# start the app
EXPOSE 3000
CMD ["npm", "run", "start"]