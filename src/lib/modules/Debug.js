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

const replace_fnc = {
    'log': true, 
    'warn': true, 
    'error': true, 
    'info': true, 
    'group': true,
}

function nop(...args) {}

function newProxy(_prefix) {

    return {
        get: function (target, prop) {
            switch (prop) {
                case '_prefix': return _prefix;

                case 'prefix': return this[prop];

                default:       
                    if(!dev && prop != 'error') 
                        return nop;
                    
                    if(replace_fnc[prop]) 
                        return (...args) => {
                            if(_prefix)
                                args.unshift(`[${_prefix}]`); 

                                if(args.length)
                                    target[prop].apply(target, args);
                        }
                    
                    return target[prop]
            }
        },

        prefix: (p) => new Proxy(console, newProxy(_prefix + p)),
    }
}



export const DebugModule = new Proxy(console, newProxy(''));

export default DebugModule;
