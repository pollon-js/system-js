/*
 * Loads text file based on extensions
 */
(function (global) {
    const systemJSPrototype = global.System.constructor.prototype
    const instantiate = systemJSPrototype.instantiate
    const shouldFetch = systemJSPrototype.shouldFetch

    const moduleTypesRegEx = /\.(jpt|juice|txt)$/
    systemJSPrototype.shouldFetch = function (url) {
        const path = url.split('?')[0].split('#')[0]
        const ext = path.slice(path.lastIndexOf('.'))
        let match = ext.match(moduleTypesRegEx)
        if (match) {
            return match
        }
        return shouldFetch(url)
    }

    systemJSPrototype.instantiate = function (url, parent) {
        if (this.shouldFetch(url)) {
            return this.fetch(url).then(function (res) {
                if (!res.ok) {
                    throw Error(res.status + ' ' + res.statusText + ', loading ' + url + (parent ? ' from ' + parent : ''))
                }
                const path = url.split('?')[0].split('#')[0]
                const ext = path.slice(path.lastIndexOf('.'))

                if (ext.match(moduleTypesRegEx)) {
                    return res.text().then(function (source) {
                        return [[], function (_export) {
                            return {
                                execute: function () { _export('default', source) }
                            }
                        }]
                    })
                }
            })
        }
        return instantiate.apply(this, arguments)
    }
})(typeof self !== 'undefined' ? self : global)
