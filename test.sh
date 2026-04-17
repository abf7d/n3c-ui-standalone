#!/bin/bash

set -e

# Parse arguments
COMMAND=$1
ENVIRONMENT=$2
DOMAIN=$3

# Validate command
if [[ "$COMMAND" != "open" && "$COMMAND" != "run" ]]; then
  echo "Usage: $0 [open|run] [local|dev|demo|qa|prod] [n3c|odp]"
  exit 1
fi

# Validate environment
case "$ENVIRONMENT" in
  local|dev|demo|qa|prod) ;;
  *)
    echo "Invalid environment: $ENVIRONMENT"
    echo "Valid environments: local, dev, demo, qa, prod"
    exit 1
    ;;
esac

# Validate domain
case "$DOMAIN" in
  n3c|odp) ;;
  *)
    echo "Invalid domain: $DOMAIN"
    echo "Valid domains: n3c, odp"
    exit 1
    ;;
esac

# Invalid combination check
if [[ "$DOMAIN" == "n3c" && "$ENVIRONMENT" == "demo" ]]; then
  echo "The 'demo' environment is not valid for the 'n3c' domain."
  exit 1
fi

# Construct baseUrl
if [[ "$ENVIRONMENT" == "local" ]]; then
  BASE_URL="http://localhost:4200"
else
  if [[ "$DOMAIN" == "n3c" ]]; then
    if [[ "$ENVIRONMENT" == "prod" ]]; then
      BASE_URL="https://n3c.ncats.nih.gov"
    else
      BASE_URL="https://n3c-$ENVIRONMENT.ncats.nih.gov"
    fi
  else # odp
    if [[ "$ENVIRONMENT" == "prod" ]]; then
      BASE_URL="https://opendata.ncats.nih.gov"
    else
      BASE_URL="https://opendata-$ENVIRONMENT.ncats.nih.gov"
    fi
  fi
fi

# Choose test spec file
if [[ "$DOMAIN" == "n3c" ]]; then
  SPEC_FILE="cypress/e2e/n3c-page-load.cy.ts"
else
  SPEC_FILE="cypress/e2e/page-load.cy.ts"
fi

# Export environment variables
export CYPRESS_ENV=$ENVIRONMENT
export CYPRESS_baseUrl=$BASE_URL

# Output for confirmation
echo "Environment: $CYPRESS_ENV"
echo "Domain: $DOMAIN"
echo "Base URL: $CYPRESS_baseUrl"
echo "Spec file: $SPEC_FILE"

# Run Cypress
if [[ "$COMMAND" == "open" ]]; then
  echo "Opening Cypress..."
  npx cypress@13.14.2 open
else
  echo "Running Cypress tests..."
  npx cypress@13.14.2 run --browser chrome --spec "$SPEC_FILE"
fi
