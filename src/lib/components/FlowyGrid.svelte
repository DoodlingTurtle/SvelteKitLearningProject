<script>
// @ts-nocheck
    import { beforeUpdate, onDestroy, onMount } from "svelte";
    import { crossfade } from "svelte/transition";
    
    /** @typedef MediaQueryString 
     * @type {String} - a mediaquery as it would be written in CSS
     */
    
    /** @typedef CssStyleString 
     * @type {String} - a style-attribute definition as it would be written to any HTML-Tag
     */

    /** @type {Object.<MediaQueryString, CssStyleString>}  */
    export let layouts = {};

    
    /**
     * @typedef ComponentListEntry
     * @property    {Object} component - the Svelte Component that will be rendered at that position in the list
     * @property    {String} style - css style given to the div container holding the component (each component is rendered inside a div container)
     * @property    {Object} props - that are passed trhough through the Component, when it is rendered
     */
  
    /** @type {Array.<ComponentListEntry>}  - contains all components, that are part of the flowing grid*/
    export let components = [];

    
    /** @type {Object} propertys that are passed to the components (overrides definitions that were made inised the "componets" definition)*/
    export let props = {};


    let mediaQueryFallback = "";    // will always be set
    const mediaQueryPrioritys = []; // defines in what order the meqia querys are checked
    const mediaQueryState = {};     // keeps track of what media-querys should be active at the moment
    const mediaQueryListeners = []; // keeps track of what listeners are registered at the wqindow

    let style = "";

    const onMedia = (ev) => {
        if(ev) {
            mediaQueryState[ev.media] = ev.matches;
        }
    
        // Redefine style
        style = `${mediaQueryFallback}; ${mediaQueryPrioritys
            .map( (q) => mediaQueryState[q] ? layouts[q] : '')
            .join('; ')
        }`

        components.forEach( (c) => c.id++ )
        components = components
    }

    onMount(() => {
        for(const l in layouts) {
            if(l == "") mediaQueryFallback = layouts[l];
            else {
                // Create Media query listener    
                const mq = window.matchMedia(l);
                
                mediaQueryPrioritys.push(l)
                mediaQueryState[l] = mq.matches;
            
                mq.addEventListener("change", onMedia);
                mediaQueryListeners.push(() => mq.removeEventListener("change", onMedia));
            }
        }

        onMedia();
    })

    onDestroy(() => {
        mediaQueryListeners.forEach( (mq) => mq() );
        mediaQueryListeners.splice(0, mediaQueryListeners.length);
        mediaQueryPrioritys.splice(0, mediaQueryPrioritys.length);
        for(const f in mediaQueryState) delete mediaQueryState[f];
    });

    let cycle = 0;
    beforeUpdate(() => {
        let cnt = 0;
        components.forEach( (c) => c.id = cycle + cnt++)
    })

    //const [ send, receive ] = crossfade({duration: d => Math.sqrt(d*1000)});
    const [send, receive] = crossfade({
        duration: 1000,
        fallback: (t, u) => `opacity: 0`
    });

    function hijackCrossFade(fnc, op) {
        return (node, args) => {
            let res =  fnc(node, args);
            node.style.opacity = op;

            return (...args) => {
                let res1 = res.apply(null, args)
                if(res1.css) {
                    const res1css = res1.css;
                    let myres1css = (...args) => {
                        
                        let cssres = res1css.apply(null, args);
                        
                        let newcss = cssres
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(e => !e.match(/^opacity/i))
                        
                        let trRule = newcss.filter( e => e.match(/^transform\:/ig) )[0].split(" ");
                        let newtrRule = trRule[0] + trRule[1] + trRule[2];
                        
                        newcss = newcss.filter(e => !e.match(/^transform\:/ig))
                        newcss.push(newtrRule + ";")

                        return newcss.join("\n");
                    }
                    res1.css = myres1css;
                }
                return res1;
            }
        }

    }

    const mySend = hijackCrossFade(send, 0);
    const myReceive = hijackCrossFade(receive, 1);


</script>

<div class="flowygrid-layout" {style}>
    {#key style}
    {#each components as component (component.id)}
    <div 
        style={component.style||""} 
        in:myReceive={{key: component.id}} out:mySend={{key: component.id}}
    >
        <svelte:component 
            this={component.component} 
            {...component.props||{}} 
            {...props} 
        />
    </div>
    {/each}
    {/key}
</div>
