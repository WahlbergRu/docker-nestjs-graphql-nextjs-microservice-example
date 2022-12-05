#!/bin/bash

cd api-gateway && npm run build && cd -
cd microservices/comments-svc && npm run build && cd -
cd microservices/posts-svc && npm run build && cd -
cd microservices/users-svc && npm run build && cd -
cd microservices/mailer-svc && npm run build && cd -
docker-compose build --no-cache