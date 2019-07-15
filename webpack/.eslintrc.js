module.exports = {
    env: {
        node: true,
        es6: true,
    },

    parserOptions: {
        ecmaFeatures: {},
        ecmaVersion: 2019,
        sourceType: 'module',
    },

    plugins: ['lumapps', 'no-useless-assign', 'prettier', 'require-jsdoc-except', 'unicorn'],

    rules: {
        'accessor-pairs': [
            'error',
            {
                setWithoutGet: true,
                getWithoutSet: false,
            },
        ],
        'array-bracket-newline': ['error', 'consistent'],
        'arrow-body-style': 'off',
        'array-bracket-spacing': [
            'error',
            'never',
            {
                arraysInArrays: false,
                objectsInArrays: false,
            },
        ],
        'array-callback-return': [
            'error',
            {
                allowImplicit: false,
            },
        ],
        'array-element-newline': ['error', 'consistent'],

        'arrow-parens': [
            'error',
            'always',
            {
                requireForBlockBody: true,
            },
        ],
        'arrow-spacing': [
            'error',
            {
                after: true,
                before: true,
            },
        ],
        'block-scoped-var': 'error',
        'block-spacing': ['error', 'always'],
        'brace-style': [
            'error',
            '1tbs',
            {
                allowSingleLine: false,
            },
        ],
        'callback-return': ['off', ['callback', 'cb', 'next', 'done']],
        camelcase: [
            'error',
            {
                allow: [],
                ignoreDestructuring: false,
                properties: 'always',
            },
        ],
        'capitalized-comments': [
            'error',
            'always',
            {
                ignoreConsecutiveComments: false,
                ignoreInlineComments: false,
                ignorePattern: 'pragma|no-sentence|ignore-case|ignored|prettier-ignore|webpack',
            },
        ],
        'class-methods-use-this': [
            'error',
            {
                exceptMethods: [],
            },
        ],
        'comma-dangle': [
            'error',
            {
                arrays: 'only-multiline',
                exports: 'only-multiline',
                functions: 'only-multiline',
                imports: 'only-multiline',
                objects: 'only-multiline',
            },
        ],
        'comma-spacing': [
            'error',
            {
                after: true,
                before: false,
            },
        ],
        'comma-style': [
            'error',
            'last',
            {
                exceptions: {
                    ArrayExpression: false,
                    ArrayPattern: false,
                    ArrowFunctionExpression: false,
                    CallExpression: false,
                    FunctionDeclaration: false,
                    FunctionExpression: false,
                    ImportDeclaration: false,
                    ObjectExpression: false,
                    ObjectPattern: false,
                    VariableDeclaration: false,
                },
            },
        ],
        complexity: ['off', 20],
        'computed-property-spacing': ['error', 'never'],
        'consistent-return': [
            'error',
            {
                treatUndefinedAsUnspecified: false,
            },
        ],
        'consistent-this': ['warn', 'that', '_this', 'self', 'service', 'vm'],
        'constructor-super': 'error',
        curly: ['error', 'all'],
        'default-case': [
            'error',
            {
                commentPattern: '^No default case.$',
            },
        ],
        'dot-location': ['error', 'property'],
        'dot-notation': [
            'error',
            {
                allowKeywords: true,
                allowPattern: '^[A-Za-z0-9]+((_|-|\\.| )[A-Za-z0-9_-]+)+$',
            },
        ],
        'eol-last': ['error', 'always'],
        eqeqeq: [
            'error',
            'always',
            {
                null: 'always',
            },
        ],
        'for-direction': 'error',
        'func-call-spacing': ['error', 'never'],
        'func-name-matching': [
            'off',
            'always',
            {
                considerPropertyDescriptor: true,
                includeCommonJSModuleExports: false,
            },
        ],
        'func-names': [
            'error',
            'as-needed',
            {
                generators: 'as-needed',
            },
        ],
        'func-style': [
            'error',
            'declaration',
            {
                allowArrowFunctions: true,
            },
        ],
        'function-paren-newline': ['off', 'consistent'],
        'generator-star-spacing': [
            'error',
            {
                after: false,
                before: true,

                anonymous: {
                    after: false,
                    before: false,
                },
                method: {
                    after: false,
                    before: true,
                },
                named: {
                    after: false,
                    before: true,
                },
            },
        ],
        'getter-return': [
            'error',
            {
                allowImplicit: false,
            },
        ],
        'global-require': 'warn',
        'guard-for-in': 'error',
        'handle-callback-err': 'off',
        'id-blacklist': [
            'error',
            'callback',
            'data',
            'element',
            'er',
            'error',
            'errorCallback',
            'errCallback',
            'ev',
            'event',
            'resp',
            'tata',
            'tete',
            'titi',
            'toto',
            'tutu',
            'tyty',
        ],
        'id-length': [
            'error',
            {
                min: 2,
                max: 50,
                properties: 'always',
                exceptions: ['_', '$', 'i', 'j', 'k', 'l', 'n', 'x', 'y', 'z'],
            },
        ],
        'id-match': 'off',
        'implicit-arrow-linebreak': ['off', 'beside'],
        indent: [
            'off',
            4,
            {
                flatTernaryExpressions: false,
                ignoredNodes: [],
                ignoreComments: false,
                outerIIFEBody: 1,
                ArrayExpression: 1,
                CallExpression: {
                    arguments: 'first',
                },
                FunctionDeclaration: {
                    parameters: 'first',
                    body: 1,
                },
                ImportDeclaration: 1,
                MemberExpression: 1,
                ObjectExpression: 1,
                SwitchCase: 1,
                VariableDeclarator: {
                    const: 1,
                    let: 1,
                    var: 1,
                },
            },
        ],
        'init-declarations': [
            'off',
            'always',
            {
                ignoreForLoopInit: true,
            },
        ],
        'jsx-quotes': ['error', 'prefer-double'],
        'key-spacing': [
            'error',
            {
                beforeColon: false,
                afterColon: true,
                mode: 'strict',
            },
        ],
        'keyword-spacing': [
            'error',
            {
                before: true,
                after: true,
            },
        ],
        'line-comment-position': [
            'error',
            {
                applyDefaultPatterns: false,
                ignorePattern: '',
                position: 'above',
            },
        ],
        'linebreak-style': ['error', 'unix'],
        'lines-around-comment': [
            'off',
            {
                afterBlockComment: false,
                afterLineComment: false,
                allowArrayEnd: true,
                allowArrayStart: true,
                allowBlockEnd: true,
                allowBlockStart: true,
                allowClassEnd: true,
                allowClassStart: true,
                allowObjectEnd: true,
                allowObjectStart: true,
                applyDefaultIgnorePatterns: false,
                beforeBlockComment: true,
                ignorePattern: '',
            },
        ],
        'lines-between-class-members': [
            'error',
            'always',
            {
                exceptAfterSingleLine: false,
            },
        ],
        'max-classes-per-file': ['warn', 1],
        'max-depth': ['warn', 4],
        'max-len': [
            'error',
            120,
            {
                comments: 120,
                ignoreComments: false,
                ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\(/',
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreTrailingComments: false,
                ignoreUrls: true,
                tabWidth: 4,
            },
        ],
        'max-lines': [
            'off',
            {
                max: 600,
                skipBlankLines: true,
                skipComments: true,
            },
        ],
        'max-lines-per-function': [
            'off',
            {
                max: 100,
                skipBlankLines: true,
                skipComments: true,
                IIFEs: false,
            },
        ],
        'max-nested-callbacks': ['warn', 5],
        'max-params': ['off', 10],
        'max-statements': [
            'off',
            50,
            {
                ignoreTopLevelFunctions: true,
            },
        ],
        'max-statements-per-line': [
            'error',
            {
                max: 1,
            },
        ],
        'multiline-comment-style': ['off', 'starred-block'],
        'multiline-ternary': ['error', 'always-multiline'],
        'new-cap': [
            'error',
            {
                capIsNew: true,
                capIsNewExceptions: [],
                capIsNewExceptionPattern: '',
                newIsCap: true,
                newIsCapExceptions: [],
                newIsCapExceptionPattern: '',
                properties: false,
            },
        ],
        'new-parens': 'error',
        'newline-per-chained-call': [
            'error',
            {
                ignoreChainWithDepth: 2,
            },
        ],
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-async-promise-executor': 'error',
        'no-await-in-loop': 'error',
        'no-bitwise': [
            'error',
            {
                allow: [],
                int32Hint: false,
            },
        ],
        'no-buffer-constructor': 'error',
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-class-assign': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': ['error', 'except-parens'],
        'no-confusing-arrow': [
            'error',
            {
                allowParens: true,
            },
        ],
        'no-console': [
            'error',
            {
                allow: ['trace', 'group', 'groupEnd'],
            },
        ],
        'no-const-assign': 'error',
        'no-constant-condition': [
            'error',
            {
                checkLoops: false,
            },
        ],
        'no-continue': 'off',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-delete-var': 'error',
        'no-div-regex': 'error',
        'no-dupe-args': 'error',
        'no-dupe-class-members': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-duplicate-imports': 'off', // Handled by import/no-duplicates, see below.
        'no-else-return': [
            'error',
            {
                allowElseIf: true,
            },
        ],
        'no-empty': [
            'error',
            {
                allowEmptyCatch: false,
            },
        ],
        'no-empty-character-class': 'error',
        'no-empty-function': [
            'error',
            {
                allow: ['constructors'],
            },
        ],
        'no-empty-pattern': 'error',
        'no-eq-null': 'error',
        'no-eval': [
            'error',
            {
                allowIndirect: false,
            },
        ],
        'no-extend-native': [
            'error',
            {
                exceptions: [],
            },
        ],
        'no-ex-assign': 'error',
        'no-extra-bind': 'error',
        'no-extra-boolean-cast': 'error',
        'no-extra-label': 'error',
        'no-extra-parens': [
            'off',
            'all',
            {
                conditionalAssign: false,
                enforceForArrowConditionals: false,
                ignoreJSX: 'multi-line',
                nestedBinaryExpressions: false,
                returnAssign: false,
            },
        ],
        'no-extra-semi': 'error',
        'no-fallthrough': [
            'error',
            {
                commentPattern: 'Break[\\s\\w]*omitted.',
            },
        ],
        'no-floating-decimal': 'error',
        'no-func-assign': 'error',
        'no-global-assign': [
            'error',
            {
                exceptions: [],
            },
        ],
        'no-implicit-coercion': [
            'error',
            {
                allow: [],
                boolean: true,
                number: true,
                string: true,
            },
        ],
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-inline-comments': 'error',
        'no-inner-declarations': ['error', 'functions'],
        'no-irregular-whitespace': [
            'error',
            {
                skipComments: false,
                skipRegExps: true,
                skipStrings: false,
                skipTemplates: false,
            },
        ],
        'no-invalid-regexp': [
            'error',
            {
                allowConstructorFlags: [],
            },
        ],
        'no-invalid-this': 'off',
        'no-iterator': 'error',
        'no-labels': [
            'error',
            {
                allowLoop: true,
                allowSwitch: false,
            },
        ],
        'no-label-var': 'error',
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-loop-func': 'warn',
        'no-magic-numbers': [
            'warn',
            {
                detectObjects: true,
                enforceConst: true,
                ignore: [-1, 0, 1],
                ignoreArrayIndexes: true,
            },
        ],
        'no-misleading-character-class': 'error',
        'no-mixed-operators': [
            'off',
            {
                allowSamePrecedence: true,
            },
        ],
        'no-mixed-requires': [
            'error',
            {
                allowCall: true,
                grouping: true,
            },
        ],
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        'no-multi-assign': 'error',
        'no-multi-spaces': [
            'error',
            {
                exceptions: {
                    Property: false,
                },
                ignoreEOLComments: true,
            },
        ],
        'no-multi-str': 'error',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
                maxBOF: 0,
                maxEOF: 1,
            },
        ],
        'no-negated-condition': 'error',
        'no-nested-ternary': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-object': 'error',
        'no-new-require': 'error',
        'no-new-symbol': 'error',
        'no-new-wrappers': 'error',
        'no-obj-calls': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-param-reassign': [
            'off',
            {
                ignorePropertyModificationsFor: [],
            },
        ],
        'no-path-concat': 'off',
        'no-plusplus': [
            'off',
            {
                allowForLoopAfterthoughts: true,
            },
        ],
        'no-process-env': 'off',
        'no-process-exit': 'off',
        'no-proto': 'error',
        'no-prototype-builtins': 'off',
        'no-redeclare': [
            'error',
            {
                builtinGlobals: true,
            },
        ],
        'no-regex-spaces': 'error',
        'no-restricted-globals': ['error', 'event'],
        'no-restricted-imports': [
            'error',
            {
                paths: [],
                patterns: [],
            },
        ],
        'no-restricted-modules': [
            'error',
            {
                paths: [],
                patterns: [],
            },
        ],
        'no-restricted-properties': ['error'],
        'no-restricted-syntax': [
            'error',
            {
                selector: 'SequenceExpression',
                message: 'The comma operator is confusing and a common mistake. Don’t use it!',
            },
        ],
        'no-return-assign': ['error', 'except-parens'],
        'no-return-await': 'error',
        'no-script-url': 'error',
        'no-self-assign': [
            'error',
            {
                props: true,
            },
        ],
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow': [
            'error',
            {
                allow: ['Comment', 'Document', 'Notification', 'parent', 'Post', 'status'],
                builtinGlobals: true,
                hoist: 'all',
            },
        ],
        'no-shadow-restricted-names': 'error',
        'no-sparse-arrays': 'error',
        'no-sync': [
            'error',
            {
                allowAtRootLevel: false,
            },
        ],
        'no-template-curly-in-string': 'error',
        'no-tabs': [
            'error',
            {
                allowIndentationTabs: false,
            },
        ],
        'no-ternary': 'off',
        'no-this-before-super': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': [
            'error',
            {
                ignoreComments: false,
                skipBlankLines: false,
            },
        ],
        'no-undef': [
            'error',
            {
                typeof: true,
            },
        ],
        'no-undefined': 'off',
        'no-undef-init': 'error',
        'no-underscore-dangle': [
            'off',
            {
                allow: [],
                allowAfterSuper: true,
                allowAfterThis: true,
                enforceInMethodNames: true,
            },
        ],
        'no-unexpected-multiline': 'off',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': [
            'error',
            {
                defaultAssignment: true,
            },
        ],
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-unused-expressions': [
            'error',
            {
                allowShortCircuit: true,
                allowTaggedTemplates: true,
                allowTernary: true,
            },
        ],
        'no-unused-labels': 'error',
        'no-unused-vars': [
            'error',
            {
                args: 'after-used',
                argsIgnorePattern: '^_',
                caughtErrors: 'none',
                caughtErrorsIgnorePattern: '^unused',
                ignoreRestSiblings: false,
                vars: 'all',
                varsIgnorePattern:
                    '(^(unused|\\$?(ctrl|controller|service|svc|vm)))|((Ctrl|Controller|Service|Svc|Vm|Unused)$)',
            },
        ],
        'no-use-before-define': [
            'error',
            {
                classes: true,
                functions: true,
                variables: true,
            },
        ],
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-useless-escape': 'error',
        'no-useless-rename': [
            'error',
            {
                ignoreDestructuring: false,
                ignoreExport: false,
                ignoreImport: false,
            },
        ],
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'no-warning-comments': [
            'warn',
            {
                terms: ['todo', 'fixme', 'wtf'],
                location: 'start',
            },
        ],
        'no-whitespace-before-property': 'error',
        'no-with': 'error',
        'nonblock-statement-body-position': [
            'error',
            'below',
            {
                overrides: {},
            },
        ],
        'object-curly-newline': [
            'error',
            {
                ExportDeclaration: {
                    consistent: true,
                    multiline: true,
                },
                ImportDeclaration: {
                    consistent: true,
                    multiline: true,
                },
                ObjectExpression: {
                    consistent: true,
                    multiline: true,
                },
                ObjectPattern: {
                    consistent: true,
                    multiline: true,
                },
            },
        ],
        'object-curly-spacing': [
            'error',
            'always',
            {
                arraysInObjects: true,
                objectsInObjects: true,
            },
        ],
        'object-property-newline': [
            'error',
            {
                allowAllPropertiesOnSameLine: true,
            },
        ],
        'object-shorthand': ['error', 'always'],
        'one-var-declaration-per-line': ['error', 'initializations'],
        'one-var': [
            'error',
            {
                initialized: 'never',
                uninitialized: 'consecutive',
            },
        ],
        'operator-assignment': ['error', 'always'],
        'operator-linebreak': [
            'error',
            'after',
            {
                overrides: {
                    '?': 'before',
                    ':': 'before',
                },
            },
        ],
        'padded-blocks': [
            'error',
            {
                blocks: 'never',
                classes: 'never',
                switches: 'never',
            },
        ],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: ['cjs-import', 'directive', 'function', 'import'], next: '*' },
            {
                blankLine: 'always',
                prev: '*',
                next: ['break', 'cjs-export', 'class', 'default', 'export', 'function', 'return', 'try'],
            },
            { blankLine: 'any', prev: 'directive', next: 'directive' },
            { blankLine: 'any', prev: ['cjs-import', 'import'], next: ['cjs-import', 'import'] },
        ],
        'prefer-arrow-callback': [
            'error',
            {
                allowNamedFunctions: true,
                allowUnboundThis: true,
            },
        ],
        'prefer-const': [
            'error',
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: true,
            },
        ],
        'prefer-destructuring': [
            'error',
            {
                AssignmentExpression: {
                    array: false,
                    object: false,
                },
                VariableDeclarator: {
                    array: false,
                    object: true,
                },
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
        'prefer-numeric-literals': 'error',
        'prefer-object-spread': 'error',
        'prefer-promise-reject-errors': [
            'error',
            {
                allowEmptyReject: false,
            },
        ],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'quote-props': [
            'error',
            'as-needed',
            {
                keywords: false,
                unnecessary: true,
                numbers: true,
            },
        ],
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: false,
            },
        ],
        radix: ['error', 'always'],
        'require-atomic-updates': 'error',
        'require-await': 'error',
        'require-jsdoc': [
            'off',
            {
                require: {
                    ArrowFunctionExpression: false,
                    ClassDeclaration: true,
                    FunctionDeclaration: true,
                    FunctionExpression: false,
                    MethodDefinition: true,
                },
            },
        ],
        'require-unicode-regexp': 'off',
        'require-yield': 'error',
        'rest-spread-spacing': ['error', 'never'],
        semi: [
            'error',
            'always',
            {
                omitLastInOneLineBlock: false,
            },
        ],
        'semi-spacing': [
            'error',
            {
                after: true,
                before: false,
            },
        ],
        'semi-style': ['error', 'last'],
        'sort-imports': [
            'off',
            {
                ignoreCase: false,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            },
        ],
        'sort-keys': [
            'off',
            'asc',
            {
                caseSensitive: true,
                natural: true,
            },
        ],
        'sort-vars': [
            'error',
            {
                ignoreCase: false,
            },
        ],
        'space-before-blocks': [
            'error',
            {
                classes: 'always',
                functions: 'always',
                keywords: 'always',
            },
        ],
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                asyncArrow: 'always',
                named: 'never',
            },
        ],
        'space-in-parens': [
            'error',
            'never',
            {
                exceptions: [],
            },
        ],
        'space-unary-ops': [
            'error',
            {
                nonwords: false,
                overrides: {},
                words: true,
            },
        ],
        'space-infix-ops': [
            'error',
            {
                int32Hint: false,
            },
        ],
        'spaced-comment': [
            'error',
            'always',
            {
                line: {
                    markers: ['/'],
                    exceptions: ['-', '+', '-+', '+-', '//'],
                },
                block: {
                    balanced: true,
                    markers: ['!'],
                    exceptions: ['*'],
                },
            },
        ],
        strict: ['off', 'safe'],
        'switch-colon-spacing': [
            'error',
            {
                after: true,
                before: false,
            },
        ],
        'symbol-description': 'error',
        'template-curly-spacing': ['error', 'never'],
        'template-tag-spacing': ['error', 'never'],
        'unicode-bom': ['error', 'never'],
        'use-isnan': 'error',
        'valid-jsdoc': [
            'error',
            {
                matchDescription: '.+',
                prefer: {
                    arg: 'param',
                    desc: 'description',
                    exception: 'throws',
                    func: 'function',
                    readOnly: 'readonly',
                    returns: 'return',
                    throw: 'throws',
                },
                preferType: {
                    array: 'Array',
                    Boolean: 'boolean',
                    date: 'Date',
                    Float: 'number',
                    float: 'number',
                    function: 'Function',
                    integer: 'number',
                    Integer: 'number',
                    Number: 'number',
                    object: 'Object',
                    String: 'string',
                },
                requireParamDescription: true,
                requireParamType: true,
                requireReturn: false,
                requireReturnDescription: true,
                requireReturnType: true,
            },
        ],
        'valid-typeof': [
            'error',
            {
                requireStringLiterals: true,
            },
        ],
        'vars-on-top': 'off',
        'wrap-iife': [
            'error',
            'inside',
            {
                functionPrototypeMethods: false,
            },
        ],
        'wrap-regex': 'off',
        'yield-star-spacing': [
            'error',
            {
                after: true,
                before: false,
            },
        ],
        yoda: [
            'error',
            'never',
            {
                exceptRange: true,
                onlyEquality: false,
            },
        ],

        'no-useless-assign/no-useless-assign': 'error',

        'prettier/prettier': 'error',

        'require-jsdoc-except/require-jsdoc': [
            'error',
            {
                require: {
                    ArrowFunctionExpression: false,
                    ClassDeclaration: true,
                    FunctionDeclaration: true,
                    FunctionExpression: false,
                    MethodDefinition: true,
                },
                ignore: [
                    '/.*Component/',
                    '/.*Config/',
                    '/.*Controller/',
                    '/.*Directive/',
                    '/.*Factory/',
                    '/.*Filter/',
                    '/.*Run/',
                    '/.*Service/',
                    'compile',
                    'componentDidMount',
                    'componentDidUpdate',
                    'constructor',
                    'link',
                    'render',
                ],
            },
        ],

        'unicorn/catch-error-name': [
            'error',
            {
                name: 'exception',
            },
        ],
        'unicorn/custom-error-definition': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/explicit-length-check': 'error',
        'unicorn/filename-case': 'off',
        'unicorn/import-index': 'error',
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-abusive-eslint-disable': 'error',
        'unicorn/no-array-instanceof': 'error',
        'unicorn/no-fn-reference-in-iterator': 'off',
        'unicorn/no-hex-escape': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-process-exit': 'off',
        'unicorn/no-unsafe-regex': 'off',
        'unicorn/prefer-add-event-listener': 'error',
        'unicorn/prefer-exponentiation-operator': 'error',
        'unicorn/prefer-spread': 'error',
        'unicorn/prefer-starts-ends-with': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/number-literal-case': 'off',
        'unicorn/regex-shorthand': 'error',
        'unicorn/throw-new-error': 'error',
    },

    root: true,
};
