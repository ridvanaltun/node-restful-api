# Node RESTful API

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> An example of REST API infrastructure using Node + Express + MongoDB.

## Postman Collection

Test the API with Postman easily.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/27f530d3328ab087602c#?env%5BNode%20REST%20API%5D=W3sia2V5IjoiYmFzZSIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiYWNjZXNzVG9rZW4iLCJ2YWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeWJtRnRaU0k2SW5WelpYSnVZVzFsWVdFaUxDSnBZWFFpT2pFMk1ERXlOekF4T0RRc0ltVjRjQ0k2TVRZd01USTNNemM0TkgwLi1vWlFKaElReFgyYWladEo2SHpPSmNhSDlaMEU4YURkU3hzVWJTd1JrUzQiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InJlZnJlc2hUb2tlbiIsInZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5Ym1GdFpTSTZJblZ6WlhKdVlXMWxZV0VpTENKcFlYUWlPakUyTURFeU56QXhPRFFzSW1WNGNDSTZNVFl3TVRJM056TTROSDAudndlbmdLQUVtM0E1LUhPQWFNRDdqUU5hNkpoeUFnWWNVczRrLV9TcVl1YyIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidGFza0lkIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InVzZXJuYW1lIiwidmFsdWUiOiJ1c2VybmFtZWFhIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJwYXNzd29yZCIsInZhbHVlIjoicGFzc3dvcmQiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6ImxvZ0lkIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlfV0=)

## Technical Stuff

- NodeJS
- MongoDB
- Express

## Prerequisite

You need to install `docker` and `docker-compose` in your machine to run database.

## Installation

```bash
# clone the project
$ git clone https://github.com/ridvanaltun/node-restful-api.git

# navigate to the project folder
$ cd node-restful-api

# install dependencies
$ npm install

# create global volume for MongoDB
$ docker volume create --name=node-app-database-data

# create your own environment file
$ cp .env.example .env
```

### Customize Your Environment File

Don't forget customize your environment file.

- *JWT_REFRESH_TOKEN_SECRET* and *JWT_ACCESS_TOKEN_SECRET*

```bash
# generate jwt secrets, refresh token and access token can not be same
$ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- *EMAIL_HOST*, *EMAIL_HOST_USER*, *EMAIL_HOST_PASSWORD* and *EMAIL_PORT*

```
For email variables you can create a fake SMTP server using [Mailtrap](https://mailtrap.io/) for development purposes.
With Mailtrap all emails automatically forward to your Mailtrap inbox.
```

- *EMAIL_ADDRESS_NO_REPLY*

```
The activation code is sent by this email address.
```

- *FRONTEND_ADDRESS*, *FRONTEND_EMAIL_VERIFICATION_PATH* and *FRONTEND_LOGO_URL*

```
These configuration variables are using by activation email.
```

## Usage

```bash
# start MongoDB and Mogoku (MongoDB Collection Viewer)
$ docker-compose up -d

# start NodeJS server on 3000
$ npm run start
```

`MongoDB` run at 27017 and `Mogoku` run at 3100 as default.

## To:Do

- [x] Add JWT (JSON Web Tokens)
- [x] Add ability to refresh token
- [ ] Add API documentation (Swagger) generator
- [x] Add Postman collection
- [x] Add API limitter for security
- [x] Add Joi and Celebrate support for API validation
- [x] Add password hashing
- [x] Add cron jobs manager (Agenda)
- [ ] Add API versioning
- [x] Add pagination
- [x] Run server with environment (dev, prod)
- [ ] Add login and logout logs
- [x] Add request logger
- [ ] Add documantation for pagination and endpoints
- [ ] Add role based access control
- [ ] Add auto semantic release with a CI/CD tool
