
FROM node:21-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

# RUN npm install -g serve

ENV PORT=4173

EXPOSE 4173

# CMD [ "serve", "-s", "dist" ]
CMD ["npm","run","preview"]