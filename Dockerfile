FROM node:20-alpine

WORKDIR /app

COPY package*.json /app
COPY pnpm-lock.yaml /app

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 8080

CMD ["npm", "run", "start"]