FROM node:16-alpine as build

WORKDIR /usr/share/api-gateway

ADD dist package.json ./

RUN npm install --production

FROM node:16-alpine

WORKDIR /usr/share/api-gateway

COPY --from=build /usr/share/api-gateway .

EXPOSE 3000

CMD ["node", "main.js"]
