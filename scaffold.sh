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
    printf """${BOLD}${GREEN}LumBoilerplate scaffolder${DEFAULT}

${UNDERLINE}${MAGENTA}${BOLD}Usage${DEFAULT}:
npm run -s scaffold -- [--debug] [--help] [--force] [-n|--name <name>] [-p|--path <path>|\"default\"] [--at-root|--not-at-root] [-t|--type <type>] [--core|--not-core] [--router|--no-router] [--import-core|--not-import-core]  [-s|--selector <selector>|\"default\"] [--with-module|--without-module] [--on-init|--no-on-init] [--on-destroy|--no-on-destroy] [--on-change|--no-on-change] [--activated-route|--no-activated-route] [--constructor|--no-constructor]

${UNDERLINE}${BLUE}Common options${DEFAULT}:
\t${CYAN}--debug${DEFAULT}\t\t\t\t\tDebug this scaffold script
\t${CYAN}--help${DEFAULT}\t\t\t\t\tPrint this help message.
\t${CYAN}--force${DEFAULT}\t\t\t\t\tDon't ask confirmation for overwritting directory or files.
\t${CYAN}-n, --name ${YELLOW}<name>${DEFAULT}\t\t\tThe name of the element you want to scaffold.
\t${CYAN}-p, --path ${YELLOW}<path>|\"default\"${DEFAULT}\t\tThe path (from 'src/client/app/') for the scaffolded element (if \"default\", will be at the root of 'src/client/app/').
\t${CYAN}--[not-]at-root${DEFAULT}\t\t\t\tIndicates if we want to create the element at the root of the given path or in a subdirectory (whose name will be the selector of the element).
\t${CYAN}-t, --type ${YELLOW}<type>${DEFAULT}\t\t\tThe type of element you want to scaffold. Allowed types are: 'Module', 'Component'
\t${CYAN}--[not-]core${DEFAULT}\t\t\t\tIndicates if it's a core element that's beeing scaffolded or not.

${UNDERLINE}${BLUE}Modules options${DEFAULT}:
\t${CYAN}--[no-]router${DEFAULT}\t\t\t\tIndicates if we want to import the Router module in the scaffolded module or not.
\t${CYAN}--[not-]import-core${DEFAULT}\t\t\tIndicates if we want to import the Core module in the scaffolded module or not.

${UNDERLINE}${BLUE}Components options${DEFAULT}:
\t${CYAN}-s, --selector ${YELLOW}<selector>|\"default\"${DEFAULT}\tThe selector of the scaffolded component (if \"default\", will be computed from the given component name).
\t${CYAN}--with[out]-module${DEFAULT}\t\t\tIndicates if we want to create a module associated with the scaffolded component or not.
\t${CYAN}--[no-]on-init${DEFAULT}\t\t\t\tIndicates if we want the 'ngOnInit' hook in the scaffolded component or not.
\t${CYAN}--[no-]on-destroy${DEFAULT}\t\t\tIndicates if we want the 'ngOnDestroy' hook in the scaffolded component or not.
\t${CYAN}--[no-]on-change${DEFAULT}\t\t\tIndicates if we want the 'ngOnChange' hook in the scaffolded component or not.
\t${CYAN}--[no-]activated-route${DEFAULT}\t\t\tIndicates if we want to get the activated route in the scaffolded component (will create a default constructor automatically) or not.
\t${CYAN}--[no-]constructor${DEFAULT}\t\t\tIndicates if we want to create an empty constructor in the scaffolded component or not.
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


defaultScaffoldType='Module'
defaultCore="n"
defaultName=""
defaultModulePath="."
defaultAtRoot="n"
defaultRouter="n"
defaultImportCore="y"
defaultSelector=""
defaultCreateModule="y"
defaultOnInit="y"
defaultOnDestroy="y"
defaultOnChange="n"
defaultActivatedRoute="n"
defaultConstructor="y"


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
            if [ "$2" == "default" ]; then
                modulePath="${defaultModulePath%/}"
            else
                modulePath="${2%/}"
            fi

            shift
            ;;

        --at-root)
            atRoot="y"
            ;;

        --not-at-root)
            atRoot="n"
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

        --no-router)
            router="n"
            ;;

        --import-core)
            importCore="y"
            ;;

        --not-import-core)
            importCore="n"
            ;;

        --with-module)
            createModule="y"
            ;;

        --without-module)
            createModule="n"
            ;;

        --on-init)
            onInit="y"
            ;;

        --no-on-init)
            onInit="n"
            ;;

        --on-destroy)
            onDestroy="y"
            ;;

        --no-on-destroy)
            onDestroy="n"
            ;;

        --on-change)
            onChange="y"
            ;;

        --no-on-change)
            onChange="n"
            ;;

        --activated-route)
            activatedRoute="y"
            ;;

        --no-activated-route)
            activatedRoute="n"
            ;;

        --constructor)
            constructor="y"
            ;;

        --no-constructor)
            constructor="n"
            ;;

        *)
            # unknown option
            ;;
    esac

    shift
done


printf "${BOLD}Welcome to the ${BLUE}LumBoilerplate${DEFAULT}${BOLD} scaffolder!${DEFAULT}\n"

if [ -z "$scaffoldType" ]; then
    printf "We will ask you some question to help you scaffold a new element in the project. Ready?\n\n"
else
    printf "We will ask you some question to help you scaffold a new ${scaffoldType} in the project. Ready?\n\n"
fi
menuWithDefault "What sort of element do you wish to scaffold" "scaffoldType" "SCAFFOLD_TYPES"
scaffoldType=${scaffoldType,,}

coreMessage=""
if [ "$scaffoldType" == "module" ] || [ "$scaffoldType" == "component" ]; then
    readBooleanWithDefault "Is it a core ${scaffoldType}" "core"
fi
if [ "$core" == 'y' ]; then
    coreMessage="core "
fi

if [ -z "$name" ]; then
    readWithDefault "Enter the name of your ${coreMessage}${scaffoldType}" "name"
fi

defaultSelector=$(echo -e "${name,,}" | tr -d '\n\r' | tr '[[:space:]]' '-' | tr -dc '[:alnum:]-_')
if [ -z "$selector" ] || [ "$selector" == "default" ]; then
    selector="$defaultSelector"
fi
if [ "$scaffoldType" == "module" ]; then
    if [ "$core" == 'n' ]; then
        readWithDefault "Enter the path (from 'src/client/app') of the module where you want to add the \"${name}\" ${coreMessage}${scaffoldType}" "modulePath"
        modulePath="${modulePath%/}"

        displayedModulePath="$modulePath"
        if [ "$displayedModulePath" == "." ]; then
            displayedModulePath=""
        fi
        readBooleanWithDefault "Do you want to add the \"${name}\" ${coreMessage}${scaffoldType} at the root of 'src/client/app/${displayedModulePath}' or in a '${selector}' subdirectory" "atRoot"
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
        modulePath="${modulePath%/}"

        displayedModulePath="$modulePath"
        if [ "$displayedModulePath" == "." ]; then
            displayedModulePath=""
        fi
        readBooleanWithDefault "Do you want to add the \"${name}\" ${coreMessage}${scaffoldType} at the root of 'src/client/app/${displayedModulePath}' or in a '${selector}' subdirectory" "atRoot"
    fi

    if [ "$createModule" == "y" ]; then
        readBooleanWithDefault "Do you want to declare routes in the ${thing}" "router"
        readBooleanWithDefault "Do you want to import the core module in the ${thing}" "importCore"
    fi

    readBooleanWithDefault "Do you want to use the 'ngOnInit' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onInit"
    readBooleanWithDefault "Do you want to use the 'ngOnDestroy' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onDestroy"
    readBooleanWithDefault "Do you want to use the 'ngOnChange' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onChange"

    if [ "$createModule" == "y" ] && [ "$router" == "y" ]; then
        defaultActivatedRoute="y"
    fi
    readBooleanWithDefault "Do you want to access route params in \"${name}\" ${coreMessage}${scaffoldType}" "activatedRoute"

    constructor="$activatedRoute"
    readBooleanWithDefault "Do you want a constructor in \"${name}\" ${coreMessage}${scaffoldType}" "constructor"
fi

if [ "$atRoot" == "y" ]; then
    modulePath="${modulePath}/@root@"
fi
modulePath="${modulePath%/}"


printf "\n"
printf "We are now ready to scaffold your ${BOLD}${coreMessage}${scaffoldType}${DEFAULT}. Please wait...\n\n"

function initModule() {
    _moduleName="$1"
    _selector="${2,,}"
    _modulePath="${3%/}"
    [[ "$4" == "y" ]] && _isCoreModule=true || _isCoreModule=false
    [[ "$5" == "y" ]] && _useRouter=true || _useRouter=false
    [[ "$6" == "y" ]] && _importCore=true || _importCore=false
    [[ "$7" == "y" ]] && _forComponent=true || _forComponent=false

    directory="src/client/app/core/modules/"

    if [ "$_isCoreModule" = false ]; then
        local _rootSuffix="@root@"
        local _atRoot=false

        if [ -n "$_modulePath" ]; then
            if [[ "$_modulePath" == *"$_rootSuffix" ]]; then
                _atRoot=true
                modulePath=${_modulePath%$_rootSuffix}
                modulePath=${_modulePath%/}
            fi

            if [ "$_modulePath" == "." ]; then
                _modulePath=""
            else
                _modulePath="${_modulePath}/"
            fi
        fi
        directory="src/client/app/${_modulePath}"

        if [ "$_atRoot" = false ]; then
            directory="${directory}${_selector}/"
        fi

        defaultCreateModuleDirectory="y"
        if [ -d $directory ] && [ "$force" == "n" ]; then
            readBooleanWithDefault "The module directory \"${directory}\" already exists. Are you sure you want to continue (some file contained in the directory may be overwritten)" "createModuleDirectory"
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
    if [ -f $moduleFile ] && [ "$force" == "n" ]; then
        readBooleanWithDefault "The module file \"${directory}${moduleFile}\" already exists. Are you sure you want to continue (the file will be overwritten)" "createModuleFile"
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

        convertTabToSpace $moduleFile

    printf "${BLUE}Done${DEFAULT}\n"

    cd - > /dev/null
}

function initComponent() {
    _componentName="$1"
    _selector="${2,,}"
    _modulePath="${3%/}"
    [[ "$4" == "y" ]] && _isCoreComponent=true || _isCoreComponent=false
    [[ "$5" == "y" ]] && _generateOnInit=true || _generateOnInit=false
    [[ "$6" == "y" ]] && _generateOnDestroy=true || _generateOnDestroy=false
    [[ "$7" == "y" ]] && _generateOnChange=true || _generateOnChange=false
    [[ "$8" == "y" ]] && _hasActivatedRoute=true || _hasActivatedRoute=false
    [[ "$9" == "y" ]] && _generateConstructor=true || _generateConstructor=false
    [[ "${10}" == "y" ]] && _hasGeneratedModule=true || _hasGeneratedModule=false

    directory="src/client/app/core/components/${_selector}/"

    if [ "$_isCoreComponent" = false ]; then
        local _rootSuffix="@root@"
        local _atRoot=false

        if [ -n "$_modulePath" ]; then
            if [[ "$_modulePath" == *"$_rootSuffix" ]]; then
                _atRoot=true
                _modulePath=${_modulePath%$_rootSuffix}
                _modulePath=${_modulePath%/}
            fi

            if [ "$_modulePath" == "." ]; then
                _modulePath=""
            else
                _modulePath="${_modulePath}/"
            fi
        fi
        directory="src/client/app/${_modulePath}"

        if [ "$_atRoot" = false ]; then
            directory="${directory}${_selector}/"
        fi
    fi

    defaultCreateComponentsDirectory="y"
    if [ -d $directory ] && [ "$createModule" == "n" ] && [ "$force" == "n" ]; then
        readBooleanWithDefault "The component directory \"${directory}\" already exists. All files will be overwritten! Are you sure you want to continue" "createComponentsDirectory"
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

        imports="Component"
        implements=""
        if [ "$_generateOnChange" = true ]; then
            if [ -n "${implements}" ]; then
                implements="${implements}, "
            fi
            imports="${imports}, OnChange"
            implements="${implements}OnChange"
        fi
        if [ "$_generateOnDestroy" = true ]; then
            if [ -n "${implements}" ]; then
                implements="${implements}, "
            fi
            imports="${imports}, OnDestroy"
            implements="${implements}OnDestroy"
        fi
        if [ "$_generateOnInit" = true ]; then
            if [ -n "${implements}" ]; then
                implements="${implements}, "
            fi
            imports="${imports}, OnInit"
            implements="${implements}OnInit"
        fi
        printf "import { ${imports} } from '@angular/core';\n" > $componentFile
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
        printf "const template: string = require(\`./\${SELECTOR}.component.html\`);\n" >> $componentFile

        printf "\n" >> $componentFile
        printf "\n" >> $componentFile

        printf "@Component({\n" >> $componentFile
            printf "\tselector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,\n" >> $componentFile
            printf "\tstyles: [\n" >> $componentFile
                printf "\t\trequire(\`./\${SELECTOR}.component.scss\`),\n" >> $componentFile
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

        convertTabToSpace $componentFile
    printf "${BLUE}Done${DEFAULT}\n"

    printf "Creating Unit tests component... "
        printf "import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';\n" > $componentSpecFile
        printf "// You can also import for exemple: 'async', 'fakeAsync', 'tick', ...\n" >> $componentSpecFile
        printf "\n" >> $componentSpecFile

        printf "// If you need to import any service or other, import it here\n" >> $componentSpecFile
        printf "\n" >> $componentSpecFile

        printf "import { ${className}Component } from './${_selector}.component';\n" >> $componentSpecFile
        if [ "$_hasGeneratedModule" = true ]; then
            printf "import { ${className}Module } from './${_selector}.module';\n" >> $componentSpecFile
        fi
        printf "\n" >> $componentSpecFile

        printf "// If you need another specific module (core module, ...), import it here\n" >> $componentSpecFile
        printf "\n\n" >> $componentSpecFile

        printf "describe('${_componentName}', () => {\n" >> $componentSpecFile
            printf "\tconst component: ${className}Component;\n" >> $componentSpecFile
            printf "\tconst fixture: ComponentFixture<${className}Component>;\n" >> $componentSpecFile
            printf "\n" >> $componentSpecFile

            printf "\t// If you want to get any service\n" >> $componentSpecFile
            printf "\t// const myService: MyService;\n" >> $componentSpecFile
            printf "\n" >> $componentSpecFile

            printf "\t// If you want to declare spies (see http://tobyho.com/2011/12/15/jasmine-spy-cheatsheet/)\n" >> $componentSpecFile
            printf "\t// const spy: jasmine.Spy;\n" >> $componentSpecFile
            printf "\n" >> $componentSpecFile

            printf "\tbeforeEach(() => {\n" >> $componentSpecFile
                printf "\t\tTestBed.configureTestingModule({\n" >> $componentSpecFile
                    if [ "$_hasGeneratedModule" = true ]; then
                        printf "\t\t\tdeclarations: [\n" >> $componentSpecFile
                        printf "\t\t\t],\n\n" >> $componentSpecFile
                    else
                        printf "\t\t\tdeclarations: [\n" >> $componentSpecFile
                            printf "\t\t\t\t${className}Component,\n" >> $componentSpecFile
                        printf "\t\t\t],\n\n" >> $componentSpecFile
                    fi

                    printf "\t\t\texports: [\n" >> $componentSpecFile
                    printf "\t\t\t],\n\n" >> $componentSpecFile

                    printf "\t\t\timports: [\n" >> $componentSpecFile
                        if [ "$_hasGeneratedModule" = true ]; then
                            printf "\t\t\t\t${className}Module,\n" >> $componentSpecFile
                        else
                            printf "\t\t\t\t// Add any module you want to import here\n" >> $componentSpecFile
                        fi
                    printf "\t\t\t],\n\n" >> $componentSpecFile

                    printf "\t\t\tproviders: [\n" >> $componentSpecFile
                        printf "\t\t\t\t{ provide: ComponentFixtureAutoDetect, useValue: true },\n" >> $componentSpecFile
                        printf "\t\t\t\t// If you have any other provider to declare, add it here\n" >> $componentSpecFile
                        printf "\t\t\t\t// You can also declare services doubles (stub, mockup, ...) here:\n" >> $componentSpecFile
                        printf "\t\t\t\t// { provide: MyService, useValue: myServiceStub }\n" >> $componentSpecFile
                    printf "\t\t\t],\n" >> $componentSpecFile
                printf "\t\t});\n" >> $componentSpecFile
                printf "\n" >> $componentSpecFile

                printf "\t\tfixture = TestBed.createComponent(${className}Component);\n" >> $componentSpecFile
                printf "\t\tcomponent = fixture.componentInstance;\n" >> $componentSpecFile
                printf "\n" >> $componentSpecFile

                printf "\t\t// If you want to use any service, remember to get it from either:\n" >> $componentSpecFile
                printf "\t\t//     The root injector:\n" >> $componentSpecFile
                printf "\t\t// myService = TestBed.get(MyService);\n" >> $componentSpecFile
                printf "\t\t//     The component injector:\n" >> $componentSpecFile
                printf "\t\t// myService = fixture.debugElement.injector.get(MyService);\n" >> $componentSpecFile
                printf "\n" >> $componentSpecFile

                printf "\t\t// You can also declare spies on method here (see http://tobyho.com/2011/12/15/jasmine-spy-cheatsheet/):\n" >> $componentSpecFile
                printf "\t\t// spy = spyOn(myService, 'myMethod').and.returnValue('myValue');\n" >> $componentSpecFile
            printf "\t});\n" >> $componentSpecFile
            printf "\n" >> $componentSpecFile

            printf "\t// For more info on how to test in Angular2, see https://angular.io/docs/ts/latest/guide/testing.html\n" >> $componentSpecFile
            printf "\tit('should have a test written here', () => {\n" >> $componentSpecFile
                printf "\t\t// This is not required here as 'ComponentFixtureAutoDetect' is enabled\n" >> $componentSpecFile
                printf "\t\t// However, it's always good to be explicit\n" >> $componentSpecFile
                printf "\t\t// Also, remember to call 'fixture.detectChanges();' anytime you want to update the component state\n" >> $componentSpecFile
                printf "\t\tfixture.detectChanges();\n" >> $componentSpecFile
                printf "\n" >> $componentSpecFile

                printf "\t\t// If you have defined spies, you can check them:;\n" >> $componentSpecFile
                printf "\t\t// expect(spy.calls.any()).toBe(false);\n" >> $componentSpecFile
                printf "\n" >> $componentSpecFile

                printf "\t\texpect(component).toBeDefined();\n" >> $componentSpecFile
                printf "\t\texpect(false).toBe(true);\n" >> $componentSpecFile
            printf "\t});\n" >> $componentSpecFile
        printf "});\n" >> $componentSpecFile

        convertTabToSpace $componentSpecFile
    printf "${BLUE}Done${DEFAULT}\n"

    printf "Creating component's template... "
        printf "<h1>Template of \"${_componentName}\"</h1>\n" > $componentTemplateFile
        convertTabToSpace $componentSpecFile
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
        initComponent "$name" "$selector" "$modulePath" "$core" "$onInit" "$onDestroy" "$onChange" "$activatedRoute" "$constructor" "$createModule"
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
