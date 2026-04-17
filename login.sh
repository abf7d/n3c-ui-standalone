#!/bin/bash

usage () {
    local ERROR="$1"
    echo -e "\nUsage: [--run|-r] [--node|-n] [--n3c] [--param|-p <extra param to docker>] [--help|-h] [--command|-c] [<COMMAND>+] "

    echo -e "\nLogs into one of the ui containers."
    echo ""
    echo "     --run, -r        Runs the login as a new container instead of exec"
    echo "     --node, -n       Log into node (odp-ui:node) container"
    echo "     --n3c            Log into n3c (odp-ui:n3c) container"
    echo "     --nginx          Log into nginx container (default if not --node)"
    echo "     --root           Runs as the root user, not the server running user"
    echo "     --param, -p      Extra docker params"
    echo "     --command, -c    Executes the provided command instead of opening an interactive shell. All positional parameters will also be added to the command"
    echo "     --help, -h       Show this help"
    echo ""
    if [ -n "${ERROR}" ]; then
        echo -e "\n*Error*: ${ERROR}\n"
        exit 1
    fi
    exit 0
}

COMMAND=""
ROOT_USER=false
RUN_CONTAINER=false
RUN_N3C=false
RUN_NODE=false
IMAGE_NAME="odp-ui:latest"
DOCKER_PARAMS=()
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -r|--run) RUN_CONTAINER=true; shift;;
    -n|--node) RUN_NODE=true; shift;;
    --n3c) RUN_N3C=true; shift;;
    --root) ROOT_USER=true; shift;;
    -p|--param) shift; DOCKER_PARAMS+=($1); shift;;
    -c|--command) shift; COMMAND="${COMMAND} $*"; break;;
    -h|-\?|--help) usage;;
    -*|--*=) usage "Unknown option '$1'";;
    *) COMMAND="${COMMAND} $1"; shift;;
  esac
done

if [[ "$(hostname)" == *"ncats.nih.gov" ]]; then
    PRODUCTION=true
else
    PRODUCTION=false
fi

if ${RUN_N3C}; then
    IMAGE_NAME="odp-ui-n3c"
else
    IMAGE_NAME="odp-ui"
fi
if ${RUN_NODE}; then
    IMAGE_NAME="${IMAGE_NAME}:node"
fi

set -e
if ${ROOT_USER}; then
    DOCKER_PARAMS+=("--user=0")
fi

if ! ${RUN_CONTAINER}; then
    # verify if the image exists
    IMAGE_EXISTS="$(docker container ls --filter "name=${IMAGE_NAME}" -q)"
    if [ -z "$IMAGE_EXISTS" ]; then
        # if it's a node/n3c image, assume we want to run it
        if [[ ${IMAGE_NAME} =~ ":node" ]]; then
            RUN_CONTAINER=true
        else
            read -p "No ${IMAGE_NAME} container is currently running - run instead of exec? [Y/n] " confirm
            if [[ ! "${confirm}" =~ "n" ]]; then
                RUN_CONTAINER=true
            fi
        fi
    fi
fi

if ${RUN_CONTAINER}; then
    DOCKER_PARAMS+=(--expose 1337 --expose 8888)
    if ! ${PRODUCTION}; then
        DOCKER_PARAMS+=("--network=odplocal_odplocalnet")
    fi

    if [ -n "${COMMAND}" ]; then
        echo "Running ${COMMAND} in a new ${IMAGE_NAME} container"
        COMMAND="-c ${COMMAND}"
    else
        echo "Starting up bash shell in a new ${IMAGE_NAME} container"
        COMMAND="bash"
    fi

    docker run --rm -it \
        "${DOCKER_PARAMS[@]}" \
        ${IMAGE_NAME} ${COMMAND}
else
    if [ -n "${COMMAND}" ]; then
        echo "Running ${COMMAND} in the current ${IMAGE_NAME} container"
        COMMAND="-c ${COMMAND}"
    else
        echo "Logging into the current ${IMAGE_NAME} container"
        COMMAND="bash"
    fi

    docker exec -it \
        "${DOCKER_PARAMS[@]}" \
        ${IMAGE_NAME} ${COMMAND}
fi

echo -e "\nLogin completed with clean exit!"