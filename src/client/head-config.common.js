/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: 'msapplication-TileImage', content: '/assets/icon/ms-icon-144x144.png', '=content': true },
 * Will prefix the publicPath to content.
 *
 * { rel: 'apple-touch-icon', sizes: '57x57', href: '/assets/icon/apple-icon-57x57.png', '=href': false },
 * Will not prefix the publicPath on href (href attributes are added by default
 *
 */
module.exports = {
    link: [
        /** <link> tags for 'apple-touch-icon' (AKA Web Clips). **/
        {
            href: '/assets/icon/apple-icon-57x57.png',
            rel: 'apple-touch-icon',
            sizes: '57x57',
        }, {
            href: '/assets/icon/apple-icon-60x60.png',
            rel: 'apple-touch-icon',
            sizes: '60x60',
        }, {
            href: '/assets/icon/apple-icon-72x72.png',
            rel: 'apple-touch-icon',
            sizes: '72x72',
        }, {
            href: '/assets/icon/apple-icon-76x76.png',
            rel: 'apple-touch-icon',
            sizes: '76x76',
        }, {
            href: '/assets/icon/apple-icon-114x114.png',
            rel: 'apple-touch-icon',
            sizes: '114x114',
        }, {
            href: '/assets/icon/apple-icon-120x120.png',
            rel: 'apple-touch-icon',
            sizes: '120x120',
        }, {
            href: '/assets/icon/apple-icon-144x144.png',
            rel: 'apple-touch-icon',
            sizes: '144x144',
        }, {
            href: '/assets/icon/apple-icon-152x152.png',
            rel: 'apple-touch-icon',
            sizes: '152x152',
        }, {
            href: '/assets/icon/apple-icon-180x180.png',
            rel: 'apple-touch-icon',
            sizes: '180x180',
        },

        /** <link> tags for android web app icons **/
        {
            href: '/assets/icon/android-icon-192x192.png',
            rel: 'icon',
            sizes: '192x192',
            type: 'image/png',
        },

        /** <link> tags for favicons **/
        {
            href: '/assets/icon/favicon-32x32.png',
            rel: 'icon',
            sizes: '32x32',
            type: 'image/png',
        }, {
            href: '/assets/icon/favicon-96x96.png',
            rel: 'icon',
            sizes: '96x96',
            type: 'image/png',
        }, {
            href: '/assets/icon/favicon-16x16.png',
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
        },

        /** <link> tags for a Web App Manifest **/
        {
            href: '/assets/manifest.json',
            rel: 'manifest',
        },
    ],

    meta: [
        {
            content: '#00bcd4',
            name: 'msapplication-TileColor',
        }, {
            '=content': true,
            'content': '/assets/icon/ms-icon-144x144.png',
            'name': 'msapplication-TileImage',
        }, {
            content: '#00bcd4',
            name: 'theme-color',
        },
    ],
};
