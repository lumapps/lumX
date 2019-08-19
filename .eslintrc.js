module.exports = {
    env: {
        amd: true,
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        jquery: true,
        node: true,
        serviceworker: true,
        'shared-node-browser': true,
        worker: true,
    },

    globals: {
        angular: false,
    },

    parser: 'babel-eslint',

    parserOptions: {
        allowImportExportEverywhere: false,
        codeFrame: true,
        ecmaFeatures: {
            globalReturn: false,
            impliedStrict: true,
            jsx: true,
            legacyDecorators: false,
        },
        ecmaVersion: 2019,
        sourceType: 'module',
    },

    plugins: [
        'html',
        'import',
        'lumapps',
        'no-useless-assign',
        'prettier',
        'require-jsdoc-except',
        'unicorn',
        'you-dont-need-lodash-underscore',
        'jsx-a11y',
        'react',
    ],

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
                allow: [
                    'count',
                    'countReset',
                    'error',
                    'group',
                    'groupEnd',
                    'info',
                    'time',
                    'timeEnd',
                    'timeLog',
                    'timeStamp',
                    'trace',
                    'warn',
                ],
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
                    array: true,
                    object: true,
                },
                VariableDeclarator: {
                    array: true,
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
        strict: ['error', 'safe'],
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

        'import/default': 'error',
        'import/dynamic-import-chunkname': 'warn',
        'import/export': 'error',
        'import/exports-last': 'error',
        'import/extensions': [
            'error',
            'never',
            {
                css: 'always',
                json: 'always',
                scss: 'always',
            },
        ],
        'import/first': 'error',
        'import/group-exports': 'error',
        'import/max-dependencies': [
            'warn',
            {
                max: 30,
            },
        ],
        'import/named': 'off',
        'import/namespace': 'error',
        'import/newline-after-import': [
            'error',
            {
                count: 1,
            },
        ],
        'import/no-absolute-path': [
            'error',
            {
                amd: true,
                commonjs: true,
                esmodule: true,
            },
        ],
        'import/no-amd': 'error',
        'import/no-anonymous-default-export': [
            'error',
            {
                allowAnonymousClass: false,
                allowAnonymousFunction: false,
                allowArray: false,
                allowArrowFunction: true,
                allowCallExpression: false,
                allowLiteral: false,
                allowObject: false,
            },
        ],
        'import/no-commonjs': [
            'error',
            {
                allowPrimitiveModules: false,
                allowRequire: false,
            },
        ],
        'import/no-cycle': ['error'],
        'import/no-deprecated': 'error',
        'import/no-duplicates': 'error',
        'import/no-dynamic-require': 'warn',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['**/*.test.jsx', '**/*.spec.js'],
                optionalDependencies: false,
                peerDependencies: true,
            },
        ],
        'import/no-internal-modules': 'off',
        'import/no-mutable-exports': 'error',
        'import/no-named-as-default-member': 'error',
        'import/no-named-as-default': 'error',
        'import/no-named-default': 'error',
        'import/no-named-export': 'off',
        'import/no-namespace': 'off',
        'import/no-nodejs-modules': [
            'error',
            {
                allow: [],
            },
        ],
        'import/no-relative-parent-imports': 'off',
        'import/no-restricted-paths': ['error'],
        'import/no-self-import': 'error',
        'import/no-unassigned-import': [
            'error',
            {
                allow: ['*.css', '**/*.scss'],
            },
        ],
        'import/no-unresolved': [
            'off',
            {
                amd: true,
                caseSensitive: true,
                commonjs: true,
            },
        ],
        'import/no-useless-path-segments': 'error',
        'import/no-webpack-loader-syntax': 'warn',
        'import/order': [
            'error',
            {
                groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                'newlines-between': 'always-and-inside-groups',
            },
        ],
        'import/prefer-default-export': 'off',
        'import/unambiguous': 'error',

        'lumapps/angular-foreach': ['off', 'always'],
        'lumapps/max-params': [
            'warn',
            {
                ignoreAngularDI: true,
                maximum: 10,
            },
        ],
        'lumapps/comments-sentences': [
            'error',
            {
                ignorePattern: '(^( *)?(pragma|no-sentence|prettier-ignore))|;\\s*$',
                ignoreInlineComments: true,
            },
        ],
        'lumapps/file-format': ['off'],
        'lumapps/jsdoc-format': 'error',
        'lumapps/ternary-condition-parens': ['error', 'never'],
        'lumapps/angular-isdefined': ['off', 'always'],

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
        'you-dont-need-lodash-underscore/all': 'error',
        'you-dont-need-lodash-underscore/any': 'error',
        'you-dont-need-lodash-underscore/assign': 'error',
        'you-dont-need-lodash-underscore/bind': 'error',
        'you-dont-need-lodash-underscore/collect': 'error',
        'you-dont-need-lodash-underscore/concat': 'error',
        'you-dont-need-lodash-underscore/contains': 'error',
        'you-dont-need-lodash-underscore/detect': 'error',
        'you-dont-need-lodash-underscore/each': 'error',
        'you-dont-need-lodash-underscore/entries': 'error',
        'you-dont-need-lodash-underscore/every': 'error',
        'you-dont-need-lodash-underscore/extend-own': 'error',
        'you-dont-need-lodash-underscore/fill': 'error',
        'you-dont-need-lodash-underscore/filter': 'error',
        'you-dont-need-lodash-underscore/find': 'error',
        'you-dont-need-lodash-underscore/find-index': 'error',
        'you-dont-need-lodash-underscore/first': 'error',
        'you-dont-need-lodash-underscore/foldl': 'error',
        'you-dont-need-lodash-underscore/foldr': 'error',
        'you-dont-need-lodash-underscore/for-each': 'error',
        'you-dont-need-lodash-underscore/includes': 'error',
        'you-dont-need-lodash-underscore/index-of': 'error',
        'you-dont-need-lodash-underscore/inject': 'error',
        'you-dont-need-lodash-underscore/is-array': 'error',
        'you-dont-need-lodash-underscore/is-nan': 'error',
        'you-dont-need-lodash-underscore/join': 'error',
        'you-dont-need-lodash-underscore/keys': 'error',
        'you-dont-need-lodash-underscore/last': 'error',
        'you-dont-need-lodash-underscore/last-index-of': 'error',
        'you-dont-need-lodash-underscore/map': 'error',
        'you-dont-need-lodash-underscore/pairs': 'error',
        'you-dont-need-lodash-underscore/reduce': 'error',
        'you-dont-need-lodash-underscore/reduce-right': 'error',
        'you-dont-need-lodash-underscore/repeat': 'error',
        'you-dont-need-lodash-underscore/replace': 'error',
        'you-dont-need-lodash-underscore/reverse': 'error',
        'you-dont-need-lodash-underscore/select': 'error',
        'you-dont-need-lodash-underscore/size': 'error',
        'you-dont-need-lodash-underscore/slice': 'error',
        'you-dont-need-lodash-underscore/some': 'error',
        'you-dont-need-lodash-underscore/to-lower': 'error',
        'you-dont-need-lodash-underscore/to-pairs': 'error',
        'you-dont-need-lodash-underscore/to-upper': 'error',
        'you-dont-need-lodash-underscore/trim': 'error',
        'you-dont-need-lodash-underscore/uniq': 'error',
        'you-dont-need-lodash-underscore/values': 'error',
    },

    overrides: [
        {
            files: ['*.jsx'],
            rules: {
                'jsx-a11y/accessible-emoji': 'error',
                'jsx-a11y/alt-text': [
                    'error',
                    {
                        elements: ['img', 'object', 'area', 'input[type="image"]'],

                        area: ['Area'],
                        img: ['Image', 'Picture', 'Photo'],
                        'input[type="image"]': [
                            'InputImage',
                            'ImageInput',
                            'InputPicture',
                            'PictureInput',
                            'InputPhoto',
                            'PhotoInput',
                        ],
                        object: ['Object'],
                    },
                ],
                'jsx-a11y/anchor-has-content': [
                    'error',
                    {
                        components: ['Anchor'],
                    },
                ],
                'jsx-a11y/anchor-is-valid': [
                    'error',
                    {
                        aspects: ['noHref', 'invalidHref', 'preferButton'],
                        components: ['Link'],
                        specialLink: [],
                    },
                ],
                'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
                'jsx-a11y/aria-props': 'error',
                'jsx-a11y/aria-proptypes': 'error',
                'jsx-a11y/aria-role': [
                    'error',
                    {
                        ignoreNonDOM: true,
                    },
                ],
                'jsx-a11y/aria-unsupported-elements': [
                    'error',
                    {
                        components: ['Heading'],
                    },
                ],
                'jsx-a11y/click-events-have-key-events': 'error',
                'jsx-a11y/heading-has-content': 'error',
                'jsx-a11y/html-has-lang': 'error',
                'jsx-a11y/iframe-has-title': 'error',
                'jsx-a11y/img-redundant-alt': [
                    'error',
                    {
                        components: ['Image', 'Picture', 'Photo'],
                        words: [],
                    },
                ],
                'jsx-a11y/interactive-supports-focus': 'error',
                'jsx-a11y/label-has-associated-control': [
                    'error',
                    {
                        controlComponents: ['Input'],
                        depth: 2,
                        labelAttributes: ['label', 'inputLabel', 'fieldLabel'],
                        labelComponents: ['Label'],
                    },
                ],
                'jsx-a11y/lang': 'error',
                'jsx-a11y/media-has-caption': [
                    'error',
                    {
                        audio: ['Audio', 'Sound', 'Music'],
                        video: ['Video', 'Movie', 'Film'],
                        track: ['Track'],
                    },
                ],
                'jsx-a11y/mouse-events-have-key-events': 'error',
                'jsx-a11y/no-access-key': 'error',
                'jsx-a11y/no-autofocus': [
                    'error',
                    {
                        ignoreNonDOM: true,
                    },
                ],
                'jsx-a11y/no-distracting-elements': 'error',
                'jsx-a11y/no-interactive-element-to-noninteractive-role': [
                    'error',
                    {
                        tr: ['none', 'presentation'],
                    },
                ],
                'jsx-a11y/no-noninteractive-element-interactions': [
                    'error',
                    {
                        handlers: ['onClick', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onMouseDown', 'onMouseUp'],
                    },
                ],
                'jsx-a11y/no-noninteractive-element-to-interactive-role': [
                    'error',
                    {
                        li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
                        ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
                        table: ['grid'],
                        td: ['gridcell'],
                        ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
                    },
                ],
                'jsx-a11y/no-noninteractive-tabindex': [
                    'error',
                    {
                        roles: ['tabpanel'],
                        tags: [],
                    },
                ],
                'jsx-a11y/no-onchange': 'error',
                'jsx-a11y/no-redundant-roles': 'error',
                'jsx-a11y/no-static-element-interactions': [
                    'error',
                    {
                        handlers: ['onClick', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onMouseDown', 'onMouseUp'],
                    },
                ],
                'jsx-a11y/role-has-required-aria-props': 'error',
                'jsx-a11y/role-supports-aria-props': 'error',
                'jsx-a11y/scope': 'error',
                'jsx-a11y/tabindex-no-positive': 'error',

                'react/boolean-prop-naming': [
                    'error',
                    {
                        message: 'Boolean property `{{ propName }}` should begin with "is", "has" or "can"',
                        propTypeNames: ['bool'],
                        rule: '^(is|has|can)[A-Z]([A-Za-z0-9]?)+',
                    },
                ],
                'react/button-has-type': [
                    'off',
                    {
                        button: true,
                        reset: true,
                        submit: true,
                    },
                ],
                'react/default-props-match-prop-types': [
                    'error',
                    {
                        allowRequiredDefaults: true,
                    },
                ],
                'react/destructuring-assignment': [
                    'error',
                    'always',
                    {
                        ignoreClassFields: true,
                    },
                ],
                'react/display-name': [
                    'warn',
                    {
                        ignoreTranspilerName: false,
                    },
                ],
                'react/forbid-component-props': 'off',
                'react/forbid-dom-props': [
                    'error',
                    {
                        forbid: [],
                    },
                ],
                'react/forbid-elements': [
                    'error',
                    {
                        forbid: [],
                    },
                ],
                'react/forbid-foreign-prop-types': 'error',
                'react/forbid-prop-types': [
                    'error',
                    {
                        checkChildContextTypes: true,
                        checkContextTypes: true,
                        forbid: ['any', 'array', 'object'],
                    },
                ],
                'react/jsx-boolean-value': [
                    'error',
                    'never',
                    {
                        always: [],
                    },
                ],
                'react/jsx-child-element-spacing': 'error',
                'react/jsx-closing-bracket-location': [
                    'error',
                    {
                        nonEmpty: 'line-aligned',
                        selfClosing: 'line-aligned',
                    },
                ],
                'react/jsx-closing-tag-location': 'error',
                'react/jsx-curly-brace-presence': [
                    'error',
                    {
                        children: 'never',
                        props: 'never',
                    },
                ],
                'react/jsx-curly-spacing': [
                    'off',
                    'never',
                    {
                        allowMultiline: true,
                        spacing: { objectLiterals: 'always' },
                    },
                ],
                'react/jsx-equals-spacing': ['error', 'never'],
                'react/jsx-filename-extension': [
                    'error',
                    {
                        extensions: ['.jsx'],
                    },
                ],
                'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
                'react/jsx-fragments': ['error', 'element'],
                'react/jsx-handler-names': [
                    'off',
                    {
                        eventHandlerPrefix: 'handle',
                        eventHandlerPropPrefix: 'on',
                    },
                ],
                'react/jsx-indent-props': ['error', 4],
                'react/jsx-indent': [
                    'error',
                    4,
                    {
                        checkAttributes: false,
                    },
                ],
                'react/jsx-key': 'error',
                'react/jsx-max-depth': [
                    'warn',
                    {
                        max: 5,
                    },
                ],
                'react/jsx-max-props-per-line': [
                    'error',
                    {
                        maximum: 1,
                        when: 'multiline',
                    },
                ],
                'react/jsx-no-bind': [
                    'error',
                    {
                        allowArrowFunctions: false,
                        allowBind: false,
                        allowFunctions: false,
                        ignoreDOMComponents: false,
                        ignoreRefs: true,
                    },
                ],
                'react/jsx-no-comment-textnodes': 'error',
                'react/jsx-no-duplicate-props': [
                    'error',
                    {
                        ignoreCase: false,
                    },
                ],
                'react/jsx-no-literals': 'off',
                'react/jsx-no-target-blank': [
                    'error',
                    {
                        enforceDynamicLinks: 'always',
                    },
                ],
                'react/jsx-no-undef': [
                    'error',
                    {
                        allowGlobals: true,
                    },
                ],
                'react/jsx-one-expression-per-line': [
                    'warn',
                    {
                        allow: 'single-child',
                    },
                ],
                'react/jsx-pascal-case': [
                    'error',
                    {
                        allowAllCaps: false,
                        ignore: [],
                    },
                ],
                'react/jsx-props-no-multi-spaces': 'error',
                'react/jsx-sort-default-props': [
                    'error',
                    {
                        ignoreCase: false,
                    },
                ],
                'react/jsx-sort-props': [
                    'error',
                    {
                        callbacksLast: true,
                        ignoreCase: false,
                        noSortAlphabetically: false,
                        reservedFirst: true,
                        shorthandFirst: true,
                        shorthandLast: false,
                    },
                ],
                'react/jsx-tag-spacing': [
                    'error',
                    {
                        afterOpening: 'never',
                        beforeClosing: 'never',
                        beforeSelfClosing: 'always',
                        closingSlash: 'never',
                    },
                ],
                'react/jsx-uses-react': 'error',
                'react/jsx-uses-vars': 'error',
                'react/jsx-wrap-multilines': [
                    'error',
                    {
                        declaration: 'parens-new-line',
                        assignment: 'parens-new-line',
                        return: 'parens-new-line',
                        arrow: 'parens-new-line',
                        condition: 'parens-new-line',
                        logical: 'parens-new-line',
                        prop: 'parens-new-line',
                    },
                ],
                'react/no-access-state-in-setstate': 'error',
                'react/no-array-index-key': 'warn',
                'react/no-children-prop': 'error',
                'react/no-danger-with-children': 'error',
                'react/no-danger': 'warn',
                'react/no-deprecated': 'error',
                'react/no-did-mount-set-state': 'error',
                'react/no-did-update-set-state': 'error',
                'react/no-direct-mutation-state': 'error',
                'react/no-find-dom-node': 'error',
                'react/no-is-mounted': 'error',
                'react/no-multi-comp': [
                    'warn',
                    {
                        ignoreStateless: false,
                    },
                ],
                'react/no-redundant-should-component-update': 'error',
                'react/no-render-return-value': 'error',
                'react/no-set-state': 'off',
                'react/no-string-refs': 'error',
                'react/no-this-in-sfc': 'error',
                'react/no-typos': 'error',
                'react/no-unescaped-entities': [
                    'error',
                    {
                        forbid: ['>', '"', "'", '}'],
                    },
                ],
                'react/no-unknown-property': [
                    'error',
                    {
                        ignore: [],
                    },
                ],
                'react/no-unsafe': [
                    'error',
                    {
                        checkAliases: true,
                    },
                ],
                'react/no-unused-prop-types': 'error',
                'react/no-unused-state': 'error',
                'react/no-will-update-set-state': 'error',
                'react/prefer-es6-class': ['error', 'always'],
                'react/prefer-stateless-function': [
                    'error',
                    {
                        ignorePureComponents: false,
                    },
                ],
                'react/prop-types': [
                    'error',
                    {
                        customValidators: [],
                        ignore: [],
                        skipUndeclared: true,
                    },
                ],
                'react/react-in-jsx-scope': 'error',
                'react/require-default-props': [
                    'error',
                    {
                        forbidDefaultForRequired: true,
                    },
                ],
                'react/require-optimization': [
                    'off',
                    {
                        allowDecorators: [],
                    },
                ],
                'react/require-render-return': 'error',
                'react/self-closing-comp': [
                    'error',
                    {
                        component: true,
                        html: false,
                    },
                ],
                'react/sort-comp': [
                    'error',
                    {
                        groups: {
                            lifecycle: [
                                'displayName',
                                'propTypes',
                                'contextTypes',
                                'childContextTypes',
                                'mixins',
                                'statics',
                                'defaultProps',
                                'constructor',
                                'getDefaultProps',
                                'state',
                                'getInitialState',
                                'getChildContext',
                                'getDerivedStateFromProps',
                                'componentWillMount',
                                'UNSAFE_componentWillMount',
                                'componentDidMount',
                                'componentWillReceiveProps',
                                'UNSAFE_componentWillReceiveProps',
                                'shouldComponentUpdate',
                                'componentWillUpdate',
                                'UNSAFE_componentWillUpdate',
                                'getSnapshotBeforeUpdate',
                                'componentDidUpdate',
                                'componentDidCatch',
                                'componentWillUnmount',
                            ],
                        },
                        order: ['static-methods', 'lifecycle', '/^on.+$/', 'everything-else', 'render'],
                    },
                ],
                'react/sort-prop-types': [
                    'error',
                    {
                        callbacksLast: false,
                        ignoreCase: false,
                        noSortAlphabetically: false,
                        sortShapeProp: true,
                    },
                ],
                'react/style-prop-object': 'error',
                'react/void-dom-elements-no-children': 'error',
            },
        },
        {
            files: ['jest/**'],
            rules: {
                'import/no-commonjs': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/unambiguous': 'off',
            },
        },
    ],

    root: true,

    settings: {
        html: {
            'html-extensions': ['.htm', '.html', '.uhtml'],
            indent: '+4',
            'report-bad-indent': 'error',
            'xml-extensions': ['.xhtm', '.xhtml', '.xuhtml', 'xml'],
        },
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/ignore': ['node_modules', '.(s(a|c)ss|less|css)$'],
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            webpack: {
                config: 'webpack/webpack.config.js',
            },
        },
        react: {
            createClass: 'createReactClass',
            pragma: 'React',
            version: 'detect',
        },
    },
};
