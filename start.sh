#!/bin/sh

usage () {

    echo "Usage: start.sh [--docker] [--n3c] [--dev|-d] [[--api|-a|--env|-e] <ENV>] [--port|-p <port>] [--help|-h]"
    echo -e "\nStart the LOCAL UI frontend server."
    echo -e "\nBy default, start.sh tests to see if you have local API, STRAPI"
    echo    "and staticfiles instances running and will use those, otherwise the"
    echo    "relevant DEV instances."
    echo -e "\nOverride this behavior with --env, --strapi, --static"
    echo ""
    echo "     --docker             Run in docker (build images with ./build.sh)"
    echo "     --n3c                Run the N3C app (build images with ./build.sh)"
    echo "     --env, -e <ENV>      Specify the environment config (DEV/QA/PROD/DEMO/V2)"
    echo "     --api, -a <ENV>      Specify an alternate API backend (DEV/QA/PROD/DEMO/V2). By default, will use ENV"
    echo "     --strapi <ENV>       Specify an alternate backend for STRAPI (DEV/QA/PROD)"
    echo "     --static, -s <ENV>   Specify an alternate backend for Static fileserver (DEV/QA/PROD)"
    echo "     --dev, -d            Use DEV API Backend (shorthand for --api DEV)"
    echo "     --demo               Use DEMO API Backend (shorthand for --api DEMO)"
    echo "     --port, -p <PORT>    Specify an alternate port (default is 4200)"
    echo "     --v2                 Use the deprecated APIv2 endpoint ('/covid19-api-v2')"
    echo "     --help, -h           Show this help"
    echo ""
    if [ -n "$1" ]; then
        echo -e "\nError: $1"
        exit 1
    fi
    exit 0
}

DOCKER_APP=
ENV=
APP="odp-app"
PORT="4200"
ODP_API_SERVER=
STRAPI_SERVER=
STATICFILE_SERVER=

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --docker) DOCKER_APP="odp"; shift;;
    --n3c) DOCKER_APP="n3c"; APP="n3c-app"; shift;;
    -d|--dev) ENV="DEV"; shift;;
    -a|--api|-e|--env|--environment) shift; ENV=$1; shift;;
    -s|--strapi) shift; STRAPI_SERVER=$1; shift;;
    --static) shift; STATICFILE_SERVER=$1; shift;;
    -p|--port) shift; PORT=$1; shift;;
    LOCAL|DEV|QA|PROD|DEMO|V2) ENV=$1; shift;;
    -h|-\?|--help) usage;;
    -*|--*=) usage "Unknown option '$1'" ;;
    *) usage "Unknown extra positional param $1" ;;
  esac
done

if [ -z "${ENV}" ]; then
    if [ -z "${ODP_API_SERVER}" ]; then
        ENV="LOCAL"
    else
        ENV="${ODP_API_SERVER}"
    fi
elif [ -z "${ODP_API_SERVER}" ]; then
    ODP_API_SERVER="${ENV}"
fi


ENV=$(echo "${ENV}" | tr '[:lower:]' '[:upper:]')
LABEL="${ENV}"

if [ ${ENV} == "DEMO" ]; then
    UI_BACKEND_TARGET="dev-demo"
elif [ ${ENV} == "V2" ]; then
    UI_BACKEND_TARGET="dev-v2"
else
    UI_BACKEND_TARGET=$(echo "${ENV}" | tr '[:upper:]' '[:lower:]')
fi

# Ensure the backend config is defined
if [ ! -f "config/${UI_BACKEND_TARGET}.json" ]; then
    echo -e "\nERROR: ${UI_BACKEND_TARGET}.json Backend API config not found"
    exit 2
fi

# Identify the urls for the api/strapi/staticfiles backends
if [ -n "${ODP_API_SERVER}" ]; then
    echo " - Using ${ODP_API_SERVER} API as API backend"
    ODP_API_SERVER="https://opendata-$(echo "${ODP_API_SERVER}" | tr '[:upper:]' '[:lower:]').ncats.nih.gov"
else
    if $(curl http://127.0.0.1:8000/ 2>/dev/null 1>/dev/null); then
        echo " - Using Local API as API backend"
        ODP_API_SERVER="http://127.0.0.1:8000"
        API_PROXY_SERVER="http://host.docker.internal:8000/"
    else
        echo " - Using DEV API as API backend"
        ODP_API_SERVER="https://opendata-dev.ncats.nih.gov"
    fi
fi
if [ -n "${STRAPI_SERVER}" ]; then
    echo " - Using ${STRAPI_SERVER} STRAPI server as strapi backend"
    STRAPI_SERVER="https://n3c-strapi-opendata-$(echo "${STRAPI_SERVER}" | tr '[:upper:]' '[:lower:]').ncats.nih.gov"
else
    if $(curl http://127.0.0.1:1337/ 2>/dev/null 1>/dev/null); then
        echo " - Using Local STRAPI server as strapi backend"
        STRAPI_SERVER="http://127.0.0.1:1337"
        STRAPI_PROXY_SERVER="http://host.docker.internal:1337/"
    else
        echo " - Using DEV STRAPI server as strapi backend"
        STRAPI_SERVER="https://n3c-strapi-opendata-dev.ncats.nih.gov"
    fi
fi
if [ -n "${STATICFILE_SERVER}" ]; then
    echo " - Using ${STATICFILE_SERVER} staticfiles server as static backend"
    STATICFILE_SERVER="https://opendata-$(echo "${STATICFILE_SERVER}" | tr '[:upper:]' '[:lower:]').ncats.nih.gov"
else
    if $(curl http://127.0.0.1:9000/ 2>/dev/null 1>/dev/null); then
        echo " - Using Local statickfiles server as static backend"
        STATICFILE_SERVER="http://127.0.0.1:9000"
        STATICFILE_PROXY_SERVER="http://host.docker.internal:9000/"
    else
        echo " - Using DEV statickfiles server as static backend"
        STATICFILE_SERVER="https://opendata-dev.ncats.nih.gov"
    fi
fi

set -e

if [ -z "${API_PROXY_SERVER}" ]; then
    API_PROXY_SERVER="${ODP_API_SERVER}:443/api/"
fi
if [ -z "${STRAPI_PROXY_SERVER}" ]; then
    STRAPI_PROXY_SERVER="${STRAPI_SERVER}:443/"
fi
if [ -z "${STATICFILE_PROXY_SERVER}" ]; then
    STATICFILE_PROXY_SERVER="${STATICFILE_SERVER}:443/static/"
fi

export API_PROXY_SERVER
export STRAPI_PROXY_SERVER
export STATICFILE_PROXY_SERVER
export ODP_API_SERVER
export STRAPI_SERVER
export STATICFILE_SERVER

# set up config file
mkdir -p projects/odp-app/src/config/  # just to make sure the directory exists
envsubst < config/local.json.template > projects/odp-app/src/config/config.json
envsubst < config/local-proxy.conf.template > projects/local-proxy.conf.json

#
# DOCKER RUNTIME
#
if [ -n "${DOCKER_APP}" ]; then
    DOCKER_LABEL=$(echo "${DOCKER_APP}" | tr '[:lower:]' '[:upper:]')
    echo "Running the Dockerized ${DOCKER_LABEL} UI with the ${LABEL} API Backend"
    docker compose -f deploy-local/docker-compose.${DOCKER_APP}.yml down
    export PORT
    export UI_BACKEND_TARGET
    echo "Navigate to http://localhost:${PORT}"
    docker compose -f deploy-local/docker-compose.${DOCKER_APP}.yml up
    exit 0
fi

#
# LOCAL RUNTIME
#
echo "Running the UI locally with the ${LABEL} API Backend"

if [ $? != 0 ]; then
    echo -e "\nERROR: Failed to set up config file"
    exit 1
fi
echo "Navigate to http://localhost:${PORT}"
npm start "${APP}" -- --verbose --port ${PORT}
if [ $? != 0 ]; then
    echo -e "\nERROR: failed to start up server"
    exit 1
fi
rm -f projects/odp-app/src/config/config.json
