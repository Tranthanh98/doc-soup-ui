<<<<<<< HEAD
FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
EXPOSE 3000
CMD yarn start
=======
# build stage
FROM node:16-alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
>>>>>>> 8125bd3ea770eedf003bf95cf4c105a35eedc8ca
