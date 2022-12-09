/*
this is a replacement for console
it will automatically diable outputs for the following function, when loaded in a production system
    - debug.log   
    - debug.warn  
    - debug.dir   
    - debug.table 

It also allows for the definition of message prefixes, to make searching the logs easyer
(see "Advanced use" further down)

    Use:

    // Simple user:
    import debug from [path to this file]

    debug.log("bal", 1, {example: "object"}, ....)
    => "bla" 1 {example: "object"}
    ... //Supports all functions, that console log does



    // Advanced use
    import DebugModule from [path to this file]

    const debug = DebugModule.prefix("Global");

    function example() {
        const _debug = debug.prefix(".example()");
        _debug.log("test withing example")
    }

    example()
    => [Global.example()] test withing example

    debug.log("test outside example") 
    => [Global] test

*/


import { dev } from "$app/environment";


let debug = Object.create({...console, _prefix: ''});

debug.prefix = function (prefix) {
    let ni = Object.create(this);
    ni._prefix = `${this._prefix}${prefix}`; 
    return ni;
}

debug.mkcall = function(args, meth) {
    if(this._prefix)
        args.unshift(`[${this._prefix}]`); 

    if(args.length)
        meth.apply(this, args);
}


debug.error = function (...args) { this.mkcall( args, console.error ) }

if(!dev) {
    // If production, disable common logging methods
    debug.log   = (...args) => {}
    debug.warn  = (...args) => {}
    debug.dir   = (...args) => {}
    debug.table = (...args) => {}
}
else {
    debug.log = function (...args) { this.mkcall( args, console.log ) }
    debug.warn = function (...args) { this.mkcall( args, console.warn ) }
    debug.dir = function (...args) { this.mkcall( args, console.dir ) }
    debug.table = function (...args) { this.mkcall( args, console.table ) }
}

export default debug; 