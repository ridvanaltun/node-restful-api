# Node RESTful API <!-- omit in toc -->

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> An example of REST API infrastructure which uses Node, Express and MongoDB.

## Postman Collection

Test the API with Postman easily.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/27f530d3328ab087602c?action=collection%2Fimport#?env%5BNode%20REST%20API%5D=W3sia2V5IjoiYmFzZSIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJhY2Nlc3NUb2tlbiIsInZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpZd1kyWXpNMll6WW1Rd1lqTTBOREUwWXpZeU5HTXdZaUlzSW5WelpYSnVZVzFsSWpvaWNtVmhaMkZ1T0RFaUxDSnliMnhsSWpvaVltRnphV01pTENKcFlYUWlPakUyTWpReE9UUTJPRGtzSW1WNGNDSTZNVFl5TkRFNU9ESTRPWDAuY1ZLS2UyS3kwcHFVUEhQTlZfUUJBZUpNb04xcTNNUHVEcUFVbFF6OGdEdyIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicmVmcmVzaFRva2VuIiwidmFsdWUiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall3WTJZek0yWXpZbVF3WWpNME5ERTBZell5TkdNd1lpSXNJblZ6WlhKdVlXMWxJam9pY21WaFoyRnVPREVpTENKeWIyeGxJam9pWW1GemFXTWlMQ0pwWVhRaU9qRTJNalF4T1RRMk9Ea3NJbVY0Y0NJNk1UWXlOREl3TVRnNE9YMC5uRHBNeU5LQnVmaTJIX0dtNmN5SE8yYVpSN3kybEZLeXBQek5EQ0ZJOTJFIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0YXNrSWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidXNlcm5hbWUiLCJ2YWx1ZSI6InJlYWdhbjgxIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJwYXNzd29yZCIsInZhbHVlIjoiOWRtekRmdDVpaW5wQUNjIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJyZWZyZXNoTG9nSWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiZW1haWwiLCJ2YWx1ZSI6ImNvcm5lbGl1czcyQHlhaG9vLmNvbSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidmVyc2lvbiIsInZhbHVlIjoidjEuMCIsImVuYWJsZWQiOnRydWV9XQ==)

# Table of Contents <!-- omit in toc -->

- [Prerequisite](#prerequisite)
- [Installation](#installation)
  - [Customizing Environment File](#customizing-environment-file)
    - [JWT Secrets](#jwt-secrets)
    - [E-Mail Server](#e-mail-server)
    - [E-Mail Addreses](#e-mail-addreses)
    - [Activation E-Mail Related](#activation-e-mail-related)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
- [API Versioning](#api-versioning)
- [Checklist](#checklist)

# Prerequisite

Install `docker` and `docker-compose` in your machine to ability run everything.

# Installation

```bash
# clone the project
$ git clone https://github.com/ridvanaltun/node-restful-api.git

# navigate to the project folder
$ cd node-restful-api

# install dependencies
$ npm install

# create global volume for MongoDB
$ docker volume create --name=node-app-database-data

# create global volume for Redis
$ docker volume create --name=node-app-redis-data

# create your own environment file for development
$ cp .env.example .env

# create your own environment file for production
$ cp .env.example .env.production
```

## Customizing Environment File

Don't forget to customize your environment file.

### JWT Secrets

Remember, refresh token and access token can not be same.

```bash
# generate jwt secrets
$ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```
JWT_REFRESH_TOKEN_SECRET
JWT_ACCESS_TOKEN_SECRET
```

### E-Mail Server

You can create a fake SMTP server using [Mailtrap](https://mailtrap.io/) for development purposes.
With Mailtrap all emails automatically forward to your Mailtrap inbox.

```
EMAIL_HOST
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
EMAIL_PORT
```

### E-Mail Addreses

Activation code will send using this email address. Example `no-reply@domain.com`.

```
EMAIL_ADDRESS_NO_REPLY
```

### Activation E-Mail Related

These configuration variables are using by activation email.

```
FRONTEND_ADDRESS
FRONTEND_EMAIL_VERIFICATION_PATH
FRONTEND_RESET_PASSWORD_PATH
FRONTEND_LOGO_URL
```

# Usage

You can start the API server for development or production.

## Development

If you wanna move on developing this, go ahead with below command:

```bash
# start everything for development environment
$ docker-compose up -d
```

After all's below services will work:

- `API Server` - runs at 3000 (It is a Node.js app)
- `MongoDB` runs at 27017
- `Mogoku` runs at 3100 (MongoDB Collection Viewer)
- `Redis` runs at 6379
- `Redis Commander` runs at 8081 (Redis Web Management Tool)

**Note:** All changes on API will effects immediately.

## Production

Or you can build up a production environment follow the below command:

```bash
# start everything for production environment
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Below services will start:

- `API Server` - runs at 3000
- `MongoDB` runs at 27017
- `Redis` runs at 6379

**Note:** Changes on API will not effects production.

# API Versioning

API versions are coming from the environment file. For using multiple version of API, use a version control system like git and tag every version on it. After all, you can use tags to deploy spesific version of the API. Version controlling of API on code is possible but it is bit complex. I think this way covers the best practices.

# Checklist

- [x] Add JWT (JSON Web Tokens)
- [x] Add ability to refresh JWT token
- [x] Add ability to blacklist JWT token on logout
- [ ] Add API documentation (Swagger) generator
- [x] Add Postman collection
- [x] Add API limitter for security
- [x] Add Joi and Celebrate support for API validation
- [x] Add password hashing
- [x] Add cron jobs manager (Agenda)
- [x] Add API versioning
- [x] Add pagination
- [x] Run server with environment (dev, prod)
- [ ] Add login and logout logs
- [x] Add request logger
- [ ] Add documantation for pagination and endpoints
- [x] Add access control system
- [ ] Add auto semantic release with a CI/CD tool
- [x] Dockerize everything
- [ ] Deploy API for showcase
- [x] Debugger support for NodeJS app in Docker
