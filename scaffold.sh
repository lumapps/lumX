#!/bin/bash
# This script is used to scaffold new modules, components, services, ...

LOG="./scaffold.log"
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
npm run -s scaffold -- [--debug] [-h|--help] [--force] [-n|--name <name>] [-p|--path <path>|\"default\"] [--at-root|--not-at-root] [-t|--type <type>] [--core|--not-core] [--router|--no-router] [--external-routes|--inline-routes] [--import-core|--not-import-core]  [-s|--selector <selector>|\"default\"] [--with-module|--without-module] [--on-init|--no-on-init] [--on-destroy|--no-on-destroy] [--on-change|--no-on-change] [--activated-route|--no-activated-route] [--constructor|--no-constructor]

${UNDERLINE}${BLUE}Common options${DEFAULT}:
\t${CYAN}--debug${DEFAULT}\t\t\t\t\tDebug this scaffold script
\t${CYAN}-h, --help${DEFAULT}\t\t\t\tPrint this help message.
\t${CYAN}--force${DEFAULT}\t\t\t\t\tDon't ask confirmation for overwritting directory or files.
\t${CYAN}-n, --name ${YELLOW}<name>${DEFAULT}\t\t\tThe name of the element you want to scaffold.
\t${CYAN}-p, --path ${YELLOW}<path>|\"default\"${DEFAULT}\t\tThe path (from 'src/client/app/') for the scaffolded element (if \"default\", will be at the root of 'src/client/app/').
\t${CYAN}--[not-]at-root${DEFAULT}\t\t\t\tIndicates if we want to create the element at the root of the given path or in a subdirectory (whose name will be the selector of the element).
\t${CYAN}-t, --type ${YELLOW}<type>${DEFAULT}\t\t\tThe type of element you want to scaffold. Allowed types are: 'Module', 'Component'
\t${CYAN}--[not-]core${DEFAULT}\t\t\t\tIndicates if it's a core element that's beeing scaffolded or not.

${UNDERLINE}${BLUE}Modules options${DEFAULT}:
\t${CYAN}--[no-]router${DEFAULT}\t\t\t\tIndicates if we want to import the Router module in the scaffolded module or not.
\t${CYAN}--<external|inline>-routes${DEFAULT}\t\t\t\tIndicates if we want to scaffold a routes files beside of the scaffolded module or not or inline routes in the scaffolded module.
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
            printfl "${DEFAULT} ${RED}while ${1}"
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

function menuWithDefault() {
    if [ -n "${!2}" ]; then
        return 0
    fi

    if [ -n "$1" ] && [ -n "$2" ]; then
        defaultVarName="default${2^}"

        optionsName="$3[@]"
        options=("${!optionsName}")

        printfl "${YELLOW}${1}?${DEFAULT}\n"
        log "Pick an option -> " false
        PS3="Pick an option -> "

        select inputValue in "${options[@]}"; do
            if [ -n "$inputValue" ]; then
                eval $2=`echo -ne \""${inputValue}"\"`
            else
                eval $2=`echo -ne \""${!defaultVarName}"\"`
            fi

            break
        done

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

        log "${YELLOW}${1}?${DEFAULT} ${choices} " false

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
defaultRoutes="n"
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

        -h|--help)
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

        --external-routes)
            routes="y"
            ;;

        --inline-routes)
            routes="n"
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


printf "${BOLD}Welcome to the ${BLUE}LumX²${DEFAULT}${BOLD} scaffolder!${DEFAULT}\n"

if [ -z "$scaffoldType" ]; then
    printfl "We will ask you some question to help you scaffold a new element in the project. Ready?\n\n"
else
    printfl "We will ask you some question to help you scaffold a new ${scaffoldType} in the project. Ready?\n\n"
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
        readBooleanWithDefault "Do you want to add the \"${name}\" ${coreMessage}${scaffoldType} at the root of 'src/client/app/${displayedModulePath}' (if not, it will be added in a '${selector}' subdirectory)" "atRoot"
    fi

    readBooleanWithDefault "Do you want to declare routes in the \"${name}\" ${coreMessage}${scaffoldType}" "router"
    if [ "$router" == "y" ] && [ "$core" == "n" ]; then
        readBooleanWithDefault "Do you want to scaffold a routes file with \"${name}\" ${coreMessage}${scaffoldType} (if not, routes will be inlined)" "routes"
    fi
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
        if [ "$router" == "y" ] && [ "$core" == 'n' ]; then
            readBooleanWithDefault "Do you want to scaffold a routes file with ${thing} (if not, routes will be inlined)" "routes"
        fi
        readBooleanWithDefault "Do you want to import the core module in the ${thing}" "importCore"
    fi

    readBooleanWithDefault "Do you want to use the 'ngOnInit' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onInit"
    readBooleanWithDefault "Do you want to use the 'ngOnDestroy' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onDestroy"
    readBooleanWithDefault "Do you want to use the 'ngOnChange' hook in \"${name}\" ${coreMessage}${scaffoldType}" "onChange"

    if [ "$createModule" == "y" ] && [ "$router" == "y" ]; then
        defaultActivatedRoute="y"
    fi
    readBooleanWithDefault "Do you want to access route params in \"${name}\" ${coreMessage}${scaffoldType}" "activatedRoute"

    if [ "$activatedRoute" == "y" ]; then
        constructor="y"
    fi
    readBooleanWithDefault "Do you want a constructor in \"${name}\" ${coreMessage}${scaffoldType}" "constructor"
fi

if [ "$atRoot" == "y" ]; then
    modulePath="${modulePath}/@root@"
fi
modulePath="${modulePath%/}"


printfl """
We are now ready to scaffold your ${BOLD}${coreMessage}${scaffoldType}${DEFAULT}. Please wait...

"""

function initModule() {
    _moduleName="${1^}"
    _selector="${2,,}"
    _modulePath="${3%/}"
    [[ "$4" == "y" ]] && _isCoreModule=true || _isCoreModule=false
    [[ "$5" == "y" ]] && _useRouter=true || _useRouter=false
    [[ "$6" == "y" ]] && _generateRoutes=true || _generateRoutes=false
    [[ "$7" == "y" ]] && _importCore=true || _importCore=false
    [[ "$8" == "y" ]] && _forComponent=true || _forComponent=false

    if [ "$_useRouter" = false ]; then
        _generateRoutes=false
    fi

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

        printfl "Creating module directory \"${directory}\"... "
        if [ ! -d $directory ]; then
            mkdir -p $directory
            exitIfError "Creating module \"${directory}\" directory"
        fi
        printfl "${BLUE}Done${DEFAULT}\n"
    fi

    cd $directory
    moduleFile="${_selector}.module.ts"
    routesFile="${_selector}.routes.ts"

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

    if [ "$_generateRoutes" == "y" ]; then
        defaultCreateRoutesFile="y"
        createRoutesFile="y"
        if [ -f $routesFile ] && [ "$force" == "n" ]; then
            readBooleanWithDefault "The routes file \"${directory}${routesFile}\" already exists. Are you sure you want to continue (the file will be overwritten)" "createRoutesFile"
        fi

        if [ "$createRoutesFile" == "y" ]; then
            rm -Rf $routesFile
            exitIfError "Deleting existing \"${directory}/${routesFile}\" file"
        else
            return 0
        fi
    fi

    printfl "Creating files and directories... "
        if [ "$_isCoreModule" = false ] && [ "$_forComponent" = false ] && [ ! -d "components" ]; then
            mkdir -p "components"
            exitIfError "Creating \"${directory}/components\" directory"
        fi

        touch $moduleFile
        if [ "$_generateRoutes" == "y" ]; then
            touch $routesFile
        fi
        exitIfError "Creating \"${directory}/${moduleFile}\" file"
    printfl "${BLUE}Done${DEFAULT}\n"

    root="."
    subPath=""
    if [ "$_forComponent" = true ]; then
        if [ "$_isCoreModule" = true ]; then
            root=".."
            subPath="components/${_selector}/"
        fi
    fi
    className=$(echo -e "${_moduleName}" | sed -r 's/(^| )([A-Za-z0-9])/\U\2/g' | tr -d '[[:space:]]\n\r-' | tr -dc '[:alnum:]\n\r')

    routes="""/**
 * The routes for the \"${_moduleName}\" module.
 *
 * @type {Routes}
 * @readonly
 * @constant
 * @default
 */
const routes: Routes = ["""
    if [ "$_forComponent" = true ]; then
        routes="""${routes}
    {
        component: ${className}Component,
        path: '${_selector}',
    }
    // Add any other routes you will need for this module.
"""
    else
        routes="""${routes}
    // Add any routes you will need for this module. For example:
    // { component: MyComponent, path: 'my-component' };
"""
    fi
    routes="""${routes}
    // You can also lazy-load some routes. For example:
    // { loadChildren: 'my-component/my.module#MyModule', path: 'lazy' };
];
"""

    printfl "Creating TypeScript module... "
        moduleWithProvidersImport=""
        if [ "$_isCoreModule" = true ]; then
            moduleWithProvidersImport="ModuleWithProviders, "
        fi
        printf -- "import { ${moduleWithProvidersImport}NgModule } from '@angular/core';" > $moduleFile

        if [ "$_useRouter" = true ]; then
            routesImport=""
            if [ "$_generateRoutes" = false ]; then
                routesImport=", Routes"
            fi
            printf -- "\nimport { RouterModule${routesImport} } from '@angular/router';" >> $moduleFile
        fi
        printf -- """
// If you need anything else from Angular, import it here. For example:
// import { Response } from '@angular/http';

// If you need any other lib, import it here. For example:
// import 'rxjs/add/operator/map';
""" >> $moduleFile

        if [ "$_importCore" = true ]; then
            printf -- """
import { CoreModule } from 'core/modules/core.module';
// If you need anything else from the core, import it here. For example:""" >> $moduleFile
        else
            printf -- """
// If you need anything from the core, import it here. For example:""" >> $moduleFile
        fi

        printf -- """
// import { MyService } from 'core/services/my.service';
""" >> $moduleFile

        if [ "$_generateRoutes" = true ]; then
            printf -- "import { routes } from './${_selector}.routes';\n" >> $moduleFile
        fi

        if [ "$_forComponent" = true ]; then
            printf -- "import { ${className}Component } from '${root}/${subPath}${_selector}.component';\n" >> $moduleFile
        fi

        printf -- """
// If you need anything else, import it here. For example:
// import { MyModule } from 'my-component/my.module';
// import { MyComponent } from 'my-component/my.component';

""" >> $moduleFile

        if [ "$_useRouter" = true ] && [ "$_generateRoutes" = false ]; then
            printf -- "$routes" >> $moduleFile
        fi

        printf -- """
/**
 * The \"${_moduleName}\" module.
 * [Module description].
 */
@NgModule({
    declarations: [""" >> $moduleFile
                if [ "$_forComponent" = true ]; then
                    printf -- """
        ${className}Component,
        // If this module has anything else to declare, add it here.""" >> $moduleFile
                else
                    printf -- """
        // If this module has anything to declare, add it here. For example:
        // MyComponent,""" >> $moduleFile
                fi
            printf -- """
    ],

    exports: [""" >> $moduleFile
                elseString=""
                if [ "$_importCore" = true ]; then
                    elseString=" else"
                    printf -- """
        CoreModule,""" >> $moduleFile
                fi
                if [ "$_forComponent" = true ]; then
                    elseString=" else"
                    printf -- """
        ${className}Component,""" >> $moduleFile
                fi
                if [ "$_useRouter" = true ]; then
                    elseString=" else"
                    printf -- """
        RouterModule,""" >> $moduleFile
                fi
            printf -- """
        // If you need to export anything${elseString}, add it here. For example:
        // MyModule,
    ],

    imports: [""" >> $moduleFile
                elseString=""
                if [ "$_importCore" = true ]; then
                    elseString=" else"
                    printf -- """
        CoreModule,""" >> $moduleFile
                fi
                if [ "$_useRouter" = true ]; then
                    elseString=" else"
                    printf -- """
        RouterModule.forChild(routes),""" >> $moduleFile
                fi
            printf -- """
        // If you need to import anything${elseString}, add it here. For example:
        // MyModule,
    ],

    providers: [
        // If this module has any provider, add it here. For example:
        // MyService,
    ],
})
export class ${className}Module {""" >> $moduleFile
        if [ "$_useRouter" = true ]; then
            printf -- """
    /**
     * The routes of the \"${_moduleName}\" module.
     *
     * @type {Array[Object]}
     * @public
     * @static
     */
    public static routes: Routes = routes;
""" >> $moduleFile
        fi

        if [ "$_isCoreModule" = true ]; then
            printf -- """
    /**
     * Export the module for the app's root module.
     *
     * @return {ModuleWithProviders} The modules with the providers that can be used for the app's root module.
     * @public
     * @static
     * @todo If you don't need to export any providers to the root module, you can delete this.
     */
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ${className}Module,

            providers: [
                // Add any providers you need to export to the root module. For example:
                // MyService,
            ],
        };
    }""" >> $moduleFile
        fi

        printf -- """
}
""" >> $moduleFile

        convertTabToSpace $moduleFile

    printfl "${BLUE}Done${DEFAULT}\n"

    if [ "$_generateRoutes" = true ]; then
        printfl "Creating TypeScript routes... "
            printf -- "import { Routes } from '@angular/router';\n" > $routesFile

            if [ "$_forComponent" = true ]; then
                printf -- "import { ${className}Component } from '${root}/${subPath}${_selector}.component';\n" >> $routesFile
            fi

            printf -- """
// If you need any other component, import it here. For example:
// import { MyComponent } from 'my-component/my.component';


${routes}
    """ >> $routesFile

            convertTabToSpace $routesFile
        printfl "${BLUE}Done${DEFAULT}\n"
    fi

    cd - &>> $LOG
}

function initComponent() {
    _componentName="${1^}"
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

    printfl "Creating component directory '${directory}'... "
    if [ ! -d $directory ]; then
        mkdir -p $directory
        exitIfError "Creating \"${directory}\" directory"
    fi
    printfl "${BLUE}Done${DEFAULT}\n"

    cd $directory
    componentFile="${_selector}.component.ts"
    componentSpecFile="${_selector}.component.spec.ts"
    componentTemplateFile="${_selector}.component.html"
    componentStyleFile="${_selector}.component.scss"
    printfl "Creating files... "
        touch $componentFile
        exitIfError "Creating \"${directory}/${componentFile}\" file"
        touch $componentSpecFile
        exitIfError "Creating \"${directory}/${componentSpecFile}\" file"
        touch $componentTemplateFile
        exitIfError "Creating \"${directory}/${componentTemplateFile}\" file"
        touch $componentStyleFile
        exitIfError "Creating \"${directory}/${componentStyleFile}\" file"
    printfl "${BLUE}Done${DEFAULT}\n"

    printfl "Creating TypeScript component... "
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
        printf -- "import { ${imports} } from '@angular/core';" > $componentFile
        if [ "$_hasActivatedRoute" = true ]; then
            printf -- "\nimport { ActivatedRoute } from '@angular/router';" >> $componentFile
        fi
        printf -- """
// If you need anything else from Angular, import it here. For example:
// import { Response } from '@angular/http';

// If you need any other lib, import it here. For example:
// import 'rxjs/add/operator/map';

import { ${className^^}_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

// If you need anything else from the core, import it here. For example:
// import { MyService } from 'core/services/my.service';

// If you need anything else, import it here. For example:
// import { MyModule } from 'my-component/my.module';
// import { MyComponent } from 'my-component/my.component';


/*
 * Global styles.
 */
// import 'core/styles/example.scss';


/**
 * \"${_componentName}\" component.
 * [Component description].
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['./${_selector}.component.scss'],
    templateUrl: './${_selector}.component.html',
})
""" >> $componentFile

        if [ -n "$implements" ]; then
            implements="implements ${implements} "
        fi
        printf -- "export class ${className}Component ${implements}{" >> $componentFile

        printf -- """
    /**
     * Add any attributes you need here.
     * First private ones, then protected and finally public.
     * In each visibility declare statics first, then constants and finally variables.
     * Remember to use alphabetical order.
     * Don't forget to add complete JSDocs for each attributes.
     */

""" >> $componentFile

        if [ "$_generateConstructor" = true ]; then
            params=""
            printf -- """
    /**
     * Constructs a new \"${_componentName}\" component.""" >> $componentFile
            if [ "$_hasActivatedRoute" = true ]; then
                params="public route: ActivatedRoute"
                printf -- """
     *
     * @param {ActivatedRoute} route The activated route.""" >> $componentFile
            fi
            printf -- """

     * @todo You can add any parameter you need for this constructor.
     * @todo You can even declare components attributes directly from the constructor by adding visibility before the
     *       parameter name.
     * @todo Write \"${_componentName}\" component constructor.
     */
    constructor(${params}) {
        // TODO: write constructor's code here.
    }
""" >> $componentFile
        fi

        printf -- """
    /**
     * Add any method you will need.""" >> $componentFile
        if [ "$_generateOnChange" = true ] || [ "$_generateOnDestroy" = true ] || [ "$_generateOnInit" = true ]; then
            printf -- """
     * First private ones, then protected.""" >> $componentFile
        else
            printf -- """
     * First private ones, then protected and finally public.""" >> $componentFile
        fi
        printf -- """
     * In each visibility declare statics first.
     * Remember to use alphabetical order.
     * Don't forget to add complete JSDocs for each method.
     */
""" >> $componentFile

        if [ "$_generateOnChange" = true ]; then
            printf -- """
    /**
     * Called when any InputProperty of the component has changed.
     *
     * @param {Object} changes The changes that occured.
     * @todo Write \"${_componentName}\" component 'ngOnChange' lifecycle hook.
     */
    public ngOnChange(changes: { [propertyName: string]: SimpleChange }): void {
        // TODO: write ngOnChange's code here.
    }
""" >> $componentFile
        fi

        if [ "$_generateOnDestroy" = true ]; then
            printf -- """
    /**
     * Called when the component is destroyed.
     *
     * @todo Write \"${_componentName}\" component 'ngOnDestroy' lifecycle hook.
     */
    public ngOnDestroy(): void {
        // TODO: write ngOnDestroy's code here.
    }
""" >> $componentFile
        fi

        if [ "$_generateOnInit" = true ]; then
            printf -- """
    /**
     * Called when the component is initialized.
     *
     * @todo Write \"${_componentName}\" component 'ngOnInit' lifecycle hook.
     */
    public ngOnInit(): void {
    \t// TODO: write ngOnInit's code here.
    }
""" >> $componentFile
        fi

        if [ "$_generateOnChange" = true ] || [ "$_generateOnDestroy" = true ] || [ "$_generateOnInit" = true ]; then
            printf -- """
    /**
     * Add any public method you will need.
     * Declare statics first.
     * Remember to use alphabetical order.
     * Don't forget to add complete JSDocs for each method.
     */
""" >> $componentFile
        fi

        printf -- "}\n" >> $componentFile

        convertTabToSpace $componentFile
    printfl "${BLUE}Done${DEFAULT}\n"

    printfl "Creating component's unit tests... "
        printf -- """/* tslint:disable:no-unused-expression */

// You can also import for exemple: async', 'fakeAsync', 'tick', ...
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';
// If you need anything from Sinon, import it here. For example:
// import { SinonSandbox, sandbox } from 'sinon';

// If you need to import any service or other, import it here.

// If you need another specific module (core module, ...), import it here.

import { ${className}Component } from './${_selector}.component';""" > $componentSpecFile
        if [ "$_hasGeneratedModule" = true ]; then
            printf -- "\nimport { ${className}Module } from './${_selector}.module';" >> $componentSpecFile
        fi

        printf -- """

// If you need anything else, import it here.

describe('${_componentName}', () => {
    // If you want to have Sinon's spies, stubs, mocks or fake servers, use a sandbox.
    // let sandboxEnv: SinonSandbox;

    // If you want to get any service.
    // let myService: MyService;

    let component: ${className}Component;
    let fixture: ComponentFixture<${className}Component>;


    // If you want to setup a fake server.
    /*
    function setupFakeBackend(): void {
        sandboxEnv.useFakeServer();
        sandboxEnv.server.respondWith(...);
        sandboxEnv.server.autoRespond = true;
        sandboxEnv.server.respondImmediately = true;
    }
    */


    beforeEach(() => {
        // Setup the sandbox environment and the fake backend if you need.
        // sandboxEnv = sandbox.create();
        // setupFakeBackend();

        TestBed.configureTestingModule({""" >> $componentSpecFile
        if [ "$_hasGeneratedModule" = true ]; then
            printf -- """
            declarations: [
                // If you want to test a component, add it here. For example:
                // MyComponent,
            ],
""" >> $componentSpecFile
        else
            printf -- """
            declarations: [
                ${className}Component,
                // If your module have anything else to declare, add it here.
            ],
""" >> $componentSpecFile
        fi

            printf -- """
            imports: [""" >> $componentSpecFile

            if [ "$_hasGeneratedModule" = true ]; then
                printf -- """
                ${className}Module,""" >> $componentSpecFile
            else
                printf -- """
                // If you need to import anything for your tests, add it here. For example:
                // MyModule,""" >> $componentSpecFile
            fi

            printf -- """
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                // If you need any other provider for your tests, add it here. For example:
                // MyService,
                // You can also declare services doubles (stub, mockup, ...) here:
                // { provide: MyService, useValue: myServiceStub },
                // You can even add component so that they can be injected in your test functions.
            ],
        });


        fixture = TestBed.createComponent(${className}Component);
        component = fixture.componentInstance;

        // If you want to use any service, remember to get it from either the root injector:
        // myService = TestBed.get(MyService);
        // Or the component injector:
        // myService = fixture.debugElement.injector.get(MyService);

        // You can also declare spies here:
        // sandboxEnv.spy(myService, 'myMethod');

        // This is not required here as 'ComponentFixtureAutoDetect' is enabled.
        // However, it's always good to be explicit.
        // Also, remember to call 'fixture.detectChanges();' anytime you want to update the component state.
        fixture.detectChanges();
    });

    // For more info on how to test in Angular2, see https://angular.io/docs/ts/latest/guide/testing.html.
    it('should have a test written here', () => {
        // If you have defined spies, you can check them:;
        // expect(myService.myMethod).to.not.have.been.called;

        // You can simulate the passage of time:
        // tick();

        // If you have defined spies, you can check them again:;
        // expect(myService.myMethod).to.have.been.calledOnce;

        expect(component).to.exist;
    });


    afterEach(() => {
        // Remove all spies, stubs, mocks and fake servers.
        // sandboxEnv.restore();
    });
});
""" >> $componentSpecFile

        convertTabToSpace $componentSpecFile
    printfl "${BLUE}Done${DEFAULT}\n"

    printfl "Creating component's template... "
        printf -- """<h1 class=\"title\">
    Template of \"${_componentName}\" component.
</h1>
""" > $componentTemplateFile

        convertTabToSpace $componentSpecFile
    printfl "${BLUE}Done${DEFAULT}\n"

    printfl "Creating component's styles... "
        printf -- """.title {
    font-size: 40px;
}
""" > $componentStyleFile

        convertTabToSpace $componentStyleFile
    printfl "${BLUE}Done${DEFAULT}\n"

    cd - &>> $LOG

    selectorDefinition="export const ${className^^}_SELECTOR: string = '${_selector}';"
    isAlreadyInSelector=$(cat $SELECTORS_FILE | grep "${selectorDefinition}" | wc -l)
    if [ -w $SELECTORS_FILE ] && [ $isAlreadyInSelector -eq 0 ]; then
        printfl "Adding selector... "
            printf -- """
/**
 * The selector name of the \"${_componentName}\" component.
 *
 * @type {string}
 * @readonly
 * @constant
 * @default
 */
${selectorDefinition}
""" >> $SELECTORS_FILE
            exitIfError "Adding selector to the selectors file"
        printfl "${BLUE}Done${DEFAULT}\n"
    fi
}

case "${scaffoldType}" in
    "module")
        initModule "$name" "$selector" "$modulePath" "$core" "$router" "$routes" "$importCore"
        exitIfError "Scaffolding the module"
        ;;

    "component")
        if [ "$createModule" == "y" ]; then
            initModule "$name" "$selector" "$modulePath" "$core" "$router" "$routes" "$importCore" "y"
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


printfl "\n"
printfl "${GREEN}Your ${scaffoldType} has been successfully initialized!${DEFAULT}\n\n"

printfl "${BOLD}${MAGENTA}Have a good one!${DEFAULT}\n"

exit 0
