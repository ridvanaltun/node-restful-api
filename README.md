# Node RESTful API

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> An example of REST API infrastructure using Node + Express + MongoDB.

## Postman Collection

Test the API with Postman easily.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/27f530d3328ab087602c#?env%5BNode%20REST%20API%5D=W3sia2V5IjoiYmFzZSIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiYWNjZXNzVG9rZW4iLCJ2YWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqVm1PREl3WkdZM01URm1ZV1F4TUdVelkySmtPVFl5TUNJc0luVnpaWEp1WVcxbElqb2liV0Z5YW05eWVUTXhJaXdpY205c1pTSTZJbUpoYzJsaklpd2lhV0YwSWpveE5qQXlNelU0TnpjMUxDSmxlSEFpT2pFMk1ESXpOakl6TnpWOS51amYtZG10clhSS0VQN2c3ZXZVY1h2cndqTmRaZnhJcTF5ZFVNSldIRnJNIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJyZWZyZXNoVG9rZW4iLCJ2YWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqVm1PREl3WkdZM01URm1ZV1F4TUdVelkySmtPVFl5TUNJc0luVnpaWEp1WVcxbElqb2liV0Z5YW05eWVUTXhJaXdpY205c1pTSTZJbUpoYzJsaklpd2lhV0YwSWpveE5qQXlNelU0TnpjMUxDSmxlSEFpT2pFMk1ESXpOalU1TnpWOS5pQWFqbnVyYi1pUkxHR0tpT2ttaTh0elh0a05rRE9PamlZNzBEdk05amFFIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0YXNrSWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidXNlcm5hbWUiLCJ2YWx1ZSI6Im1hcmpvcnkzMSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicGFzc3dvcmQiLCJ2YWx1ZSI6Il91ZGQwc3M2bExacUlydSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicmVmcmVzaExvZ0lkIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6ImVtYWlsIiwidmFsdWUiOiJoYWxleV93aWxkZXJtYW5AaG90bWFpbC5jb20iLCJlbmFibGVkIjp0cnVlfV0=)

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

# create global volume for Redis
$ docker volume create --name=node-app-redis-data

# create your own environment file
$ cp .env.example .env
```

### Customize Your Environment File

Don't forget customize your environment file.

- *JWT_REFRESH_TOKEN_SECRET*
- *JWT_ACCESS_TOKEN_SECRET*

```bash
# generate jwt secrets, refresh token and access token can not be same
$ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- *EMAIL_HOST*
- *EMAIL_HOST_USER*
- *EMAIL_HOST_PASSWORD*
- *EMAIL_PORT*

```
For email variables you can create a fake SMTP server using [Mailtrap](https://mailtrap.io/) for development purposes.
With Mailtrap all emails automatically forward to your Mailtrap inbox.
```

- *EMAIL_ADDRESS_NO_REPLY*

```
The activation code is sent by this email address.
```

- *FRONTEND_ADDRESS*
- *FRONTEND_EMAIL_VERIFICATION_PATH*
- *FRONTEND_RESET_PASSWORD_PATH*
- *FRONTEND_LOGO_URL*

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

- `MongoDB` runs at 27017
- `Mogoku` runs at 3100
- `Redis` runs at 6379
- `Redis Commander` runs at 8081

## To:Do

- [x] Add JWT (JSON Web Tokens)
- [x] Add ability to refresh JWT token
- [x] Add ability to blacklist JWT token on logout
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
- [x] Add access control system
- [ ] Add auto semantic release with a CI/CD tool
