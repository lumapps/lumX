#!/bin/bash

BOLD=""
UNDERLINE=""
STANDOUT=""
DEFAULT=""
BLACK=""
RED=""
GREEN=""
YELLOW=""
BLUE=""
MAGENTA=""
CYAN=""
WHITE=""

if [[ "$*" != *"--no-colors"* ]]; then
    # Check if stdout is a terminal...
    if test -t 1; then
        # See if it supports colors...
        ncolors=$(tput colors)

        if test -n "$ncolors" && test $ncolors -ge 8; then
            BOLD="$(tput bold)"
            UNDERLINE="$(tput smul)"
            STANDOUT="$(tput smso)"
            DEFAULT="$(tput sgr0)"
            BLACK="$(tput setaf 0)"
            RED="$(tput setaf 1)"
            GREEN="$(tput setaf 2)"
            YELLOW="$(tput setaf 3)"
            BLUE="$(tput setaf 4)"
            MAGENTA="$(tput setaf 5)"
            CYAN="$(tput setaf 6)"
            WHITE="$(tput setaf 7)"
        fi
    fi
fi

REASON=""

GIT_NAME=$(git --no-pager show -s --format='%an' $GIT_COMMIT)
GIT_EMAIL=$(git --no-pager show -s --format='%ae' $GIT_COMMIT)

echo "GIT_NAME=\"${GIT_NAME}\"" > build.properties
echo "GIT_EMAIL=\"${GIT_EMAIL}\"" >> build.properties

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

function exitWithCode() {
    printf "Boilerplate CI on branch "${GIT_BRANCH}" done ($(date))\n"
    printf "Exit with code ${1}\n"

    echo "REASON=\"${REASON}\"" > build.status

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

printf "Starting Boilerplate CI on branch '${GIT_BRANCH}' ($(date)) because of '${GIT_NAME} <${GIT_EMAIL}>' changes\n\n"

REASON="The ${setupLabel,,} step failed. Please check the attached build log to see what wents wrong."
if [[ $FAIL == *"setup"* ]]; then
    printf "${YELLOW}Simulating ${setupLabel,,} failure${DEFAULT}\n"
    exitWithCode 1
fi
if [[ "$SETUP" != "None" ]]; then
    step "${setupLabel}" "setup${setupType}"
fi

REASON="A configuration file is not correctly formatted and has been rejected by the linter.<br />Please check the attached build log to see what wents wrong."
if [[ $FAIL == *"lint:config"* ]]; then
    printf "${YELLOW}Simulating lint configuration failure${DEFAULT}\n"
    exitWithCode 1
fi
if [[ $LINT == *"config"* ]]; then
    step "Lint configuration" "lint:config"
fi

REASON="A source file is not correctly formatted and has been rejected by the linter.<br />Please check the attached build log to see what wents wrong."
if [[ $FAIL == *"lint:src"* ]]; then
    printf "${YELLOW}Simulating lint source failure${DEFAULT}\n"
    exitWithCode 1
fi
if [[ $LINT == *"source"* ]]; then
    step "Lint sources" "lint:src"
fi

REASON="At least one unit test has failed and the build has been cancelled.<br />Please check the attached build log to see what wents wrong."
if [[ $FAIL == *"tests:units"* ]]; then
    printf "${YELLOW}Simulating units tests failure${DEFAULT}\n"
    exitWithCode 1
fi
if [[ $TESTS == *"unit"* ]]; then
    step "Units tests" "unit"
fi

REASON="At least one E2E test has failed and the build has been cancelled.<br />Please check the attached build log to see what wents wrong."
if [[ $FAIL == *"tests:e2e"* ]]; then
    printf "${YELLOW}Simulating E2E tests failure${DEFAULT}\n"
    exitWithCode 1
fi
if [[ $TESTS == *"e2e"* ]]; then
    step "E2E tests" "e2e:headless"
fi

REASON="The setup process is fine, lint is OK and every tests have passed. However, tests reports couldn't have been generated.<br />This means that your build is fine, but you should consider checking on the attached build log to see what wents wrong with reports generation."
if [[ $FAIL == *"tests:reports"* ]]; then
    printf "${YELLOW}Simulating reports generation failure${DEFAULT}\n"
    exitWithCode 1
fi
tar -czf tests/client/unitReport.tar.gz -C tests/client/unit/report .
if [[ $? -ne 0 ]]; then
    exitWithCode $?
fi
tar -czf tests/client/e2eReport.tar.gz -C tests/client/e2e/report .
if [[ $? -ne 0 ]]; then
    exitWithCode $?
fi

REASON="This means that the setup process is fine, lint is OK and every tests have passed. Congrat's!<br />You'll find the tests reports and build log attached to this email."

exitWithCode 0
