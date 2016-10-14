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

function readWithDefault() {
    if [ -n "$1" ] && [ -n "$2" ]; then
        defaultVarName="default${2^}"

        IFS= read -r -p "${YELLOW}${1}?${DEFAULT} (${BOLD}${CYAN}${!defaultVarName}${DEFAULT}) " inputValue
        if [[ -n "${!inputValue}" ]]; then
            eval $2=`echo -ne \""${inputValue}"\"`
        else
            eval $2=`echo -ne \""${!defaultVarName}"\"`
        fi
    fi
}


CONTRIBUTING_FILE="./CONTRIBUTING.md"
INDEX_FILE="./src/client/index.html"
README_FILE="./README.md"
SELECTORS_FILE="./src/client/app/core/settings/selectors.settings.ts"

defaultName="LumBoilerplate"
defaultDescription=""
defaultStackOverflowTag="lumboilerplate"
defaultRepositoryURL="https://github.com/lumapps/boilerplate/"
defaultComponentsNamePrefix="lb"
defaultComponentsNameSeparator="-"

defaultName="My super project"
defaultDescription="This is the description of my super project"
defaultStackOverflowTag="superproject"
defaultRepositoryURL="https://github.com/clementprevot/superproject"
defaultComponentsNamePrefix="sp"
defaultComponentsNameSeparator="_"

printf "${BOLD}Welcome to the initialization of the ${BLUE}boilerplate${WHITE}!${DEFAULT}\n"
printf "We will ask you some question to help you setup your new project. Ready?\n\n"

readWithDefault "What is the plain human readable name of your project" "name"
readWithDefault "How would you describe your project" "description"
readWithDefault "What tag do you want to use on StackOverflow" "stackOverflowTag"
readWithDefault "What is you repository URL" "repositoryURL"
readWithDefault "What prefix do you want to use for the components name" "componentsNamePrefix"
readWithDefault "What prefix do you want to use for the components name" "componentsNameSeparator"

printf "\n"
printf "We are now ready to initialize the boilerplate for your project. Please wait...\n\n"

printf "Cleaning and setting up the boilerplate..."
npm run -s setup 2>&1 /dev/null
printf "${BLUE}Done${DEFAULT}\n"

printf "Removing useless files... "
rm -Rf "./src/client/app/to-do"
rm -Rf "./tests/client/e2e/pages/home.page.ts"
rm -Rf "./tests/client/e2e/specs/home.spec.ts"
printf "${BLUE}Done${DEFAULT}\n"

printf "Emptying some files... "
echo "" > "./src/client/assets/humans.txt"
echo "" > $README_FILE
printf "${BLUE}Done${DEFAULT}\n"

printf "Removing useless code... "
grep -v "subscribe" ./src/client/app/app.component.ts > temp && mv temp ./src/client/app/app.component.ts
grep -v "ToDoModule" ./src/client/app/app.module.ts > temp && mv temp ./src/client/app/app.module.ts
printf "${BLUE}Done${DEFAULT}\n"

if [[ -n "$name" ]]; then
    if [[ "$name" != "$defaultName" ]]; then
        printf "Customizing project name... "
        echo "# ${name}\n\n" >> $README_FILE

        FILES_WITH_NAME=$(grep -rl ${defaultName} .)
        echo $FILES_WITH_NAME;
        for fileName in $FILES_WITH_NAME; do
            sed -i "s/${defaultName}/${name}/g" $fileName
        done
        printf "${BLUE}Done${DEFAULT}\n"

        printf "Customizing StackOverflow... "
        if [[ -z "$stackOverflowTag" ]]; then
            stackOverflowTag=${name,,}
        fi
        sed -i "s/${defaultStackOverflowTag}/${stackOverflowTag}/g" $CONTRIBUTING_FILE
        printf "${BLUE}Done${DEFAULT}\n"

        printf "Customizing GitHub... "
        if [[ -z "$repositoryURL" ]]; then
            repositoryURL="https://github.com/${name,,}/${name,,}/"
        fi
        repositoryURLLength=$(${#repositoryURL}-1)
        if [ "${repositoryURL:repositoryURLLength}" != "/" ]; then
            repositoryURL="${repositoryURL}/"
        fi
        sed -i "s/${defaultRepositoryURL}/${repositoryURL}/g" $CONTRIBUTING_FILE
        printf "${BLUE}Done${DEFAULT}\n"
    fi
fi

printf "Customizing Readme... "
echo "[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)\n" >> $README_FILE
if [[ -n "$description" ]]; then
    echo "\n${description}\n" > $README_FILE
fi
printf "${BLUE}Done${DEFAULT}\n"

printf "Customizing selectors... "
echo "" > $SELECTORS_FILE
echo "export const SELECTOR_PREFIX: string = '${componentsNamePrefix}';\n" >> $SELECTORS_FILE
echo "export const SELECTOR_SEPARATOR: string = '${componentsNameSeparator}';\n\n" >> $SELECTORS_FILE

sed -i "s/${defaultComponentsNamePrefix}${defaultComponentsNameSeparator}app/${componentsNamePrefix}${componentsNameSeparator}app/g" $INDEX_FILE
printf "${BLUE}Done${DEFAULT}\n"

printf "\n"
printf "${GREEN}Your project has been successfully initialized!${DEFAULT}\n"
printf "You can now start coding. Run ${BOLD}npm run -s start${DEFAULT} to start the server with all coding stuff you need.\n"
printf "Then go to ${BOLD}http://localhost:8880/${DEFAULT} to access your project.\n"
printf "You can also run ${BOLD}npm run help${DEFAULT} to have a list of all commands available.\n\n"

printf "${BOLD}${MAGENTA}Have fun coding with this boilerplate!${DEFAULT}\n"

exit 0
