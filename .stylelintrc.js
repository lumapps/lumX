module.exports = {
    extends: ['stylelint-config-recommended', 'stylelint-config-recommended-scss', 'stylelint-config-idiomatic-order'],
    rules: {
        indentation: 4,
        'at-rule-empty-line-before': [
            'always',
            {
                except: ['blockless-after-same-name-blockless', 'first-nested'],
                ignore: ['after-comment'],
                ignoreAtRules: ['else'],
            },
        ],
        'block-closing-brace-newline-after': [
            'always',
            {
                ignoreAtRules: ['if', 'else'],
            },
        ],
    },
};
