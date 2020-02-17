export class SystemjsLoader{
    constructor(){

    }

    resolveURI( uri ){
        if( uri === undefined || uri === null ){
            return null
        }
        return uri
    }

    resolveTextURI( uri ){
        uri = this.resolveURI(uri)
        return uri
    }

    resolvePluginURI( ID, uri ){
        uri = this.resolveURI(uri)
        if( uri === null ){
            return ID
        }
        
        return uri + ID    
    }

    load( uri ){
        return System.import(uri)
            .then( module =>{
                return module
            })
    }

    loadPlugins( uris ){
        return Promise.all(uris.map( uri =>{
            uri = this.resolveURI(uri)
            return System.import(uri)
                .then( module =>{
                    return module[Object.keys(module)[0]]
                })
        }))
    }

    loadText( uri ){
        uri = this.resolveTextURI(uri)
        return System.import(uri).then( module => module.default )
    }

    loadModule( scope, moduleID ){
        let base = scope.baseUrl || ''

        return System.import(base + moduleID)
            .then( module =>{
                return module[Object.keys(module)[0]]
            })
    }
}