#!/bin/bash
# This script will check the pre-requisites for LumBoilerplate

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


function exitIfError() {
    if [ $? -ne 0 ]; then
        printf "${BOLD}${RED}Error with code $?"
        if [ -n "$1" ]; then
            printf "${DEFAULT} ${RED}while ${1}"
        fi
        printf "${DEFAULT}\n"
        exit $?
    fi
}

function compareVersion () {
    if [ "$1" == "$2" ]; then
        return 0
    fi

    local IFS=.
    local i ver1=($1) ver2=($2)

    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done

    for ((i=0; i<${#ver1[@]}; i++)); do
        if [ -z "${ver2[i]}" ]; then
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


MIN_NODE_VERSION="6.0.0"
MIN_BASH_VERSION="4.0.0"
MIN_SED_VERSION="4.0.0"
exitCode=0


printf "${BOLD}Checking prerequisites for ${BLUE}LumBoilerplate${WHITE}!${DEFAULT}\n\n"

printf "NodeJS...\t"
nodeVersion=$(node --version)
exitIfError "Getting current NodeJS version"

nodeVersion=$(echo ${nodeVersion} | sed 's/^v\(.*\)/\1/g')
exitIfError "Cleaning current NodeJS version"

if [ -z "$nodeVersion" ]; then
    nodeVersion="0.0.0"
fi

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

printf "GNU Bash...\t"
bashVersion=$(bash --version)
exitIfError "Getting current Bash version"

bashVersion=$(echo ${bashVersion} | head -n 1 | grep "GNU bash" | cut -d" " -f4)
exitIfError "Cleaning current Bash version"

if [ -z "$bashVersion" ]; then
    bashVersion="0.0.0"
fi

compareVersion $bashVersion $MIN_BASH_VERSION
if [[ $? -eq 2 ]]; then
    printf "${BOLD}${RED}❌ FAILED: Bash v${bashVersion} is lower than v${MIN_BASH_VERSION} ${DEFAULT}\n"
    printf "Please upgrade your Bash version.\n"

    printf "If you are on a Debian based Linux: ${BOLD}sudo apt-get update && sudo apt-get install --only-upgrade bash${DEFAULT}\n"
    printf "If you are on a RedHat based Linux: ${BOLD}sudo yum check-update && sudo yum update bash${DEFAULT}\n"
    printf "If you are on MacOS X (see ${UNDERLINE}http://clubmate.fi/upgrade-to-bash-4-in-mac-os-x/${DEFAULT}):\n"
    printf "\t-Install HomeBrew (http://brew.sh/): ${BOLD}ruby -e \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\"${DEFAULT}\n"
    printf "\t-Update the list of packages and install GNU Bash: ${BOLD}brew update && brew install bash${DEFAULT}\n"
    printf "If you are under another OS, see ${BOLD}http://lmgtfy.com/?q=Update+bash+<your OS>${DEFAULT}\n"

    exitCode=2
else
    printf "${GREEN}✔ SUCCESS${DEFAULT}\n"
fi

printf "GNU Sed...\t"
sedVersion=$(sed --version 2> /dev/null)

sedVersion=$(echo ${sedVersion} | head -n 1 | grep "GNU sed" | cut -d" " -f4)
exitIfError "Cleaning current Sed version"

if [ -z "$sedVersion" ]; then
    sedVersion="0.0.0"
fi

compareVersion $sedVersion $MIN_SED_VERSION
if [[ $? -eq 2 ]]; then
    printf "${BOLD}${RED}❌ FAILED: Sed v${sedVersion} is lower than v${MIN_SED_VERSION} ${DEFAULT}\n"
    printf "Please upgrade your Sed version.\n"

    printf "If you are on a Debian based Linux: ${BOLD}sudo apt-get update && sudo apt-get install --only-upgrade sed${DEFAULT}\n"
    printf "If you are on a RedHat based Linux: ${BOLD}sudo yum check-update && sudo yum update sed${DEFAULT}\n"
    printf "If you are on MacOS X:\n"
    printf "\t-Install HomeBrew (http://brew.sh/): ${BOLD}ruby -e \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\"${DEFAULT}\n"
    printf "\t-Update the list of packages and install GNU Sed: ${BOLD}brew update && brew install gnu-sed --with-default-names${DEFAULT}\n"
    printf "\t-Update your path in your shell startup script ('~/.bashrc' or '~/.zshrc'): ${BOLD}echo PATH=\"/usr/local/opt/gnu-sed/libexec/gnubin:\$PATH\" >> <your startup script>${DEFAULT}\n"
    printf "If you are under another OS, see ${BOLD}http://lmgtfy.com/?q=Update+Sed+<your OS>${DEFAULT}\n"

    exitCode=2
else
    printf "${GREEN}✔ SUCCESS${DEFAULT}\n"
fi

printf "XVFB...\t\t"
if type xvfb-run &> /dev/null; then
    printf "${GREEN}✔ SUCCESS${DEFAULT}\n"
else
    printf "${YELLOW}❌ WARNING: XVFB has not been found on your system ${DEFAULT}\n"
    printf "Please install XVFB if you want to be able to run headless tests.\n"

    printf "If you are on a Debian based Linux: ${BOLD}sudo apt-get install xvfb${DEFAULT}\n"
    printf "If you are on a RedHat based Linux: ${BOLD}sudo yum install xvfb${DEFAULT}\n"
    printf "If you are on MacOS X, you will need to install XQuartz (${UNDERLINE}https://www.xquartz.org/${DEFAULT}\n"
    printf "If you are under another OS, see ${BOLD}http://lmgtfy.com/?q=Install+XVFB+<your OS>${DEFAULT}\n"
fi

printf "\n"
printf "${MAGENTA}All prerequisites have been checked.${DEFAULT}\n"
if [ $exitCode -eq 0 ]; then
    printf "${GREEN}Everything is fine, have fun using ${BOLD}LumBoilerplate${DEFAULT}!"
else
    printf "${RED}You have failed prerequisite(s), please take necessary actions before continuing to use ${BOLD}LumBoilerplate${DEFAULT}."
fi

printf "${DEFAULT}\n\n"

exit $exitCode
