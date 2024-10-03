
FROM node:20-bookworm-slim as dev

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm","run","dev"]

FROM node:20-bookworm-slim as prod
CMD echo "Hello"

# 