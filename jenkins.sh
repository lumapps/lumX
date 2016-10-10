#!/bin/bash

GRAY="\e[37m"
BLUE="\e[34m"
RED="\e[31m"
GREEN="\e[32m"
DEFAULT="\e[39m"

npmFlags="-s"
if [[ $VERBOSE = true ]]; then
    npmFlags=""
    set -x
fi

setupType=""
if [[ $FAST_SETUP = true ]]; then
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
    printf "Boilerplate CI on branch ${GIT_BRANCH} done ($(date))\n"
    printf "Exit with code ${1}"

    exit $1
}

function displayResult() {
    if [[ "$1" = "0" ]]; then
        printf "${GREEN}✔ ${2} successful${DEFAULT}\n"
    else
        printf "${RED}❌ ${2} failed${DEFAULT}"
        exitWithCode $1
    fi
}

function step() {
    printf "${GRAY}Launching ${BLUE}${1}${DEFAULT}... \n"

    npm run ${npmFlags} ${2}

    displayResult $? $1
}

printf "Starting Boilerplate CI on branch ${GIT_BRANCH} ($(date))\n"


step "Setup" "setup${setupType}"
step "Lint" "lint:all"
step "Tests" "tests"

zip -r tests/client/unit/report/unitReport.zip tests/client/unit/report
zip -r tests/client/e2e/report/e2eReport.zip tests/client/e2e/report

exitWithCode 0
