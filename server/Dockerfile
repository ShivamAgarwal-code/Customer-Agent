FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install
COPY . .
RUN npm run build
RUN npm run db:migrate


CMD ["npm", "run", "start"]