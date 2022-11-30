#!/bin/bash

cd api-gateway && npm run copy:protos && cd -
cd microservices/comments-svc && npm run copy:protos && cd -
cd microservices/posts-svc && npm run copy:protos && cd -
cd microservices/users-svc && npm run copy:protos && cd -
cd microservices/mailer-svc && npm run copy:protos && cd -
docker-compose build --no-cache
