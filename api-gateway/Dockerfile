FROM node:18 as build

WORKDIR /usr/share/api-gateway

ADD dist package.json ./

ADD src/graphql/schema ./schema

RUN npm install --production

FROM node:18

WORKDIR /usr/share/api-gateway

COPY --from=build /usr/share/api-gateway .

EXPOSE 3000

CMD ["node", "main.js"]
