FROM node:18-alpine AS builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS server
WORKDIR /usr/app
COPY package* ./
RUN npm ci
# COPY ./.env ./
COPY --from=builder ./usr/app/build ./build
EXPOSE 5161
CMD ["npm", "start"]
