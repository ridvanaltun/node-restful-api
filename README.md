# Node RESTful API

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

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

##### JWT_REFRESH_TOKEN_SECRET and JWT_ACCESS_TOKEN_SECRET

```bash
# generate jwt secrets, refresh token and access token can not be same
$ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Usage

```bash
# start MongoDB
$ docker-compose up -d

# start NodeJS server on 3000
$ npm run start
```

## To:Do

- [x] Add JWT (JSON Web Tokens)
- [x] Add ability to refresh token
- [ ] Add API documentation (Swagger) generator
- [ ] Add Postman collection
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
