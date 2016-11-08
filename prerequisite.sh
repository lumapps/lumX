#!/bin/bash
# This script will initialize the boilerplate

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


function exitIfError() {
    if [[ $? -ne 0 ]]; then
        printf "${BOLD}${RED}Error with code $? ${DEFAULT}\n"
        exit $?
    fi
}

compareVersion () {
    if [[ $1 == $2 ]]; then
        return 0
    fi

    local IFS=.
    local i ver1=($1) ver2=($2)

    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done

    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi

        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi

        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done

    return 0
}

printf "${BOLD}Checking prerequisites for ${BLUE}LumX²${WHITE}!${DEFAULT}\n\n"

exitCode=0

printf "NodeJS... "
MIN_NODE_VERSION="6.0.0"
nodeVersion=$(node --version)
nodeVersion=$(echo ${nodeVersion} | sed 's/^v\(.*\)/\1/g')
compareVersion $nodeVersion $MIN_NODE_VERSION
if [[ $? -eq 2 ]]; then
    printf "${BOLD}${RED}❌ FAILED: NodeJS v${nodeVersion} is lower than v${MIN_NODE_VERSION} ${DEFAULT}\n"
    printf "Please upgrade your NodeJS version (see ${UNDERLINE}https://nodejs.org/en/download/current/${DEFAULT} or ${UNDERLINE}https://nodejs.org/en/download/package-manager/${DEFAULT} for more information)\n"
    printf "We recommand the usage of ${BOLD}NVM${DEFAULT} associated to ${BOLD}nodenegine${DEFAULT} to manage multiple versions of NodeJS and NPM.\n"
    printf "${YELLOW}Please note that if you had ${BOLD}node-sass${DEFAULT}${YELLOW} previously installed, you may have to run ${BOLD}npm rebuild node-sass${DEFAULT}${YELLOW} to make it work with the new version of NodeJS.\n"

    exitCode=1
else
    printf "${GREEN}✔ SUCCESS${DEFAULT}\n"
fi

printf "\n"
printf "${MAGENTA}All prerequisites have been checked."
if [[ $exit -eq 0 ]]; then
    printf " Everything is fine, have fun using ${BOLD}LumX²${DEFAULT}${MAGENTA}!"
else
    printf "You have failed prerequisite(s), please take necessary actions before continuing to use ${BOLD}LumX²${DEFAULT}${MAGENTA}."
fi

printf "${DEFAULT}\n\n"

exit $exitCode
