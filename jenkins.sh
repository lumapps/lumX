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

if [[ ! "$*" =~ "--no-colors" ]]; then
    # Check if stdout is a terminal...
    if [ -t 1 ]; then
        # See if it supports colors...
        ncolors=$(tput colors)

        if [ -n "$ncolors" ] && [ $ncolors -ge 8 ]; then
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


function usage {
    printf """${BOLD}${GREEN}Jenkins Continuous Integration (CI)${DEFAULT}

${UNDERLINE}${MAGENTA}${BOLD}Usage${DEFAULT}:
./jenkins.sh -- [--debug] [--help] [--verbose] [--fast-setup|--skip-setup] [--lint-config] [--lint-source] [--units-tests] [--e2e-tests] [--fail <setup|lint:config|lint:src|tests:units|tests:e2e>] [--quit-on-fail]

${UNDERLINE}${BLUE}Options${DEFAULT}:
\t${CYAN}--debug${DEFAULT}\t\t\t\t\t\t\t\tDebug this CI script
\t${CYAN}--help${DEFAULT}\t\t\t\t\t\t\t\tPrint this help message.
\t${CYAN}--fast-setup${DEFAULT}\t\t\t\t\t\t\tRun a fast setup (don't cleanup already installed packages and cache clean) instead of a regular one. This can't be used with \"--skip-setup\".
\t${CYAN}--skip-setup${DEFAULT}\t\t\t\t\t\t\tSkip the NPM setup (package installation, cleanup, ...). This will take precedence over \"--fast-setup\".
\t${CYAN}--lint-config${DEFAULT}\t\t\t\t\t\t\tLint the configuration files.
\t${CYAN}--lint-source${DEFAULT}\t\t\t\t\t\t\tLint the sources files (Typescript, JavaScript and SASS).
\t${CYAN}--units-tests${DEFAULT}\t\t\t\t\t\t\tRun Units tests.
\t${CYAN}--e2e-tests${DEFAULT}\t\t\t\t\t\t\tRun End To End (E2E) tests.
\t${CYAN}--fail ${YELLOW}\"<setup|lint:config|lint:src|tests:units|tests:e2e>\"${DEFAULT}\tSimulate a failure when executing a part of the CI script.
\t${CYAN}--quit-on-fail${DEFAULT}\t\t\t\t\t\t\tTerminate the CI as soon as a part fails. Else, just log an error and execute the rest.
"""
}

function exitWithCode() {
    if [ "$2" = true ]; then
        printf "\n[$(date)] LumBoilerplate CI on branch "${GIT_BRANCH}" done\n"
        printf "Exit with code ${1}\n"
        printf "\n${3/<br \/>/\\n}\n"

        echo "REASON=${3}${DETAILS}" >> build.status
        echo "EXIT_CODE=${1}" >> build.status

        exit 0
    elif [[ $1 -ge $EXIT_CODE ]]; then
        EXIT_CODE=$1
    fi

    if [[ $1 -gt 0 ]]; then
        if [ -n "$FULL_REASON" ]; then
            FULL_REASON="${FULL_REASON}\n"
        fi
        FULL_REASON="${FULL_REASON}\t- ${3/<br \/>/\\n}"
    fi
}

function displayResult() {
    if [ "$1" = "0" ]; then
        printf "${GREEN}✔ ${2} successful${DEFAULT}\n"
    else
        printf "${RED}❌ ${2} failed${DEFAULT}\n\n"
        exitWithCode $1 $3 "$4"
    fi
}

function step() {
    printf "Launching ${BLUE}${1}${DEFAULT}... \n"

    CI=true npm run ${npmFlags} ${2}

    local returnCode=$?
    displayResult $returnCode "$1" $QUIT_ON_FAIL "$3"

    printf "\n"

    return $returnCode
}

function simulateFailure() {
    if [[ "$FAIL" =~ "$2" ]]; then
        printf "${YELLOW}Simulating $1 failure${DEFAULT}\n"

        exitWithCode 5 $3 "$4"

        return 5
    fi

}


QUIT_ON_FAIL=false
if [ -z "$SETUP" ]; then
    SETUP="Normal"
fi

while [[ $# -ge 1 ]]; do
    key="$1"

    case $key in
        --debug)
            set -x
            ;;

        --help)
            usage
            exitWithCode 0 true
            ;;

        --fail)
            FAIL="$2"
            shift
            ;;

        --verbose)
            VERBOSE=true
            ;;

        --fast-setup)
            SETUP="Fast"
            ;;

        --skip-setup)
            SETUP="None"
            ;;

        --lint-config)
            LINT="config,${LINT}"
            ;;

        --lint-source)
            LINT="source,${LINT}"
            ;;

        --units-tests)
            TESTS="unit,${TESTS}"
            ;;

        --e2e-tests)
            TESTS="e2e,${TESTS}"
            ;;

        --quit-on-fail)
            QUIT_ON_FAIL=true
            ;;

        *)
            # unknown option
            ;;
    esac

    shift
done

npmFlags="-s"
if [ "$VERBOSE" = true ]; then
    npmFlags=""
fi
if [ "$DEBUG" = true ]; then
    set -x
fi

setupLabel="Setup"
setupType=""
if [ "$SETUP" == "Fast" ]; then
    setupLabel="Fast setup"
    setupType=":fast"
fi


rm -Rf tests/client/*Report.tar.gz
rm -f build.properties
rm -f build.status

FULL_REASON=""
REASON=""
DETAILS=""
CUSTOM_BUILD_SOURCE=""
CUSTOM_BUILD_SOURCE_LOG=""
EXIT_CODE=0

GIT_NAME=$(git --no-pager show -s --format='%an' $GIT_COMMIT)
GIT_EMAIL=$(git --no-pager show -s --format='%ae' $GIT_COMMIT)
GIT_SHA=$(git --no-pager show -s --format='%h' $GIT_COMMIT)
GIT_DATE=$(git --no-pager show -s --format='%aD' $GIT_COMMIT)
GIT_SUBJECT=$(git --no-pager show -s --format='%s' $GIT_COMMIT)

touch build.properties
touch build.status

if [ -n "$GITHUB_PR_NUMBER" ]; then
    if [ -z "$GITHUB_PR_TRIGGER_SENDER_AUTHOR" ]; then
        GITHUB_PR_TRIGGER_SENDER_AUTHOR=${GIT_NAME}
        echo "GITHUB_PR_TRIGGER_SENDER_AUTHOR=${GIT_NAME}" >> build.properties
    fi
    if [ -z "$GITHUB_PR_TRIGGER_SENDER_EMAIL" ]; then
        GITHUB_PR_TRIGGER_SENDER_EMAIL=${GIT_EMAIL}
        echo "GITHUB_PR_TRIGGER_SENDER_EMAIL=${GIT_EMAIL}" >> build.properties
    fi
    if [ -z "$GITHUB_PR_TITLE" ]; then
        GITHUB_PR_TITLE=${GIT_SUBJECT}
        echo "GITHUB_PR_TITLE=${GIT_SUBJECT}" >> build.properties
    fi

    if [ -n "$GITHUB_PR_URL" ]; then
        CUSTOM_BUILD_SOURCE="Pull Request <strong><a href=\"${GITHUB_PR_URL}\" target=\"_blank\">#${GITHUB_PR_NUMBER} \"${GITHUB_PR_TITLE}\"</a></strong> (<em>${GITHUB_PR_TARGET_BRANCH}...${GITHUB_PR_SOURCE_BRANCH}</em>)"
        CUSTOM_BUILD_SOURCE_LOG="Pull Request #${GITHUB_PR_NUMBER} \"${GITHUB_PR_TITLE}\" (${GITHUB_PR_URL}) (${GITHUB_PR_TARGET_BRANCH}...${GITHUB_PR_SOURCE_BRANCH})"
    else
        CUSTOM_BUILD_SOURCE="Pull Request <strong>#${GITHUB_PR_NUMBER}:${GITHUB_PR_COND_REF}</strong>"
        CUSTOM_BUILD_SOURCE_LOG="Pull Request #${GITHUB_PR_NUMBER}:${GITHUB_PR_COND_REF}"
    fi
else
    CUSTOM_BUILD_SOURCE="branch \"<strong>${GIT_BRANCH}</strong>\""

    echo "GIT_NAME=${GIT_NAME}" >> build.properties
    echo "GIT_EMAIL=${GIT_EMAIL}" >> build.properties
fi

echo "CUSTOM_BUILD_SOURCE=${CUSTOM_BUILD_SOURCE}" >> build.properties


printf "[$(date)] Starting LumBoilerplate CI on ${CUSTOM_BUILD_SOURCE_LOG} because of \"${GIT_NAME} <${GIT_EMAIL}>\" changes:\n"
printf "#${GIT_SHA} (commited ${GIT_DATE}): \"${GIT_SUBJECT}\"\n\n"

SETUP_REASON="The ${setupLabel,,} step failed."
if [ "$SETUP" != "None" ]; then
    simulateFailure $setupLabel "setup" $QUIT_ON_FAIL "$SETUP_REASON"
    setupCode=$?

    if [[ $setupCode -ne 5 ]]; then
        step "${setupLabel}" "setup${setupType}" "$SETUP_REASON"
        setupCode=$?
    fi
fi

LINT_CONFIG_REASON="A configuration file is not correctly formatted and has been rejected by the linter."
if [[ "$LINT" =~ "config" ]]; then
    simulateFailure "Lint configuration" "lint:config" $QUIT_ON_FAIL "$LINT_CONFIG_REASON"
    lintConfigCode=$?

    if [[ $lintConfigCode -ne 5 ]]; then
        step "Lint configuration" "lint:config" "$LINT_CONFIG_REASON"
        lintConfigCode=$?
    fi
fi

LINT_SOURCE_REASON="A source file is not correctly formatted and has been rejected by the linter."
if [[ "$LINT" =~ "source" ]]; then
    simulateFailure "Lint source" "lint:src" $QUIT_ON_FAIL "$LINT_SOURCE_REASON"
    lintSourceCode=$?

    if [[ $lintSourceCode -ne 5 ]]; then
        step "Lint sources" "lint:src" "$LINT_SOURCE_REASON"
        lintSourceCode=$?
    fi
fi

lintCode=$(( lintConfigCode > lintSourceCode ? lintConfigCode : lintSourceCode ))

UNITS_TEST_REASON="At least one unit test has failed and the build has been cancelled."
if [[ "$TESTS" =~ "unit" ]]; then
    simulateFailure "Units tests" "tests:units" $QUIT_ON_FAIL "$UNITS_TEST_REASON"
    unitsTestsCode=$?

    if [[ $unitsTestsCode -ne 5 ]]; then
        step "Units tests" "unit:headless" "$UNITS_TEST_REASON"
        unitsTestsCode=$?

        if [[ $unitsTestsCode -eq 0 ]]; then
            tar -czf tests/client/unitReport.tar.gz -C tests/client/unit/report .
        fi
    fi
fi

E2E_TESTS_REASON="At least one E2E test has failed and the build has been cancelled."
if [[ "$TESTS" =~ "e2e" ]]; then
    simulateFailure "E2E tests" "tests:e2e" $QUIT_ON_FAIL "$E2E_TESTS_REASON"
    e2eTestsCode=$?

    if [[ $e2eTestsCode -ne 5 ]]; then
        step "E2E tests" "e2e:headless" "$E2E_TESTS_REASON"
        e2eTestsCode=$?

        if [[ $e2eTestsCode -eq 0 ]]; then
            tar -czf tests/client/e2eReport.tar.gz -C tests/client/e2e/report .
        fi
    fi
fi

testsCode=$(( unitsTestsCode > e2eTestsCode ? unitsTestsCode : e2eTestsCode ))

if [[ $EXIT_CODE -gt 0 ]]; then
    FULL_REASON="The CI has failed. Please check the attached build log to see what wents wrong:\n${FULL_REASON}"
else
    FULL_REASON="The CI has succeeded"
    EXPLANATION=""
    DETAILS="<br />You'll find "
    if [ "$SETUP" != "None" ]; then
        EXPLANATION="the setup process"

        if [[ $setupCode -eq 0 ]]; then
            EXPLANATION="${EXPLANATION} is fine"
        else
            EXPLANATION="${EXPLANATION} has failed"
        fi
    fi

    if [ -n "$LINT" ]; then
        if [ -n "$EXPLANATION" ]; then
            if [ -z "$TESTS" ]; then
                EXPLANATION="${EXPLANATION} and "
            else
                EXPLANATION="${EXPLANATION}, "
            fi
        fi

        LINT_TYPE=""
        if [[ "$LINT" =~ "config" ]]; then
            LINT_TYPE="configuration"
        fi
        if [[ "$LINT" =~ "source" ]]; then
            if [ -z "$LINT_TYPE" ]; then
                LINT_TYPE="sources"
            else
                if [[ $lintCode -eq 0 ]]; then
                    LINT_TYPE="all"
                else
                    LINT_TYPE=""
                    if [[ $lintConfigCode -ne 0 ]]; then
                        LINT_TYPE="configuration"
                    fi

                    if [[ $lintSourceCode -ne 0 ]]; then
                        if [ -n "$LINT_TYPE" ]; then
                            LINT_TYPE="${LINT_TYPE} and "
                        fi

                        LINT_TYPE="${LINT_TYPE}source"
                    fi
                fi
            fi
        fi

        EXPLANATION="${EXPLANATION}${LINT_TYPE} lint"
        if [[ $lintCode -eq 0 ]]; then
            EXPLANATION="${EXPLANATION} is OK"
        else
            EXPLANATION="${EXPLANATION} has failed"
        fi
    fi

    if [ -n "$TESTS" ]; then
        if [ -n "$EXPLANATION" ]; then
            EXPLANATION="${EXPLANATION} and "
        fi

        TESTS_TYPES=""
        if [[ "$TESTS" =~ "unit" ]]; then
            TESTS_TYPES="units"
        fi
        if [[ "$TESTS" =~ "e2e" ]]; then
            if [ -z "$TESTS_TYPES" ]; then
                TESTS_TYPES="E2E"
            else
                if [[ $testsCode -eq 0 ]]; then
                    TESTS_TYPES="every"
                else
                    TESTS_TYPES="some "
                    if [[ $unitsTestsCode -ne 0 ]]; then
                        TESTS_TYPES="${TESTS_TYPES}units"
                    fi

                    if [[ $e2eTestsCode -ne 0 ]]; then
                        if [ "$TESTS_TYPES" != "some " ]; then
                            TESTS_TYPES="${TESTS_TYPES} and "
                        fi

                        TESTS_TYPES="${TESTS_TYPES}E2E"
                    fi
                fi
            fi
        fi

        EXPLANATION="${EXPLANATION}${TESTS_TYPES} tests"
        if [[ $testsCode -eq 0 ]]; then
            EXPLANATION="${EXPLANATION} have passed"
        else
            EXPLANATION="${EXPLANATION} have failed"
        fi

        DETAILS="${DETAILS}the tests reports and "
    fi

    if [ -n "$EXPLANATION" ]; then
        FULL_REASON="${FULL_REASON}. This means that "
        EXPLANATION="${EXPLANATION}."

        if [[ $EXIT_CODE -eq 0 ]]; then
            EXPLANATION="${EXPLANATION} Congrats!"
        fi
    fi

    DETAILS="${DETAILS}build log attached to this email."

    FULL_REASON="${FULL_REASON}${EXPLANATION}"
fi

exitWithCode $EXIT_CODE true "$FULL_REASON"
