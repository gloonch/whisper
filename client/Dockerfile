# =========================================
# Dev target (hot reload)
# =========================================
FROM node:20 AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
# Source will be mounted in compose
EXPOSE 3000
CMD ["npm", "start"]

# =========================================
# Prod target (build static)
# =========================================
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# (Optional) a simple static server
FROM node:20 AS prod
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
