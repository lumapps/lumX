#!/bin/bash

GRAY="\e[37m"
BLUE="\e[34m"
RED="\e[31m"
GREEN="\e[32m"
DEFAULT="\e[39m"


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

    echo "REASON=${REASON}" >> build.properties

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
    printf "Launching ${BLUE}${1}${DEFAULT}... \n"

    CI=true npm run ${npmFlags} ${2}

    displayResult $? "$1"

    printf "\n"
}

GIT_NAME=$(git --no-pager show -s --format='%an' $GIT_COMMIT)
GIT_EMAIL=$(git --no-pager show -s --format='%ae' $GIT_COMMIT)

echo "GIT_NAME=${GIT_NAME}" > build.properties
echo "GIT_EMAIL=${GIT_EMAIL}" >> build.properties

printf "Starting Boilerplate CI on branch '${GIT_BRANCH}' ($(date)) because of '${GIT_NAME} <${GIT_EMAIL}>' changes\n\n"

REASON="The ${setupLabel,,} step failed. Please check the attached build log to see what wents wrong."
if [[ "$SETUP" != "None" ]]; then
    step "${setupLabel}" "setup${setupType}"
fi

REASON="A configuration file is not correctly formatted and has been rejected by the linter.<br />Please check the attached build log to see what wents wrong."
if [[ $LINT == *"config"* ]]; then
    step "Lint configuration" "lint:config"
fi
REASON="A source file is not correctly formatted and has been rejected by the linter.<br />Please check the attached build log to see what wents wrong."
if [[ $LINT == *"source"* ]]; then
    step "Lint sources" "lint:src"
fi

REASON="At least one unit test has failed and the build has been cancelled.<br />Please check the attached build log to see what wents wrong."
if [[ $TESTS == *"unit"* ]]; then
    step "Units tests" "unit"
fi
REASON="At least one E2E test has failed and the build has been cancelled.<br />Please check the attached build log to see what wents wrong."
if [[ $TESTS == *"e2e"* ]]; then
    step "E2E tests" "e2e:headless"
fi


tar -czf tests/client/unitReport.tar.gz -C tests/client/unit/report .
tar -czf tests/client/e2eReport.tar.gz -C tests/client/e2e/report .

REASON="This means that the setup process is fine, lint is OK and every tests have passed. Congrat's!<br />You'll find the tests reports and build log attached to this email."

exitWithCode 0
