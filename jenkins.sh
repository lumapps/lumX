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

rm -Rf tests/client/*Report.tar.gz
rm -f build.properties
rm -f build.status

REASON=""
DETAILS=""
REASON_MORE="<br />Please check the attached build log to see what wents wrong."
CUSTOM_BUILD_SOURCE=""

GIT_NAME=$(git --no-pager show -s --format='%an' $GIT_COMMIT)
GIT_EMAIL=$(git --no-pager show -s --format='%ae' $GIT_COMMIT)
GIT_SHA=$(git --no-pager show -s --format='%h' $GIT_COMMIT)
GIT_DATE=$(git --no-pager show -s --format='%aD' $GIT_COMMIT)
GIT_SUBJECT=$(git --no-pager show -s --format='%s' $GIT_COMMIT)

if [[ -n "$ghprbActualCommit" ]]; then
    if [[ -z "$ghprbActualCommitAuthorEmail" ]]; then
        ghprbActualCommitAuthor=${GIT_NAME}
        echo "ghprbActualCommitAuthor=${GIT_NAME}" >> build.properties
    fi
    if [[ -z "$ghprbActualCommitAuthorEmail" ]]; then
        ghprbActualCommitAuthorEmail=${GIT_EMAIL}
        echo "ghprbActualCommitAuthorEmail=${GIT_EMAIL}" >> build.properties
    fi
    if [[ -z "$ghprbPullTitle" ]]; then
        ghprbPullTitle=${GIT_BRANCH}
        echo "ghprbPullTitle=${GIT_EMAIL}" >> build.properties
    fi

    if [[ -n "${ghprbPullId}" ]]; then
        CUSTOM_BUILD_SOURCE="Pull Request \"<a href=\"${ghprbPullLink}\" target=\"_blank\">#${ghprbPullId} - ${ghprbPullTitle}</a>\" (<em>${ghprbTargetBranch}/${ghprbSourceBranch}</em>)"
    else
        CUSTOM_BUILD_SOURCE="\"$ghprbActualCommit\""
    fi
else
    echo "GIT_NAME=${GIT_NAME}" > build.properties
    echo "GIT_EMAIL=${GIT_EMAIL}" > build.properties

    CUSTOM_BUILD_SOURCE="branch \"<em>${GIT_BRANCH}</em>\""
fi

echo "CUSTOM_BUILD_SOURCE=${CUSTOM_BUILD_SOURCE}" > build.properties

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
    printf "\n[$(date)] Boilerplate CI on branch "${GIT_BRANCH}" done\n"
    printf "Exit with code ${1}\n"
    printf "${REASON/<br \/>/\\n}\n"

    echo "REASON=${REASON}${DETAILS}" > build.status
    echo "EXIT_CODE=${1}" >> build.status

    exit 0
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

function simulateFailure() {
    if [[ $FAIL == *"$2"* ]]; then
        printf "${YELLOW}Simulating $1 failure${DEFAULT}\n"
        exitWithCode 5
    fi
}

printf "[$(date)] Starting Boilerplate CI on branch \"${GIT_BRANCH}\" because of \"${GIT_NAME} <${GIT_EMAIL}>\" changes\n"
printf "[${GIT_DATE}] #{${GIT_SHA}}: \"${GIT_SUBJECT}\"\n\n"

REASON="The ${setupLabel,,} step failed. Please check the attached build log to see what wents wrong."
simulateFailure $setupLabel "setup"
if [[ "$SETUP" != "None" ]]; then
    step "${setupLabel}" "setup${setupType}"
fi

REASON="A configuration file is not correctly formatted and has been rejected by the linter.${REASON_MORE}"
simulateFailure "Lint configuration" "lint:config"
if [[ $LINT == *"config"* ]]; then
    step "Lint configuration" "lint:config"
fi

REASON="A source file is not correctly formatted and has been rejected by the linter.${REASON_MORE}"
simulateFailure "Lint source" "lint:src"
if [[ $LINT == *"source"* ]]; then
    step "Lint sources" "lint:src"
fi

REASON="At least one unit test has failed and the build has been cancelled.${REASON_MORE}"
simulateFailure "Units tests" "tests:units"
if [[ $TESTS == *"unit"* ]]; then
    step "Units tests" "unit"
fi

REASON="At least one E2E test has failed and the build has been cancelled.${REASON_MORE}"
simulateFailure "E2E tests" "tests:e2e"
if [[ $TESTS == *"e2e"* ]]; then
    step "E2E tests" "e2e:headless"
fi

REASON="The setup process is fine, lint is OK and every tests have passed. However, tests reports couldn't have been generated.<br />This means that your build is fine, but you should consider checking on the attached build log to see what wents wrong with reports generation."
simulateFailure "Reports generation" "tests:reports"
tar -czf tests/client/unitReport.tar.gz -C tests/client/unit/report .
if [[ $? -ne 0 ]]; then
    exitWithCode $?
fi
tar -czf tests/client/e2eReport.tar.gz -C tests/client/e2e/report .
if [[ $? -ne 0 ]]; then
    exitWithCode $?
fi

REASON=""
EXPLANATION=""
DETAILS="<br />You'll find "
if [[ "$SETUP" != "None" ]]; then
    EXPLANATION="the setup process is fine"
fi

if [[ -n "$LINT" ]]; then
    if [[ -n "$EXPLANATION" ]]; then
        if [[ -z "$TESTS" ]]; then
            EXPLANATION="${EXPLANATION} and "
        else
            EXPLANATION="${EXPLANATION}, "
        fi
    fi

    LINT_TYPE=""
    if [[ $LINT == *"config"* ]]; then
        LINT_TYPE="configuration "
    fi
    if [[ $LINT == *"source"* ]]; then
        if [[ -z "$LINT_TYPE" ]]; then
            LINT_TYPE="sources "
        else
            LINT_TYPE="all "
        fi
    fi

    EXPLANATION="${EXPLANATION}${LINT_TYPE}lint is OK"
fi

if [[ -n "$TESTS" ]]; then
    if [[ -n "$EXPLANATION" ]]; then
        EXPLANATION="${EXPLANATION} and "
    fi

    TESTS_TYPES=""
    if [[ $TESTS == *"unit"* ]]; then
        TESTS_TYPES="units"
    fi
    if [[ $TESTS == *"e2e"* ]]; then
        if [[ -z "$TESTS_TYPES" ]]; then
            TESTS_TYPES="E2E"
        else
            TESTS_TYPES="every"
        fi
    fi

    EXPLANATION="${EXPLANATION}${TESTS_TYPES} tests have passed"

    DETAILS="${DETAILS}the tests reports and "
fi

if [[ -n "$EXPLANATION" ]]; then
    REASON="This means that "
    EXPLANATION="${EXPLANATION}. Congrats!"
fi

DETAILS="${DETAILS}build log attached to this email."

REASON="${REASON}${EXPLANATION}"

exitWithCode 0
