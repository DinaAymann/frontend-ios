#!/bin/zsh

curl --request POST \
  --url https://local.auth.nhost.run/v1/signup/email-password \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "john.smith@nhost.io",
  "options": {
    "allowedRoles": [
      "me",
      "user"
    ],
    "defaultRole": "user",
    "displayName": "John Smith",
    "locale": "en",
    "metadata": {
      "firstName": "John",
      "lastName": "Smith"
    },
    "redirectTo": "http://localhost:3000/home"
  },
  "password": "Str0ngPassw#ord-94|%"
}'