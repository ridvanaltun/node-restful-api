# Alpine variant of the official Node.js Docker image as
# it is just under 40MB compared to 345MB for the main one.
# FROM node:14-alpine as base
FROM node:14 as base

# Create app directory
WORKDIR /src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

EXPOSE 3000

###############################################################################
################################# PRODUCTION ##################################
###############################################################################

FROM base as production

# Setting this variable to production is said to perform three times better
# and has other benefits like cached views, too.
# Running npm install will install only the main dependencies, leaving out the dev dependencies.
ENV NODE_ENV=production

# Next, we run npm ci instead of npm install.
# npm ci is targeted for continuous integration and deployment.
# It is also much faster than npm install because it bypasses some user-oriented features.
# Note that npm ci needs a package-lock.json file to work.
RUN npm ci
# RUN npm ci --production && npm clean cache --force

# Bundle app source.
COPY . ./

# Run the web server.
CMD ["node", "src/app.js"]

###############################################################################
################################# DEVELOPMENT #################################
###############################################################################

FROM base as dev
ENV NODE_ENV=development

# Install specific version of nodemon in any case.
# Install depedencies.
RUN npm install -g nodemon@2.0.7 && npm install

# Bundle app source.
COPY . ./

# Run the web server.
CMD ["nodemon", "src/app.js"]
