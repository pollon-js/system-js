/*
 * Loads text file based on extensions
 */
(function (window) {
    const systemJSPrototype = window.System.constructor.prototype
    const instantiate = systemJSPrototype.instantiate
    const shouldFetch = systemJSPrototype.shouldFetch


    systemJSPrototype.preventAutoExtensionIfIn = []

    const moduleTypesRegEx = /\.(jpt|juice|txt)$/
    systemJSPrototype.shouldFetch = function (url) {
        const path = url.split('?')[0].split('#')[0]
        const ext = path.slice(path.lastIndexOf('.'))
        let match = ext.match(moduleTypesRegEx)
        if (match) {
            return match
        }

        if( systemJSPrototype.preventAutoExtensionIfIn.includes(ext) ){
            return true
        }

        return shouldFetch(url)
    }

    systemJSPrototype.instantiate = function (url, parent) {
        var that = this
        if (this.shouldFetch(url)) {
            return this.fetch(url,{}).then(function (res) {
                if (!res.ok) {
                    throw Error(res.status + ' ' + res.statusText + ', loading ' + url + (parent ? ' from ' + parent : ''))
                }
                const path = url.split('?')[0].split('#')[0]
                const ext = path.slice(path.lastIndexOf('.'))

                let custom = systemJSPrototype.preventAutoExtensionIfIn.includes(ext)

                if( ext.match(moduleTypesRegEx) || custom ){
                    return res.text().then(function (source) {
                        if (['.json', '.css', '.wasm'].includes(ext)) {
                            return instantiate.apply(that, [url, parent])
                        }

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
})(typeof self !== 'undefined' ? self : window)
