FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npx prisma generate
CMD ["sh", "-c", "echo 'Waiting for DB...' && sleep 5 && echo 'Running migrations...' && npx prisma migrate deploy && echo 'Starting app...' && npm run start:dev"]
