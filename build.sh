#!/bin/bash

usage () {
    local ERROR="$1"
    echo -e "\nUsage: build.sh [--n3c] [--node-only] [--nginx-only] [--reinit|-r] [--no-cache|-n] [--verbose|-v] [--help|-h]"

    echo -e "\nBuild the odp-ui LOCAL docker images."
    echo ""
    echo "     --node-only      Only build the UI Node image"
    echo "     --nginx-only     Only build the UI Nginx image; pull from existing node image"
    echo "     --reinit, -r     Delete existing images before building."
    echo "     --no-cache, -n   Invalidate the docker cache."
    echo "     --n3c            Build the N3C deployment instead of ODP."
    echo "     --verbose, -v    Print extra things"
    echo "     --help, -h       Show this help"
    echo ""
    if [ -n "${ERROR}" ]; then
        echo -e "\n*Error*: ${ERROR}\n"
        exit 1
    fi
    exit 0
}

VERBOSE=false
USE_BUILD_CACHE=true
BUILD_NODE=true
BUILD_NGINX=true
BUILD_N3C=false
REINIT=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        #-o|--output) shift; OUTPUTPATH=$1; shift;;
        --node-only) BUILD_NGINX=false; shift;;
        --nginx-only) BUILD_NODE=false; shift;;
        -r|--reinit) REINIT=true; shift;;
        --n3c) BUILD_N3C=true; shift;;
        -n|--no-cache) USE_BUILD_CACHE=false; shift;;
        -v|--verbose) VERBOSE=true; shift;;
        -h|-\?|--help) usage;;
        -*|--*) usage "Unknown option '$1'" ;;
        *) usage "Unknown positional param $1";; #POSITIONAL=shift;;
    esac
done

set -e

START_TIME=$(date +%s)

if ${BUILD_N3C}; then
    IMAGE_TARGET="odp-ui-n3c"
    DOCKER_PARAM="--n3c"
    DOCKER_COMPOSE_FILE="deploy-local/docker-compose.n3c.yml"
else
    IMAGE_TARGET="odp-ui"
    DOCKER_PARAM="--docker"
    DOCKER_COMPOSE_FILE="deploy-local/docker-compose.odp.yml"
fi

if ${REINIT}; then
    echo -e "\nRemoving any existing image from docker"
    if [ -n "$(docker ps -f "name=${IMAGE_TARGET}" --latest -q)" ]; then
        docker compose -f ${DOCKER_COMPOSE_FILE} down
    fi
    NODE_EXISTS=$(docker images ${IMAGE_TARGET}:node -q)
    if [ -n "${NODE_EXISTS}" ]; then
        echo "   - Removing the ${IMAGE_TARGET}:node NODE docker image"
        docker rmi ${IMAGE_TARGET}:node
    fi
    NGINX_EXISTS=$(docker images ${IMAGE_TARGET} -q)
    if [ -n "${NGINX_EXISTS}" ]; then
        echo "   - Removing the ${IMAGE_TARGET} NGINX docker image"
        docker rmi ${IMAGE_TARGET}
    fi
fi

if ${BUILD_NODE}; then
    echo -e "\nAbout to Build the NODE Image"

    if ${BUILD_N3C}; then
        BUILD_CMD="build:n3c"
    else
        BUILD_CMD="build"
    fi

    docker build -f ./deploy-local/node.Dockerfile \
        $( ! ${USE_BUILD_CACHE} && echo "--no-cache" ) \
        --compress \
        --build-arg="NPM_BUILD_CMD=${BUILD_CMD}" \
        -t ${IMAGE_TARGET}:node \
        .

    END_TIME=$(date +%s)
    echo -e "\nNode Image Built in $(expr ${END_TIME} - ${START_TIME}) s"
else
    echo -e "\n Skipping the build for the node image."
fi


if ${BUILD_NGINX}; then
    echo -e "\nAbout to Build the NGINX Image\n"
    START_TIME=$(date +%s)

    docker build -f ./deploy-local/nginx.Dockerfile \
        $( ! ${USE_BUILD_CACHE} && echo "--no-cache" ) \
        --build-arg="NGINX_CONFIG=config/nginx.local.conf" \
        --build-arg="NODE_REPO_NAME=${IMAGE_TARGET}:node" \
        -t ${IMAGE_TARGET} \
        .
else
    echo -e "\n Skipping the build for the nginx image."
fi

END_TIME=$(date +%s)
echo -e "\nNginx Image Built in $(expr ${END_TIME} - ${START_TIME}) s"

echo -e "\nStart the container with './start.sh ${DOCKER_PARAM}'"