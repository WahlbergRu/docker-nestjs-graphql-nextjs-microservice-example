#!/bin/bash

cd api-gateway && npm i --force && cd -
cd microservices/comments-svc && npm i --force && cd -
cd microservices/mailer-svc && npm i --force && cd -
cd microservices/posts-svc && npm i --force && cd -
cd microservices/users-svc && npm i --force && cd -
