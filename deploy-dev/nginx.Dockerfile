# Get a reference to the node image
ARG NODE_REPO_NAME="registry.ncats.nih.gov:5000/odp-ui:node"
FROM ${NODE_REPO_NAME} AS node_repo

# NGINX Setup
FROM nginx:1.28.0-alpine3.21-slim

# Deployed UI containers run on port 8000,
# not be confused with local API Backends
EXPOSE 8000

# Install required packages in a single command
RUN apk --no-cache update && \
    apk --no-cache add net-tools nano bash vim curl>=8.4.0 libxml2>=2.12.10

# Remove default Nginx configuration and copy custom config
COPY deploy-dev/nginx.conf /etc/nginx/conf.d/default.conf

# Set the working directory
RUN mkdir -p /var/www/app \
    && mkdir -p /var/www/app/config/ \
    && chmod -R o+rx /var/www/app/

WORKDIR /var/www/app

# Copy build artifacts from the node image
COPY --from=node_repo \
    /var/www/app/dist/*/browser /var/www/app/
