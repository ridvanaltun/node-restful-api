# node-restful-api

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## What i used?

- node
- mongoose
- express

## Installation

```bash
# clone the project
$ git clone https://github.com/ridvanaltun/node-restful-api.git

# navigate to the project
$ cd node-restful-api

# install dependencies
$ npm install
```

## Usage

```bash
# starts mongodb server on your local
$ mongod

# starts node server on 3000
$ npm run start
```

**Endpoints:**

```bash
# list tasks
GET http://localhost:3000/tasks

# get details of a task
GET http://localhost:3000/tasks/:id

# update a task
PUT http://localhost:3000/tasks/:id

# create task
POST http://localhost:3000/tasks
```

You can test in Postman.

## To:Do

- [x] Add JWT (JSON Web Tokens)
- [ ] Add ability to refresh JWT
- [x] Add user endpoints
- [ ] Add Swagger Doc. generator in builds
- [ ] Add API limits for security
- [x] Move all logic to src/
- [ ] Add Travis CI/CD support
- [x] Add Joi and Celebrate support for API validation
- [ ] Add password hashing for mongoose
- [ ] Add Babel to use ES6 syntax
- [ ] Add Agenda to manage cron jobs
- [ ] Create a Dockerfile
