<h1 bind:this={container}><slot></slot></h1>

<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    
    export let scrollListener = "";
    export let alternateContainer = "";

    /** @type {HTMLElement | null} */
    let altContainer = null;

    export let onChange = (/**@type {boolean}*/ state) => {};
    
    const on = createEventDispatcher();

    /** @type {string | undefined} */
    let oldScrollListener = undefined;

    function removeOldListener() {
        if(oldScrollListener && oldScrollListener.trim() != "") {
            const cont = document.querySelector(oldScrollListener);
            if(cont)
                cont.removeEventListener("scroll", onScroll);
        }
    }

    function addNewListener() {
        if(scrollListener && scrollListener.trim() != "") {
            const cont = document.querySelector(scrollListener);
            if(cont)
                cont.addEventListener("scroll", onScroll);
        }
    }

    /** @type {HTMLElement | null} */ 
    let container = null;
    
    /** @type {boolean | undefined}*/
    let shouldState = undefined;

    /** @type {boolean | undefined}*/
    let isState = undefined;
    
    const onScroll = () => {
        if(container) {
            shouldState = container.getBoundingClientRect().y >= 32;
        
            if(shouldState != isState) {
                isState = shouldState;

                onChange(shouldState);
                on("change", shouldState);

                if(altContainer) {
                    if(shouldState) altContainer.innerHTML = "";
                    else { altContainer.innerHTML = container.innerHTML };
                }
            }
        }
    }

    onMount(() => { addNewListener(); onScroll() 
    
        if(alternateContainer) {
            altContainer = document.querySelector(alternateContainer);
        }
    
    })
    onDestroy(() => { removeOldListener(); })
    
</script>