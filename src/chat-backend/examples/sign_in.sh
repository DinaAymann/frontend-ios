#!/bin/zsh

curl --request POST \
  --url https://local.auth.nhost.run/v1/signin/email-password \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "john.smith@nhost.io",
  "password": "Str0ngPassw#ord-94|%"
}'