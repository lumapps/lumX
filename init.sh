#!/bin/bash
# This script will initialize the boilerplate

LOG="./init.log"
echo "" > $LOG


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


function usage {
    printf -- """${BOLD}${GREEN}LumBoilerplate initialization${DEFAULT}

${UNDERLINE}${MAGENTA}${BOLD}Usage${DEFAULT}:
npm run -s init -- [--debug] [-h|--help] [--skip-setup] [-n|--name <name>|\"default\"] [-d|--description <description>|\"default\"] [-u|--github-username <github username>|\"default\"] [-r|--repository <repository>|\"default\"] [-p|--prefix <prefix>|\"default\"] [-s|--separator <separator>|\"default\"] [-b|--base-url <base url>|\"default\"]

${UNDERLINE}${BLUE}Options${DEFAULT}:
\t${CYAN}--debug${DEFAULT}\t\t\t\t\t\t\tDebug this initialization script
\t${CYAN}-h, --help${DEFAULT}\t\t\t\t\t\tPrint this help message.
\t${CYAN}-n, --name ${YELLOW}<name>|\"default\"${DEFAULT}\t\t\t\tThe name of the project (if \"default\", will be the name of the current directory).
\t${CYAN}-d, --description ${YELLOW}<description>|\"default\"${DEFAULT}\t\tThe description of the project (if \"default\", will be 'This is the description of <Project's name>).
\t${CYAN}-u, --github-username ${YELLOW}<github username>|\"default\"${DEFAULT}\tThe Github username of the repository of the project (if \"default\", will be your current username).
\t${CYAN}-r, --repository ${YELLOW}<repository>|\"default\"${DEFAULT}\t\t\tThe name of the repository of the project (if \"default\", will be the name of the current directory).
\t${CYAN}-p, --prefix ${YELLOW}<prefix>|\"default\"${DEFAULT}\t\t\t\tThe prefix for the components selector (if \"default\", will be derived from the name of the project).
\t${CYAN}-s, --separator ${YELLOW}<separator>|\"default\"${DEFAULT}\t\t\tThe separator of the components selector (between prefix and component selector) (if \"default\", will be '-').
\t${CYAN}-b, --base-url ${YELLOW}<base url>|\"default\"${DEFAULT}\t\t\tThe base URL of the project (if \"default\", will be '/').
\t${CYAN}--skip-git${DEFAULT}\t\t\t\t\t\tSkip the Git repository setup (initialization, initial commit, ...).
\t${CYAN}--skip-setup${DEFAULT}\t\t\t\t\t\tSkip the NPM setup (package installation, cleanup, ...).
"""
}

function printfl() {
    printf -- "${1}" | tee -a $LOG
}

function log() {
    printf -- "${1}" &>> $LOG

    if [ -z "$2" ] || [ "$2" == true ]; then
        printf -- "\n" &>> $LOG
    fi
}

function exitIfError() {
    if [ $? -ne 0 ]; then
        printfl "${BOLD}${RED}Error with code $?"
        if [ -n "$1" ]; then
            printfl "${DEFAULT} ${RED}while ${1,,}"
        fi
        printfl "${DEFAULT}\n"
        exit $?
    fi
}

function readWithDefault() {
    if [ -n "${!2}" ]; then
        return 0
    fi

    if [ -n "$1" ] && [ -n "$2" ]; then
        defaultVarName="default${2^}"

        printfl "${YELLOW}${1}?${DEFAULT} "
        if [ -n "${!defaultVarName}" ]; then
            printfl "(${BOLD}${CYAN}${!defaultVarName}${DEFAULT}) "
        fi

        IFS= read -r inputValue
        if [ -n "$inputValue" ]; then
            eval $2=`echo -ne \""${inputValue}"\"`
        else
            eval $2=`echo -ne \""${!defaultVarName}"\"`
        fi

        log "${!2}"
    fi
}

function readBooleanWithDefault() {
    if [ "${!2,,}" == "y" ] || [ "${!2,,}" == "n" ]; then
        return 0
    fi

    if [ -n "$1" ] && [ -n "$2" ]; then
        defaultVarName="default${2^}"

        choices="(${BOLD}${CYAN}${!defaultVarName^^}${DEFAULT}/n)"
        if [ "${!defaultVarName,,}" == "n" ]; then
            choices="(y/${BOLD}${CYAN}${!defaultVarName^^}${DEFAULT})"
        fi

        IFS= read -r -p "${YELLOW}${1}?${DEFAULT} ${choices} " inputValue
        if [ -n "$inputValue" ]; then
            if [ "${inputValue,,}" != 'y' ] && [ "${inputValue,,}" != 'n' ]; then
                readBooleanWithDefault "$1" "$2"
                return
            fi

            eval $2=`echo -ne \""${inputValue,,}"\"`
        else
            eval $2=`echo -ne \""${!defaultVarName,,}"\"`
        fi

        log "${!2}"
    fi
}


ANGULARCLI_FILE="./.angular-cli.json"
CONTRIBUTING_FILE="./CONTRIBUTING.md"
HUMANS_FILE="./src/client/meta/humans.txt"
INDEX_FILE="./src/client/index.html"
PACKAGE_FILE="./package.json"
README_FILE="./README.md"
ROADMAP_FILE="./ROADMAP.md"
CHANGELOG_FILE="./CHANGELOG.md"
SELECTORS_FILE="./src/client/app/core/settings/selectors.settings.ts"
SETTINGS_FILE="./src/client/app/core/settings/common.settings.ts"
TSLINT_FILE="./tslint.json"


originalName='LumBoilerplate'
originalDescription=''
originalGithubUsername='lumapps'
originalRepository='boilerplate'
originalComponentsNamePrefix='lb'
originalComponentsNameSeparator='-'
originalBaseUrl='/'


skipGit=false
skipSetup=false


defaultName="${PWD##*/}"
defaultDescription="This is the description of ${defaultName}"
defaultGithubUsername=$(whoami)
defaultGithubUsername="${defaultGithubUsername,,}"
defaultRepository="${defaultName,,}"
defaultComponentsNamePrefix=$(echo $defaultName | sed 's/\(\w\|-_ \)[^A-Z\-_ ]*\([^A-Z]\|$\)/\1/g')
defaultComponentsNamePrefix="${defaultComponentsNamePrefix,,}"
defaultComponentsNameSeparator="${originalComponentsNameSeparator,,}"
defaultBaseUrl="${originalBaseUrl,,}"

questionsNumber=7
givenParameters=0

while [[ $# -ge 1 ]]; do
    key="$1"

    case $key in
        --debug)
            set -x
            ;;

        -h|--help)
            usage
            exit 0
            ;;

        -n|--name)
            name="$2"
            givenParameters=$((givenParameters+1))
            shift
            ;;

        -d|--description)
            description="$2"
            givenParameters=$((givenParameters+1))
            shift
            ;;

        -u|--github-username)
            if [ "$2" == "default" ]; then
                githubUsername="$defaultGithubUsername"
            else
                githubUsername="$2"
            fi
            givenParameters=$((givenParameters+1))

            shift
            ;;

        -r|--repository)
            if [ "$2" == "default" ]; then
                repository="$defaultRepository"
            else
                repository="$2"
            fi
            givenParameters=$((givenParameters+1))

            shift
            ;;

        -p|--prefix)
            componentsNamePrefix="$2"
            givenParameters=$((givenParameters+1))
            shift
            ;;

        -s|--separator)
            if [ "$2" == "default" ]; then
                componentsNameSeparator="$defaultComponentsNameSeparator"
            else
                componentsNameSeparator="$2"
            fi
            givenParameters=$((givenParameters+1))

            shift
            ;;

        -b|--base-url)
            if [ "$2" == "default" ]; then
                baseUrl="$defaultBaseUrl"
            else
                baseUrl="$2"
            fi
            givenParameters=$((givenParameters+1))

            shift
            ;;

        --skip-git)
            skipGit=true
            ;;

        --skip-setup)
            skipSetup=true
            ;;

        *)
            # unknown option
            ;;
    esac

    shift
done


printfl "${BOLD}Welcome to the initialization of the ${BLUE}boilerplate${WHITE}!${DEFAULT}"

if [ $questionsNumber -gt $givenParameters ]; then
    printfl """
We will ask you some question to help you setup your new project. Ready?
"""
fi

printfl "\n"

readWithDefault "What is the plain human readable name of your project" "name"
cleanName=$(echo -e "${name}" | sed -r s/²/2/g | sed -r s/³/3/g | iconv -f UTF-8 -t ascii//TRANSLIT | tr -c '[:alnum:]\n\r-_' '-' | tr '[:upper:]' '[:lower:]')

defaultDescription="This is the description of ${name}"
if [ "$description" == "default" ]; then
    description="$defaultDescription"
fi
readWithDefault "How would you describe your project" "description"

readWithDefault "What is your GitHub username or organisation" "githubUsername"
githubUsername="${githubUsername,,}"

defaultRepository="${cleanName,,}"
readWithDefault "What is your GitHub repository name" "repository"
repository="${repository,,}"

defaultComponentsNamePrefix=$(echo $name | sed 's/\(\w\|-_ \)[^A-Z\-_ ]*\([^A-Z]\|$\)/\1/g')
defaultComponentsNamePrefix="${defaultComponentsNamePrefix,,}"
if [ "$componentsNamePrefix" == "default" ]; then
    componentsNamePrefix="${defaultComponentsNamePrefix}"
fi
readWithDefault "What prefix do you want to use for the components and directives name" "componentsNamePrefix"
componentsNamePrefix="${componentsNamePrefix,,}"

readWithDefault "What separator do you want to use for the components name" "componentsNameSeparator"
componentsNameSeparator="${componentsNameSeparator,,}"

readWithDefault "What will your base URL be" "baseUrl"
baseUrl="${baseUrl,,}"


printfl """
We are now ready to initialize the boilerplate for your project \"${BOLD}${name}${DEFAULT}\". Please wait...

"""


if [ "$skipGit" = false ]; then
    printfl "Preparing git...\t\t\t\t\t\t\t"
        rm -Rf .git
        exitIfError "Deleting git"
        git init -q
        exitIfError "Initializing git"
        git remote add upstream https://github.com/lumapps/boilerplate.git
        exitIfError "Adding Boilerplate upstream"
        git config remote.upstream.pushurl "push-to-boilerplate-disabled-from-here"
        exitIfError "Disabling push to Boilerplate"
    printfl "${BLUE}Done${DEFAULT}\n"
fi


printfl "Cleaning boilerplate files...\t\t\t\t\t\t"
    rm -Rf ./dist
    exitIfError "Deleting 'dist'"

    rm -Rf ./src/client/assets/token.json
    exitIfError "Deleting 'assets/token.json'"
    rm -Rf ./last-seed-commit.txt
    exitIfError "Deleting 'last-seed-commit.txt'"

    rm -Rf ./src/client/app/home
    exitIfError "Deleting 'home'"
    rm -Rf ./src/client/app/to-do
    exitIfError "Deleting 'to-do'"
    rm -Rf ./src/client/app/about
    exitIfError "Deleting 'about'"

    rm -Rf ./tests/client/e2e/pages/home.page.ts
    exitIfError "Deleting E2E 'Home' page"
    rm -Rf ./tests/client/e2e/specs/home.spec.ts
    exitIfError "Deleting E2E 'Home' specs"

    rm -Rf ./tests/client/e2e/report
    exitIfError "Deleting E2E report"
    rm -Rf ./tests/client/unit/report
    exitIfError "Deleting Unit report"
    rm -Rf ./tests/client/*Report.tar.gz
    exitIfError "Deleting tests reports archives"

    rm -Rf build.*
    exitIfError "Deleting build files"
    rm -Rf .awcache .tmp
    exitIfError "Deleting cache and temporary files"
printfl "${BLUE}Done${DEFAULT}\n"


printfl "Initializing code base and setting up application...\t\t\t"
    grep -v "HomeModule" ./src/client/app/app.module.ts > temp && mv temp ./src/client/app/app.module.ts
    exitIfError "Removing Home module in 'app' module"
    sed -i '18d' ./src/client/app/app.module.ts
    exitIfError "Removing empty line from 'app' module"

    rm -Rf ./src/client/app/app.component.*
    exitIfError "Removing original 'app' component files"

    printf -- "\n" &>> $LOG

    ./scaffold.sh -- --force -n "App" -p "default" --at-root -t "Component" --not-core -s 'default' --without-module --on-init --no-on-destroy --no-on-change --no-activated-route --no-constructor --router --routes &>> $LOG
    exitIfError "Scaffolding new 'app' component"
    sed -i "s/\[Component description\]/Top Level Component/g" ./src/client/app/app.component.ts
    exitIfError "Cleaning new 'app' component"

    printf -- """<h1 class=\"title\">
    Congratulations!
</h1>

<p>You have successfully setup the boilerplate!</p>
""" > ./src/client/app/app.component.html
    exitIfError "Updating the \"App\" component"

    printf -- """
p {
    text-align: center;
}
""" >> ./src/client/app/app.component.scss
    exitIfError "Updating the \"App\" style"

    sed -i "s#// import 'core/styles/example.scss';#import 'core/styles/app.scss';#g" ./src/client/app/app.component.ts
    exitIfError "Customizing styles in 'app' component"

    rm -Rf ./src/client/app/app.routes.ts
    exitIfError "Removing original 'app' routes files"
    touch ./src/client/app/app.routes.ts
    printf -- """import { Routes } from '@angular/router';

// If you need any other component, import it here. For example:
// import { MyComponent } from 'my-component/my.component';
// import { MyModule } from 'my-component/my.module';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';


/**
 * The main routes for the application.
 *
 * @type {Routes}
 * @readonly
 * @constant
 * @default
 */
export const routes: Routes = [
    /*
     * If you need any route global to the application, add it here.
     * Be sure to leave the \"NotFoundComponent\" route at the last position (as it will be the fallback route when no
     * other route will match.
     */
    // For example:
    // { component: MyComponent, path: 'my-component' },

    // You can also lazy-load some routes. For example:
    // { loadChildren: 'my-component/my.module#MyModule', path: 'lazy' };

    {
        component: NotFoundComponent,
        path: '**',
    },
];
""" > ./src/client/app/app.routes.ts

    grep -v "DoItem" ./src/client/app/core/services/utils.service.spec.ts > temp && mv temp ./src/client/app/core/services/utils.service.spec.ts
    exitIfError "Removing ToDoItem from the Utils Service specifications"

    printf -- """/**
 * The default base href of the application.
 *
 * @type {string}
 * @readonly
 * @constant
 * @default
 */
export const BASE_HREF: string = '${baseUrl}';
""" > $SETTINGS_FILE
    exitIfError "Customizing base href in app settings"

    printf -- """
/**
 * A fake token used for the tests.
 *
 * @type {string}
 * @readonly
 * @constant
 * @default
 */
export const FAKE_TOKEN: string = '123456789';
""" >> $SETTINGS_FILE
    exitIfError "Adding fake token"

    printf -- """/**
 * The default prefix for all (directives and components) selector.
 *
 * @type {string}
 * @readonly
 * @constant
 * @default
 */
export const SELECTOR_PREFIX: string = '${componentsNamePrefix}';
""" > $SELECTORS_FILE
    exitIfError "Customizing selector prefix in app settings"

    printf -- """
/**
 * The separator to use between the default prefix and the component name.
 * Note that directives don't use the separator as their names are written in camelCase.
 *
 * @type {string}
 * @readonly
 * @constant
 * @default
 */
export const SELECTOR_SEPARATOR: string = '${componentsNameSeparator}';

""" >> $SELECTORS_FILE
    exitIfError "Customizing selector separator in app settings"

    printf -- """
/**
 * The selector name of the \"NotFound\" component.
 *
 * @type {string}
 * @readonly
 * @constant
 * @default
 */
export const NOT_FOUND_SELECTOR: string = 'not-found';
""" >> $SELECTORS_FILE
    exitIfError "Customizing app component selector in app settings"

    printf -- """
/**
 * The selector name of the main \"App\" component.
 *
 * @type {string}
 * @readonly
 * @constant
 * @default
 */
export const APP_SELECTOR: string = 'app';
""" >> $SELECTORS_FILE
    exitIfError "Customizing app component selector in app settings"

    sed -i "s/${originalComponentsNamePrefix}${originalComponentsNameSeparator}app/${componentsNamePrefix}${componentsNameSeparator}app/g" $INDEX_FILE
    exitIfError "Customizing app component in index file"

    sed -i "s/\"${originalComponentsNamePrefix}\"/\"${componentsNamePrefix}\"/g" $TSLINT_FILE
    exitIfError "Customizing selector prefix in TSLint configuration"
printfl "${BLUE}Done${DEFAULT}\n"


printfl "Customizing documentation...\t\t\t\t\t\t"
    printf -- "# humanstxt.org\n# The humans responsible & technology colophon\n\n# TEAM\n\n\n# THANKS\n\n    AngularClass -- @AngularClass\n    Lumapps -- @lumapps\n    PatrickJS -- @gdi2290\n\n# TECHNOLOGY COLOPHON\n\n    HTML5, CSS3, SASS\n    Angular, TypeScript, JavaScript, Webpack, NPM\n" > $HUMANS_FILE
    exitIfError "Emptying humans file"

    mv $README_FILE README.boilerplate.md
    exitIfError "Copying readme file"
    touch $README_FILE
    exitIfError "Creating new readme file"
    if [ -n "$name" ]; then
        printf -- "# ${name}\n\n" > $README_FILE
        exitIfError "Writing project name in readme file"
    fi
    printf -- """# Roadmap
""" > $ROADMAP_FILE
    exitIfError "Emptying roadmap file"
    if [ -n "$name" ]; then
        printf """
### ${name}
""" >> $ROADMAP_FILE
        exitIfError "Adding project name in roadmap file"
    fi

    printf -- """# Changelog
""" > $CHANGELOG_FILE
    exitIfError "Emptying changelog file"

    if [ -n "${githubUsername}" ]; then
        sed -i "s#${originalGithubUsername}/#${githubUsername}/#g" $CONTRIBUTING_FILE
        exitIfError "Replacing original github username in contributing file"
    fi

    if [ -n "${repository}" ]; then
        sed -i "s#/${originalRepository}#/${repository}#g" $CONTRIBUTING_FILE
        exitIfError "Replacing original repository in contributing file"

        sed -i "s/${originalRepository}:/${repository}:/g" $CONTRIBUTING_FILE
        exitIfError "Replacing original repository in command of contributing file"
    fi

    printf -- "[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)\n" >> $README_FILE
    if [ -n "$description" ]; then
        printf -- "\n${description}\n" >> $README_FILE
        exitIfError "Writing description in readme file"
    fi
printfl "${BLUE}Done${DEFAULT}\n"


printfl "Customizing AngularCLI...\t\t\t\t\t\t"
printfl "${BLUE}Done${DEFAULT}\n"


printfl "Customizing NPM...\t\t\t\t\t\t\t"
    if [ -n "${description}" ]; then
        sed -i "s/\"description\".*/\"description\": \"${description}\",/g" $PACKAGE_FILE
        exitIfError "Replacing original description in package file"
    fi
    if [ -n "${githubUsername}" ]; then
        sed -i "s#https://github.com/${originalGithubUsername}/#https://github.com/${githubUsername}/#g" $PACKAGE_FILE
        exitIfError "Replacing original github username in package file"
    fi

    if [ -n "${repository}" ]; then
        sed -i "s#/${originalRepository}#/${repository}#g" $PACKAGE_FILE
        exitIfError "Replacing original repository in package file"
    fi

    gitUserName=$(git config user.name)
    gitUserEmail=$(git config user.email)
    sed -i "s#\"author\".*#\"author\": \"${gitUserName} <${gitUserEmail}> (https://github.com/${githubUsername})\",#g" $PACKAGE_FILE
    exitIfError "Replacing original authors in package file"
printfl "${BLUE}Done${DEFAULT}\n"


if [ -n "$name" ] && [ -n "$cleanName" ]; then
    printfl "Customizing project name...\t\t\t\t\t\t"

    FILES_WITH_NAME=$(grep -rl "${originalName}" .)
    for fileName in $FILES_WITH_NAME; do
        if [ "$fileName" != "./init.sh" ] && [ "$fileName" != "./README.boilerplate.md" ]; then
            sed -i "s/${originalName}/${name}/g" $fileName
            exitIfError "Replacing original name in ${fileName}"
        fi
    done

    FILES_WITH_CLEAN_NAME=$(grep -rl "${originalName,,}" .)
    for fileName in $FILES_WITH_CLEAN_NAME; do
        if [ "$fileName" != "./init.sh" ] && [ "$fileName" != "./README.boilerplate.md" ]; then
            sed -i "s/${originalName,,}/${cleanName,,}/g" $fileName
            exitIfError "Replacing original clean name in ${fileName}"
        fi
    done
    printfl "${BLUE}Done${DEFAULT}\n"
fi


if [ "$skipSetup" = false ]; then
    printfl "Setting-up dependencies (this may take a long time, please wait)...\t"
        printf -- "\n" &>> $LOG
        npm run -s setup:no-check &>> $LOG
        exitIfError "Setting up NPM"
    printfl "${BLUE}Done${DEFAULT}\n"
fi

if [ "$skipGit" = false ]; then
    printfl "Creating the first git commit...\t\t\t\t\t"
        git add .
        exitIfError "Adding project in git repository"

        noVerify=""
        if [ "$skipSetup" = false ]; then
            noVerify=" --no-verify"
        fi
        git commit${noVerify} -q -m "chore(${repository}): initialization of the repository with boilerplate"
    printfl "${BLUE}Done${DEFAULT}\n"
fi


printfl """
${GREEN}Your project has been successfully initialized!${DEFAULT}

You can now start coding. Run ${BOLD}npm start${DEFAULT} to start the server with all coding stuff you need.
A browser will automatically open. If not, you can go to ${BOLD}http://localhost:8880/${DEFAULT} to access your project.
You can also run ${BOLD}npm run help${DEFAULT} to have a list of all commands available.

You can now safely delete this initialization script: ${BOLD}rm -f ./init.sh${DEFAULT}.

${BOLD}${MAGENTA}Have fun coding with the LumBoilerplate!${DEFAULT}
"""

exit 0
