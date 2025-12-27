FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
ARG PUBLIC_API_BASE_URL=http://localhost:3000
ENV PUBLIC_API_BASE_URL=${PUBLIC_API_BASE_URL}
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
