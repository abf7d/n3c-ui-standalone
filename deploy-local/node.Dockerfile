# Stage 1: Build Stage
FROM node:23.11.1-alpine3.21
ARG NPM_BUILD_CMD="build"

# The default node container can't resolve remote hosts on the VPN in some
# cases (like Windows), so this will pull in a certificate bundle and install
# it, if such a file exists.
COPY ca-certificates ca-certificates
RUN <<EOF
if [ -f ca-certificates/bundle.crt ]; then
    cat ca-certificates/bundle.crt >> /etc/ssl/certs/ca-certificates.crt
fi
EOF

# update packages and install build dependencies
RUN apk upgrade --no-cache && \
    apk --update --no-cache add bash git openssh vim nano curl python3 py3-pip

# openssh breaks/overwrites the default alpine certificate handler,
# so we need to re-add the cert bundle from two layers up, if it exists.
RUN <<EOF
if [ -f ca-certificates/bundle.crt ]; then
    cat ca-certificates/bundle.crt >> /etc/ssl/certs/ca-certificates.crt
fi
EOF

# Copy just the package files and install dependencies in a cached layer
WORKDIR /var/www/app
RUN npm config set cafile /etc/ssl/certs/ca-certificates.crt
COPY ./package*.json ./
RUN npm install

# Copy the rest of the app source and build the full project
COPY angular.json tsconfig.json ./package*.json ./
COPY projects ./projects
RUN NODE_OPTIONS=--max_old_space_size=4096 npm run "${NPM_BUILD_CMD}"

# This image won't run correctly as-is when dockerized, so we
# override the entrypoint to give no impression that the server is working
# and also be easier to spin up an image for debugging
#
CMD "bash"
