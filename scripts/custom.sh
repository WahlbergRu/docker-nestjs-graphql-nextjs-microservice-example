#!/bin/bash

cd api-gateway && npm i pino-pretty -S && cd -
cd microservices/comments-svc && npm i pino-pretty -S && cd -
cd microservices/mailer-svc && npm i pino-pretty -S && cd -
cd microservices/posts-svc && npm i pino-pretty -S && cd -
cd microservices/users-svc && npm i pino-pretty -S && cd -
