/*
 * Loads text file based on extensions
 */
(function (global) {

    const systemJSPrototype = global.System
    systemJSPrototype.defaultJSExtension = systemJSPrototype.defaultJSExtension || 'js'
    const instantiate = systemJSPrototype.instantiate

    systemJSPrototype.instantiate = function (url, parent) {

        if (!this.shouldFetch(url)) {
            let path = url.split('?')[0].split('#')[0]
            let ext = path.split('.')
            ext = ext.pop()
            if (systemJSPrototype.defaultJSExtension != ext) {
                url += '.' + systemJSPrototype.defaultJSExtension
                return instantiate.call(this, url, parent)
            }
        }

        return instantiate.apply(this, arguments)
    }

})(typeof self !== 'undefined' ? self : global)
