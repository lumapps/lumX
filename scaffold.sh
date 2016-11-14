#!/bin/bash
# This script is used to scaffold new modules, components, services, ...

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


function usage {
    printf """${BOLD}${GREEN}LumX² scaffolder${DEFAULT}

${UNDERLINE}${MAGENTA}${BOLD}Usage${DEFAULT}:
npm run -s scaffold -- [--debug] [--help] [-n|--name <name>] [-p|--path <path>] [-t|--type <type>] [--core] [--not-core] [--router] [--import-core]  [-s|--selector <selector>] [--create-module|--with-module] [--on-init] [--on-destroy] [--on-change] [--activated-route] [--constructor]

${UNDERLINE}${BLUE}Common options${DEFAULT}:
\t${CYAN}--debug${DEFAULT}\t\t\tDebug this scaffold script
\t${CYAN}--help${DEFAULT}\t\t\tPrint this help message.
\t${CYAN}-n, --name ${YELLOW}<name>${DEFAULT}\tThe name of the element you want to scaffold.
\t${CYAN}-p, --path ${YELLOW}<path>${DEFAULT}\tThe path for the scaffolded element.
\t${CYAN}-t, --type ${YELLOW}<type>${DEFAULT}\tThe type of element you want to scaffold. Allowed types are: 'Module', 'Component'
\t${CYAN}--core${DEFAULT}\t\t\tIndicates if it's a core element that's beeing scaffolded.
\t${CYAN}--not-core${DEFAULT}\t\tIndicates if it's not a core element that's beeing scaffolded.

${UNDERLINE}${BLUE}Modules options${DEFAULT}:
\t${CYAN}--router${DEFAULT}\t\tIndicates if we want to import the Router module in the scaffolded module.
\t${CYAN}--import-core${DEFAULT}\t\tIndicates if we want to import the Core module in the scaffolded module.

${UNDERLINE}${BLUE}Components options${DEFAULT}:
\t${CYAN}-s, --selector ${YELLOW}<sel>${DEFAULT}\tThe selector of the scaffolded component.
\t${CYAN}--create-module${DEFAULT}\t\tIndicates if we want to create a module associated with the scaffolded component.
\t${CYAN}--on-init${DEFAULT}\t\tIndicates if we want the 'ngOnInit' hook in the scaffolded component.
\t${CYAN}--on-destroy${DEFAULT}\t\tIndicates if we want the 'ngOnDestroy' hook in the scaffolded component.
\t${CYAN}--on-change${DEFAULT}\t\tIndicates if we want the 'ngOnChange' hook in the scaffolded component.
\t${CYAN}--activated-route${DEFAULT}\tIndicates if we want to get the activated route in the scaffolded component (will create a default constructor tomatically).
\t${CYAN}--constructor${DEFAULT}\t\tIndicates if we want to create an empty constructor in the scaffolded component.
"""
}

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

function readWithDefault() {
    if [ -n "${!2}" ]; then
        return 0
    fi

    if [ -n "$1" ] && [ -n "$2" ]; then
        defaultVarName="default${2^}"

        printf "${YELLOW}${1}?${DEFAULT} "
        if [ -n "${!defaultVarName}" ]; then
            printf "(${BOLD}${CYAN}${!defaultVarName}${DEFAULT}) "
        fi

        IFS= read -r inputValue
        if [ -n "$inputValue" ]; then
            eval $2=`echo -ne \""${inputValue}"\"`
        else
            eval $2=`echo -ne \""${!defaultVarName}"\"`
        fi
    fi
}

function menuWithDefault() {
    if [ -n "${!2}" ]; then
        return 0
    fi

    if [ -n "$1" ] && [ -n "$2" ]; then
        defaultVarName="default${2^}"

        optionsName="$3[@]"
        options=("${!optionsName}")

        printf "${YELLOW}${1}?${DEFAULT}\n"
        PS3="Pick an option -> "

        select inputValue in "${options[@]}"; do
            if [ -n "$inputValue" ]; then
                eval $2=`echo -ne \""${inputValue}"\"`
            else
                eval $2=`echo -ne \""${!defaultVarName}"\"`
            fi

            break
        done
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
    fi
}

function convertTabToSpace() {
    sed 's/\t/    /g' $1 > tmp_file && mv tmp_file $1
}


SCAFFOLD_TYPES=("Module" "Component" "Model" "Constant" "Message" "Reducer" "Service" "Setting" "Global Style" "Type")
SELECTORS_FILE="src/client/app/core/settings/selectors.settings.ts"


while [[ $# -ge 1 ]]; do
    key="$1"

    case $key in
        --debug)
            set -x
            ;;

        --help)
            usage
            exit 0
            ;;

        -n|--name)
            name="$2"
            shift
            ;;

        -p|--path)
            modulePath="$2"
            shift
            ;;

        -s|--selector)
            selector="$2"
            shift
            ;;

        -t|--type)
            scaffoldType="${2,,}"
            shift
            ;;

        --core)
            core="y"
            ;;

        --not-core)
            core="n"
            ;;

        --router)
            router="y"
            ;;

        --import-core)
            importCore="y"
            ;;

        --create-module|--with-module)
            createModule="y"
            ;;

        --on-init)
            onInit="y"
            ;;

        --on-destroy)
            onDestroy="y"
            ;;

        --on-change)
            onChange="y"
            ;;

        --activated-route)
            activatedRoute="y"
            ;;

        --constructor)
            constructor="y"
            ;;

        *)
            # unknown option
            ;;
    esac

    shift
done


printf "${BOLD}Welcome to the ${BLUE}LumX²${DEFAULT}${BOLD} scaffolder!${DEFAULT}\n"

defaultScaffoldType='Module'
if [ -z "$scaffoldType" ]; then
    printf "We will ask you some question to help you scaffold a new element in the project. Ready?\n\n"
else
    printf "We will ask you some question to help you scaffold a new ${scaffoldType} in the project. Ready?\n\n"
fi
menuWithDefault "What sort of element do you wish to scaffold" "scaffoldType" "SCAFFOLD_TYPES"
scaffoldType=${scaffoldType,,}

defaultCore="n"
coreMessage=""
if [ "$scaffoldType" == "module" ] || [ "$scaffoldType" == "component" ]; then
    readBooleanWithDefault "Is it a core ${scaffoldType}" "core"
fi
if [ "$core" == 'y' ]; then
    coreMessage="core "
fi

defaultName=""
if [ -z "$name" ]; then
    readWithDefault "Enter the name of your ${coreMessage}${scaffoldType}" "name"
fi

defaultModulePath="."
defaultRouter="n"
defaultImportCore="y"
defaultSelector=$(echo -e "${name,,}" | tr -d '\n\r' | tr '[[:space:]]' '-' | tr -dc '[:alnum:]-_')
selector=$defaultSelector
defaultCreateModule="y"
defaultOnInit="y"
defaultOnDestroy="y"
defaultOnChange="n"
if [ "$scaffoldType" == "module" ]; then
    if [ "$core" == 'n' ]; then
        readWithDefault "Enter the path (from 'src/client/app') of the module where you want to add the \"${name}\" ${coreMessage}${scaffoldType}" "modulePath"
    fi

    readBooleanWithDefault "Do you want to declare routes in the \"${name}\" ${coreMessage}${scaffoldType}" "router"
    readBooleanWithDefault "Do you want to import the core module in the \"${name}\" ${coreMessage}${scaffoldType}" "importCore"
elif [ "$scaffoldType" == "component" ]; then
    readWithDefault "Enter the selector of the \"${name}\" ${coreMessage}${scaffoldType}" "selector"
    readBooleanWithDefault "Do you want to create a module associated with the \"${name}\" ${coreMessage}${scaffoldType}" "createModule"
    thing="\"${name}\" ${coreMessage}${scaffoldType}"
    if [ "$createModule" == "y" ]; then
        thing="created \"${name}\" module"
    fi

    if [ "$core" == 'n' ]; then
        readWithDefault "Enter the path (from 'src/client/app') of the module where you want to add the ${thing}" "modulePath"
    fi

    if [ "$createModule" == "y" ]; then
        readBooleanWithDefault "Do you want to declare routes in the ${thing}" "router"
        readBooleanWithDefault "Do you want to import the core module in the ${thing}" "importCore"
    fi

    readBooleanWithDefault "Do you want to use the 'ngOnInit' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onInit"
    readBooleanWithDefault "Do you want to use the 'ngOnDestroy' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onDestroy"
    readBooleanWithDefault "Do you want to use the 'ngOnChange' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onChange"

    defaultActivatedRoute="n"
    if [ "$createModule" == "y" ] && [ "$router" == "y" ]; then
        defaultActivatedRoute="y"
    fi
    readBooleanWithDefault "Do you want to access route params in \"${name}\" ${coreMessage}${scaffoldType}" "activatedRoute"

    defaultConstructor="y"
    constructor=$activatedRoute
    readBooleanWithDefault "Do you want a constructor in \"${name}\" ${coreMessage}${scaffoldType}" "constructor"
fi


printf "\n"
printf "We are now ready to scaffold your ${BOLD}${coreMessage}${scaffoldType}${DEFAULT}. Please wait...\n\n"

function initModule() {
    _moduleName="$1"
    _selector="${2,,}"
    _modulePath="${3%/}"
    [[ "$4" = "y" ]] && _isCoreModule=true || _isCoreModule=false
    [[ "$5" = "y" ]] && _useRouter=true || _useRouter=false
    [[ "$6" = "y" ]] && _importCore=true || _importCore=false
    [[ "$7" = "y" ]] && _forComponent=true || _forComponent=false

    directory="src/client/app/core/modules/"

    if [ "$_isCoreModule" = false ]; then
        if [ -n "$_modulePath" ]; then
            if [ "$_modulePath" == "." ]; then
                _modulePath=""
            else
                _modulePath="${_modulePath}/"
            fi
        fi
        directory="src/client/app/${_modulePath}${_selector}"

        defaultCreateModuleDirectory="y"
        if [ -d $directory ]; then
            readBooleanWithDefault "The module directory \"${directory}\" already exists. Are you sure you want to continue" "createModuleDirectory"
        fi

        if [ "$createModuleDirectory" == "n" ]; then
            return 0
        fi

        printf "Creating module directory \"${directory}\"... "
        if [ ! -d $directory ]; then
            mkdir -p $directory
            exitIfError "Creating module \"${directory}\" directory"
        fi
        printf "${BLUE}Done${DEFAULT}\n"
    fi

    cd $directory
    moduleFile="${_selector}.module.ts"

    defaultCreateModuleFile="y"
    createModuleFile="y"
    if [ -f $moduleFile ]; then
        readBooleanWithDefault "The module file \"${directory}${moduleFile}\" already exists. Are you sure you want to continue" "createModuleFile"
    fi

    if [ "$createModuleFile" == "y" ]; then
        rm -Rf $moduleFile
        exitIfError "Deleting existing \"${directory}/${moduleFile}\" file"
    else
        return 0
    fi

    printf "Creating files and directories... "
        if [ "$_isCoreModule" = false ] && [ "$_forComponent" = false ] && [ ! -d "components" ]; then
            mkdir -p "components"
            exitIfError "Creating \"${directory}/components\" directory"
        fi

        touch $moduleFile
        exitIfError "Creating \"${directory}/${moduleFile}\" file"
    printf "${BLUE}Done${DEFAULT}\n"

    printf "Creating TypeScript module... "
        className=$(echo -e "${_moduleName}" | sed -r 's/(^| )([A-Za-z0-9])/\U\2/g' | tr -d '[[:space:]]\n\r-' | tr -dc '[:alnum:]\n\r')
        componentClassName=""

        printf "import { NgModule } from '@angular/core';\n" > $moduleFile
        if [ "$_useRouter" = true ]; then
            printf "import { RouterModule } from '@angular/router';\n" >> $moduleFile
        fi

        if [ "$_importCore" = true ]; then
            printf "\nimport { CoreModule } from 'core/modules/core.module';\n" >> $moduleFile
        fi

        if [ "$_forComponent" = true ]; then
            root="."
            subPath=""
            if [ "$_isCoreModule" = true ]; then
                root=".."
                subPath="components/${_selector}/"
            fi
            printf "\nimport { ${className}Component } from '${root}/${subPath}${_selector}.component';\n" >> $moduleFile
        fi

        printf "\n" >> $moduleFile
        printf "\n" >> $moduleFile

        printf "@NgModule({\n" >> $moduleFile
            printf "\tdeclarations: [\n" >> $moduleFile
                if [ "$_forComponent" = true ]; then
                    printf "\t\t${className}Component,\n" >> $moduleFile
                fi
            printf "\t],\n\n" >> $moduleFile
            printf "\texports: [\n" >> $moduleFile
                if [ "$_importCore" = true ]; then
                    printf "\t\tCoreModule,\n" >> $moduleFile
                fi
                if [ "$_forComponent" = true ]; then
                    printf "\t\t${className}Component,\n" >> $moduleFile
                fi
                if [ "$_useRouter" = true ]; then
                    printf "\t\tRouterModule,\n" >> $moduleFile
                fi
            printf "\t],\n\n" >> $moduleFile
            printf "\timports: [\n" >> $moduleFile
                if [ "$_importCore" = true ]; then
                    printf "\t\tCoreModule,\n" >> $moduleFile
                fi
                if [ "$_useRouter" = true ]; then
                    printf "\t\tRouterModule.forChild([\n" >> $moduleFile
                        printf "\t\t\t{\n" >> $moduleFile
                            if [ "$_forComponent" = true ]; then
                                printf "\t\t\t\tcomponent: ${className}Component,\n" >> $moduleFile
                            fi
                            printf "\t\t\t\tpath: '',\n" >> $moduleFile
                        printf "\t\t\t},\n" >> $moduleFile
                    printf "\t\t]),\n" >> $moduleFile
                fi
            printf "\t],\n\n" >> $moduleFile
            printf "\tproviders: [\n" >> $moduleFile
            printf "\t],\n\n" >> $moduleFile
        printf "})\n" >> $moduleFile

        printf "/**\n" >> $moduleFile
        printf " * The \"${_moduleName}\" module\n" >> $moduleFile
        printf " */\n" >> $moduleFile

        printf "export class ${className}Module {}\n" >> $moduleFile

        convertTabToSpace "$moduleFile"

    printf "${BLUE}Done${DEFAULT}\n"

    cd - > /dev/null
}

function initComponent() {
    _componentName="$1"
    _selector="${2,,}"
    _modulePath="${3%/}"
    [[ "$4" = "y" ]] && _isCoreComponent=true || _isCoreComponent=false
    [[ "$5" = "y" ]] && _generateOnInit=true || _generateOnInit=false
    [[ "$6" = "y" ]] && _generateOnDestroy=true || _generateOnDestroy=false
    [[ "$7" = "y" ]] && _generateOnChange=true || _generateOnChange=false
    [[ "$8" = "y" ]] && _hasActivatedRoute=true || _hasActivatedRoute=false
    [[ "$9" = "y" ]] && _generateConstructor=true || _generateConstructor=false

    directory="src/client/app/core/components/${_selector}/"

    if [ "$_isCoreComponent" = false ]; then
        if [ -n "$_modulePath" ]; then
            if [ "$_modulePath" == "." ]; then
                _modulePath=""
            else
                _modulePath="${_modulePath}/"
            fi
        fi
        directory="src/client/app/${_modulePath}${_selector}/"
    fi

    defaultCreateComponentsDirectory="y"
    if [ -d $directory ] && [ "$createModule" = "n" ]; then
        readBooleanWithDefault "The component directory \"${directory}\" already exists. All files will be erased! Are you sure you want to continue" "createComponentsDirectory"
    fi

    if [ "$createComponentsDirectory" == "n" ]; then
        return 0
    fi

    printf "Creating component directory '${directory}'... "
    if [ ! -d $directory ]; then
        mkdir -p $directory
        exitIfError "Creating \"${directory}\" directory"
    fi
    printf "${BLUE}Done${DEFAULT}\n"

    cd $directory
    componentFile="${_selector}.component.ts"
    componentSpecFile="${_selector}.component.spec.ts"
    componentTemplateFile="${_selector}.component.html"
    componentStyleFile="${_selector}.component.scss"
    printf "Creating files... "
        touch $componentFile
        exitIfError "Creating \"${directory}/${componentFile}\" file"
        touch $componentSpecFile
        exitIfError "Creating \"${directory}/${componentSpecFile}\" file"
        touch $componentTemplateFile
        exitIfError "Creating \"${directory}/${componentTemplateFile}\" file"
        touch $componentStyleFile
        exitIfError "Creating \"${directory}/${componentStyleFile}\" file"
    printf "${BLUE}Done${DEFAULT}\n"

    printf "Creating TypeScript component... "
        className=$(echo -e "${_componentName}" | sed -r 's/(^| )([A-Za-z0-9])/\U\2/g' | tr -d '[[:space:]]\n\r-' | tr -dc '[:alnum:]\n\r')

        printf "import { Component } from '@angular/core';\n" > $componentFile
        imports=""
        implements=""
        if [ "$_generateOnChange" = true ]; then
            if [ -n "${imports}" ]; then
                imports="${imports}, "
                implements="${implements}, "
            fi
            imports="${imports}OnChange"
            implements="${implements}OnChange"
        fi
        if [ "$_generateOnDestroy" = true ]; then
            if [ -n "${imports}" ]; then
                imports="${imports}, "
                implements="${implements}, "
            fi
            imports="${imports}OnDestroy"
            implements="${implements}OnDestroy"
        fi
        if [ "$_generateOnInit" = true ]; then
            if [ -n "${imports}" ]; then
                imports="${imports}, "
                implements="${implements}, "
            fi
            imports="${imports}OnInit"
            implements="${implements}OnInit"
        fi
        if [ -n "$imports" ]; then
            printf "import { ${imports} } from '@angular/core';\n" >> $componentFile
        fi
        if [ "$_hasActivatedRoute" = true ]; then
            printf "import { ActivatedRoute } from '@angular/router';\n" >> $componentFile
        fi

        printf "\n" >> $componentFile

        printf "import { ${className^^}_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';\n" >> $componentFile
        printf "import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';\n" >> $componentFile

        printf "\n" >> $componentFile
        printf "\n" >> $componentFile

        printf "/*\n" >> $componentFile
        printf " * Component template\n" >> $componentFile
        printf " */\n" >> $componentFile
        printf "const template: string = require('./' + SELECTOR + '.component.html');\n" >> $componentFile

        printf "\n" >> $componentFile
        printf "\n" >> $componentFile

        printf "@Component({\n" >> $componentFile
            printf "\tselector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,\n" >> $componentFile
            printf "\tstyles: [\n" >> $componentFile
                printf "\t\trequire('./' + SELECTOR + '.component.scss'),\n" >> $componentFile
            printf "\t],\n" >> $componentFile
            printf "\ttemplate: template,\n" >> $componentFile
        printf "})\n" >> $componentFile

        printf "/**\n" >> $componentFile
        printf " * \"${_componentName}\" component\n" >> $componentFile
        printf " *\n" >> $componentFile
        printf " * [Component description]\n" >> $componentFile
        printf " */\n" >> $componentFile

        if [ -n "$implements" ]; then
            implements="implements ${implements} "
        fi
        printf "export class ${className}Component ${implements}{\n" >> $componentFile

        if [ "$_generateConstructor" = true ]; then
            params=""
            printf "\t/**\n" >> $componentFile
            printf "\t * Constructs a new \"${_componentName}\" component.\n" >> $componentFile
            printf "\t *\n" >> $componentFile
            printf "\t * @constructs ${className}Component\n" >> $componentFile
            if [ "$_hasActivatedRoute" = true ]; then
                params="public route: ActivatedRoute"
                printf "\t *\n" >> $componentFile
                printf "\t * @param {ActivatedRoute} route The activated route.\n" >> $componentFile
            fi
            printf "\t */\n" >> $componentFile
            printf "\tconstructor(${params}) {\n" >> $componentFile
            printf "\t\t// TODO: write \"${_componentName}\" component constructor\n" >> $componentFile
            printf "\t}\n\n" >> $componentFile
        fi

        if [ "$_generateOnChange" = true ]; then
            if [ "$_generateConstructor" = true ]; then
                printf "\n" >> $componentFile
            fi

            printf "\t/**\n" >> $componentFile
            printf "\t * Called when any InputProperty of the component has changed.\n" >> $componentFile
            printf "\t *\n" >> $componentFile
            printf "\t * @param {Object} changes The changes that occured.\n" >> $componentFile
            printf "\t */\n" >> $componentFile
            printf "\tngOnChange(changes: { [propertyName: string]: SimpleChange }): void {\n" >> $componentFile
            printf "\t\t// TODO: write \"${_componentName}\" component 'ngOnChange' lifecycle hook\n" >> $componentFile
            printf "\t}\n" >> $componentFile
        fi

        if [ "$_generateOnDestroy" = true ]; then
            if [ "$_generateConstructor" = true ] || [ "$_generateOnChange" = true ]; then
                printf "\n" >> $componentFile
            fi

            printf "\t/**\n" >> $componentFile
            printf "\t * Called when the component is destroyed.\n" >> $componentFile
            printf "\t */\n" >> $componentFile
            printf "\tngOnDestroy(): void {\n" >> $componentFile
            printf "\t\t// TODO: write \"${_componentName}\" component 'ngOnDestroy' lifecycle hook\n" >> $componentFile
            printf "\t}\n" >> $componentFile
        fi

        if [ "$_generateOnInit" = true ]; then
            if [ "$_generateConstructor" = true ] || [ "$_generateOnChange" = true ] || [ "$_generateOnDestroy" = true ]; then
                printf "\n" >> $componentFile
            fi

            printf "\t/**\n" >> $componentFile
            printf "\t * Called when the component is initialized.\n" >> $componentFile
            printf "\t */\n" >> $componentFile
            printf "\tngOnInit(): void {\n" >> $componentFile
            printf "\t\t// TODO: write \"${_componentName}\" component 'ngOnInit' lifecycle hook\n" >> $componentFile
            printf "\t}\n" >> $componentFile
        fi

        printf "}\n" >> $componentFile

        convertTabToSpace "$componentFile"

    printf "${BLUE}Done${DEFAULT}\n"

    cd - > /dev/null
    if [ -w $SELECTORS_FILE ]; then
        printf "Adding selector... "
            printf "export const ${className^^}_SELECTOR: string = '${_selector}';\n" >> $SELECTORS_FILE
            exitIfError "Adding selector to the selectors file"
        printf "${BLUE}Done${DEFAULT}\n"
    fi
}

case "${scaffoldType}" in
    "module")
        initModule "$name" "$selector" "$modulePath" "$core" "$router" "$importCore"
        exitIfError "Scaffolding the module"
        ;;

    "component")
        if [ "$createModule" == "y" ]; then
            initModule "$name" "$selector" "$modulePath" "$core" "$router" "$importCore" "y"
            exitIfError "Scaffolding the component's module"
        fi
        initComponent "$name" "$selector" "$modulePath" "$core" "$onInit" "$onDestroy" "$onChange" "$activatedRoute" "$constructor"
        exitIfError "Scaffolding the component"
        ;;

    "model")
        ;;

    "constant")
        ;;

    "message")
        ;;

    "reducer")
        ;;

    "service")
        ;;

    "setting")
        ;;

    "global Style")
        ;;

    "type")
        ;;
esac


printf "\n"
printf "${GREEN}Your ${scaffoldType} has been successfully initialized!${DEFAULT}\n\n"

printf "${BOLD}${MAGENTA}Have a good one!${DEFAULT}\n"

exit 0
