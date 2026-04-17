# Stage 1: Build Stage
FROM node:24-alpine3.22
ARG NPM_BUILD_CMD="build"

# update packages and install build dependencies
RUN apk upgrade --no-cache && \
    apk --update --no-cache add bash git openssh vim nano python3 py3-pip curl>=8.4.0

# Copy package files and install dependencies separately to leverage caching
WORKDIR /var/www/app
COPY ./package*.json ./
RUN npm install

# Copy the rest of the app source and build the project
COPY angular.json tsconfig.json ./package*.json ./
COPY projects ./projects
RUN NODE_OPTIONS=--max_old_space_size=4096 npm run "${NPM_BUILD_CMD}"

# This image won't run correctly as-is when dockerized, so we
# override the entrypoint to give no impression that the server is working
# and also be easier to spin up an image for debugging
#
CMD "bash"
