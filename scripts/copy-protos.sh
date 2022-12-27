#!/bin/bash

cp -r ./_proto ./api-gateway/src/ &&
cp -r ./_proto ./microservices/comments-svc/src/ &&
cp -r ./_proto ./microservices/mailer-svc/src/ &&
cp -r ./_proto ./microservices/posts-svc/src/ &&
cp -r ./_proto ./microservices/users-svc/src/
     