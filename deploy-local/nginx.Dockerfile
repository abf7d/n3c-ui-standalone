# Get a reference to the node image
ARG NODE_REPO_NAME="odp-ui:node"
FROM ${NODE_REPO_NAME} AS node_repo

# NGINX Setup
FROM nginx:1.28.0-alpine3.21-slim

# Expose the FastAPI Port
EXPOSE 8000


# The root nginx container is smarter than node when it comes to SSL
# connections to the global alpine package repository,
# but when trying to use DEV or QA API backends,
# the self-signed NIH certificates are required.
COPY ca-certificates ca-certificates
RUN <<EOF
if [ -f ca-certificates/bundle.crt ]; then
    cat ca-certificates/bundle.crt >> /etc/ssl/certs/ca-certificates.crt
fi
EOF

# Install required packages in a single command
RUN apk add net-tools nano bash vim curl

# Remove default Nginx configuration and copy custom config
COPY deploy-local/nginx.conf.template /etc/nginx/templates/default.conf.template

# Set the working directory
RUN mkdir -p /var/www/app \
    && mkdir -p /var/www/app/config/ \
    && chmod -R o+rx /var/www/app/

WORKDIR /var/www/app

# Copy build artifacts from the node image
COPY --from=node_repo \
    /var/www/app/dist/*/browser /var/www/app/
