
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
        if [[ -n "${inputValue}" ]]; then
            eval $2=`echo -ne \""${inputValue}"\"`
        else
            eval $2=`echo -ne \""${!defaultVarName}"\"`
        fi
    fi
}


CONTRIBUTING_FILE="./CONTRIBUTING.md"
INDEX_FILE="./src/client/index.html"
PACKAGE_FILE="./package.json"
README_FILE="./README.md"
SELECTORS_FILE="./src/client/app/core/settings/selectors.settings.ts"

printf "${BOLD}Welcome to the initialization of the ${BLUE}boilerplate${WHITE}!${DEFAULT}\n"
printf "We will ask you some question to help you setup your new project. Ready?\n\n"

defaultName="LumBoilerplate"
readWithDefault "What is the plain human readable name of your project" "name"

defaultDescription="This is the description of ${name}"
readWithDefault "How would you describe your project" "description"

defaultGithubUsername=$(whoami)
defaultGithubUsername=${defaultGithubUsername,,}
readWithDefault "What is your GitHub username or organisation" "githubUsername"
githubUsername="${githubUsername,,}"

defaultRepository=${PWD##*/}
defaultRepository=${defaultRepository,,}
readWithDefault "What is your GitHub repository name" "repository"
repository="${repository,,}"

defaultComponentsNamePrefix=$(echo $name | sed 's/\(\w\|-_ \)[^A-Z\-_ ]*\([^A-Z]\|$\)/\1/g')
defaultComponentsNamePrefix=${defaultComponentsNamePrefix,,}
readWithDefault "What prefix do you want to use for the components name" "componentsNamePrefix"
componentsNamePrefix="${componentsNamePrefix,,}"

defaultComponentsNameSeparator="-"
readWithDefault "What prefix do you want to use for the components name" "componentsNameSeparator"
componentsNameSeparator="${componentsNameSeparator,,}"

printf "\n"
printf "We are now ready to initialize the boilerplate for your project. Please wait...\n\n"

printf "Preparing git... "
rm -Rf ".git"
exitIfError
git init -q
exitIfError
git add .
exitIfError
git commit -q -m "feat(${repository}): initialization of the repository with boilerplate"
exitIfError
printf "${BLUE}Done${DEFAULT}\n"

printf "Removing useless files... "
rm -Rf "./dist"
exitIfError
rm -Rf "./src/client/app/to-do"
exitIfError
rm -Rf "./tests/client/e2e/pages/home.page.ts"
exitIfError
rm -Rf "./tests/client/e2e/specs/home.spec.ts"
exitIfError
rm -Rf "./tests/client/e2e/report"
exitIfError
rm -Rf "./tests/client/unit/report"
exitIfError
rm -Rf "./tests/client/*Report.tar.gz"
exitIfError
rm -Rf "build.*"
exitIfError
printf "${BLUE}Done${DEFAULT}\n"

printf "Emptying some files... "
echo "" > "./src/client/assets/humans.txt"
exitIfError
echo "" > $README_FILE
exitIfError
printf "${BLUE}Done${DEFAULT}\n"

printf "Removing useless code... "
grep -v "ToDoModule" ./src/client/app/app.module.ts > temp && mv temp ./src/client/app/app.module.ts
exitIfError
echo "<h1>This is the application component</h1>" > ./src/client/app/app.component.html
exitIfError
printf "${BLUE}Done${DEFAULT}\n"

if [[ -n "$name" ]]; then
    printf "Customizing project name... "
    printf "# ${name}\n\n" > $README_FILE
    exitIfError

    FILES_WITH_NAME=$(grep -rl "${defaultName}" .)
    for fileName in $FILES_WITH_NAME; do
        if [[ "$fileName" != "./init.sh" ]]; then
            sed -i "s/${defaultName}/${name}/g" $fileName
            exitIfError

        fi
    done
    printf "${BLUE}Done${DEFAULT}\n"
fi

printf "Customizing GitHub and StackOverflow... "
if [[ -n "${githubUsername}" ]]; then
    sed -i "s/${defaultGithubUsername}\//${githubUsername}\//g" $CONTRIBUTING_FILE
    exitIfError
fi

if [[ -n "${repository}" ]]; then
    sed -i "s/${defaultRepository}/${repository}/g" $CONTRIBUTING_FILE
    exitIfError
fi
printf "${BLUE}Done${DEFAULT}\n"

printf "Customizing NPM... "
if [[ -n "$name" ]]; then
    cleanName="$(echo -e "${name,,}" | tr -d '[[:space:]]')"
    sed -i "s/${defaultName,,}/${cleanName}/g" $PACKAGE_FILE
    exitIfError
fi
if [[ -n "${description}" ]]; then
    sed -i "s/\"description\".*/\"description\": \"${description}\",/g" $PACKAGE_FILE
    exitIfError
fi
if [[ -n "${githubUsername}" ]]; then
    sed -i "s/${defaultGithubUsername}\//${githubUsername}\//g" $PACKAGE_FILE
    exitIfError
fi
if [[ -n "${repository}" ]]; then
    sed -i "s/${defaultRepository}/${repository}/g" $PACKAGE_FILE
    exitIfError
fi
sed -i "s/\"author\".*/\"author\": \"\",/g" $PACKAGE_FILE
exitIfError
printf "${BLUE}Done${DEFAULT}\n"

printf "Customizing Readme... "
printf "[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)\n" >> $README_FILE
if [[ -n "$description" ]]; then
    printf "\n${description}\n" >> $README_FILE
    exitIfError
fi
printf "${BLUE}Done${DEFAULT}\n"

printf "Customizing selectors... "
exitIfError
printf "export const SELECTOR_PREFIX: string = '${componentsNamePrefix}';\n" > $SELECTORS_FILE
exitIfError
printf "export const SELECTOR_SEPARATOR: string = '${componentsNameSeparator}';\n\n" >> $SELECTORS_FILE
exitIfError
printf "export const APP_SELECTOR: string = 'app';\n" >> $SELECTORS_FILE
exitIfError

sed -i "s/${defaultComponentsNamePrefix}${defaultComponentsNameSeparator}app/${componentsNamePrefix}${componentsNameSeparator}app/g" $INDEX_FILE
exitIfError
printf "${BLUE}Done${DEFAULT}\n"

printf "Cleaning and setting up the boilerplate..."
npm run -s setup
exitIfError
printf "${BLUE}Done${DEFAULT}\n"

printf "\n"
printf "${GREEN}Your project has been successfully initialized!${DEFAULT}\n\n"
printf "You can now start coding. Run ${BOLD}npm run -s start${DEFAULT} to start the server with all coding stuff you need.\n"
printf "Then go to ${BOLD}http://localhost:8880/${DEFAULT} to access your project.\n"
printf "You can also run ${BOLD}npm run help${DEFAULT} to have a list of all commands available.\n\n"

printf "${BOLD}${MAGENTA}Have fun coding with this boilerplate!${DEFAULT}\n"

exit 0
