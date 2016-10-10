#!/bin/bash

GRAY="\e[37m"
BLUE="\e[34m"
RED="\e[31m"
GREEN="\e[32m"
DEFAULT="\e[39m"

CI=true

npmFlags="-s"
if [[ $VERBOSE == true ]]; then
    npmFlags=""
    set -x
fi

setupLabel="Setup"
setupType=""
if [[ $SETUP == "Fast" ]]; then
    setupLabel="Fast setup"
    setupType=":fast"
fi

if [[ "$1" = "--no-colors" ]]; then
    GRAY=""
    BLUE=""
    RED=""
    GREEN=""
    DEFAULT=""
fi

function exitWithCode() {
    printf "Boilerplate CI on branch "${GIT_BRANCH}" done ($(date))\n"
    printf "Exit with code ${1}\n"

    exit $1
}

function displayResult() {
    if [[ "$1" = "0" ]]; then
        printf "${GREEN}✔ ${2} successful${DEFAULT}\n"
    else
        printf "${RED}❌ ${2} failed${DEFAULT}\n\n"
        exitWithCode $1
    fi
}

function step() {
    printf "${GRAY}Launching ${BLUE}${1}${DEFAULT}... \n"

    npm run ${npmFlags} ${2}

    displayResult $? "$1"

    printf "\n"
}

printf "Starting Boilerplate CI on branch '${GIT_BRANCH}' ($(date)) because of '${GIT_COMMITTER_NAME} <${GIT_COMMITTER_EMAIL}>' changes\n\n"

if [[ "$SETUP" != "None" ]]; then
    step "${setupLabel}" "setup${setupType}"
fi

if [[ $LINT == *"config"* ]]; then
    step "Lint configuration" "lint:config"
fi
if [[ $LINT == *"source"* ]]; then
    step "Lint sources" "lint:src"
fi

if [[ $TESTS == *"unit"* ]]; then
    step "Units tests" "unit"
elif [[ $TESTS == *"e2e"* ]]; then
    step "E2E tests" "e2e:headless"
fi


tar -czf tests/client/unit/report/unitReport.tar.gz tests/client/unit/report
tar -czf tests/client/e2e/report/e2eReport.tar.gz tests/client/e2e/report

exitWithCode 0
