const RE_ENDS_WITH_BS = /\/$/;


function HtmlElementsPlugin(locations) {
    this.locations = locations;
}

/**
 * Create an HTML tag with attributes from a map.
 *
 * Example:
 * createTag('link', { rel: "manifest", href: "/assets/manifest.json" })
 * // <link rel="manifest" href="/assets/manifest.json">
 *
 * @param  {string}              tagName    The name of the tag
 * @param  {Map{string=>string}} attrMap    A Map of attribute names (keys) and their values.
 * @param  {string}              publicPath A path to add to the beginning of static asset URLs
 * @return {string}                         The newly created tag
 */
function createTag(tagName, attrMap, publicPath) {
    publicPath = publicPath || '';

    // add trailing slash if we have a publicPath and it doesn't have one.
    if (publicPath && !RE_ENDS_WITH_BS.test(publicPath)) {
        publicPath += '/';
    }

    const attributes = Object.getOwnPropertyNames(attrMap)
        .filter(function filterAttrs(attrName) {
            return attrName[0] !== '=';
        })
        .map(function forEachAttrs(attrName) {
            var value = attrMap[attrName];

            if (publicPath) {
                // check if we have explicit instruction, use it if so (e.g: =herf: false)
                // if no instruction, use public path if it's href attribute.
                const usePublicPath = (attrMap.hasOwnProperty('=' + attrName)) ? !attrMap['=' + attrName] :
                                                                                 attrName === 'href';

                if (usePublicPath) {
                    // remove a starting trailing slash if the value has one so we wont have //
                    value = publicPath + (value[0] === '/' ? value.substr(1) : value);
                }
            }

            return attrName + '="' + value + '"';
        });

    return '<' + tagName + ' ' + attributes.join(' ') + '>';
}

/**
 * Returns a string representing all html elements defined in a data source.
 *
 * Example:
 *    const ds = {
 *      link: [
 *        { rel: "apple-touch-icon", sizes: "57x57", href: "/assets/icon/apple-icon-57x57.png" }
 *      ],
 *      meta: [
 *        { name: "msapplication-TileColor", content: "#00bcd4" }
 *      ]
 *    }
 * getHeadTags(ds);
 * // "<link rel="apple-touch-icon" sizes="57x57" href="/assets/icon/apple-icon-57x57.png">"
 *    "<meta name="msapplication-TileColor" content="#00bcd4">"
 *
 * @param  {Object} dataSource The data source
 * @param  {string} publicPath A path to add to the beginning of static asset URLs
 * @return {string} The string representing the HTML Element
 */
function getHtmlElementString(dataSource, publicPath) {
    return Object.getOwnPropertyNames(dataSource)
        .map(function forEachDataSource(dataSourceName) {
            if (Array.isArray(dataSource[dataSourceName])) {
                return dataSource[dataSourceName].map(function forEachDataSourceName(attrs) {
                    return createTag(dataSourceName, attrs, publicPath);
                });
            }

            return [createTag(dataSourceName, dataSource[dataSourceName], publicPath)];
        })
        .reduce(function reduce(arr, curr) {
            return arr.concat(curr);
        }, [])
        .join('\n\t');
}


HtmlElementsPlugin.prototype.apply = function htmlElementsPlugin(compiler) {
    var _this = this;
    compiler.plugin('compilation', function compilationFunction(compilation) {
        compilation.options.htmlElements = compilation.options.htmlElements || {};

        compilation.plugin('html-webpack-plugin-before-html-generation', function generationFunction(htmlPluginData,
                                                                                                     callback) {
            const locations = _this.locations;

            if (locations) {
                const publicPath = htmlPluginData.assets.publicPath;

                Object.getOwnPropertyNames(locations).forEach(function forEachLocations(loc) {
                    compilation.options.htmlElements[loc] = getHtmlElementString(locations[loc], publicPath);
                });
            }


            callback(null, htmlPluginData);
        });
    });
};


// Export our class
module.exports = HtmlElementsPlugin;
