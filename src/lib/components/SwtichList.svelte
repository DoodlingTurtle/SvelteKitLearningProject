<script>
    import { onMount } from "svelte";
    import { crossfade, fly } from "svelte/transition";
    import { quintOut } from 'svelte/easing';

    export let source = {};
    export let value = [];
    export let height = 16;

    let filter = "";

    $: selHighlight = { ...source };
    $: for (let a in source) selHighlight[a] = false;

    $: noneselected = (() => { 
        const lst = Object.keys(source).filter((e) => e && value.indexOf(e) == -1); 
        onFilterChange(); 
        return lst; 
    })()

    $: selected =     (() => { 
        const lst = Object.keys(source).filter((e) => e && value.indexOf(e) != -1); 
        onFilterChange(); 
        return lst; 
    })()

    const lastclickedOpt = { 'l': -1, 'r': -1 };
    let heldShift = false; 
    let visible = [];

    const onOptClick = (lst, opt, index) => {

        const lstname = lst == selected ? 'r' : 'l'

        if(heldShift) {
            let start = 0;
            let end = 0;
            let offset = 0;

            if(lastclickedOpt[lstname] < index) {
                start = lastclickedOpt[lstname];
                offset = 1;
                end = index; 
            }
            else if(lastclickedOpt[lstname]  > index) {
                start = index; 
                end = lastclickedOpt[lstname];
            }

            for(let a = start + offset; a < end + offset; a++) {
                if(visible.indexOf(lst[a]) > -1)
                    selHighlight[lst[a]] = !selHighlight[lst[a]];
            }
        }
        else selHighlight[opt] = !selHighlight[opt]

        lastclickedOpt[lstname] = index;
    }

    const onFilterChange = () => {
        visible = Object.keys(source).filter((e) => {
            const regExp = new RegExp(`${filter || ".*"}`, "gims");
            const found = regExp.exec(source[e]);
            if (!found) selHighlight[e] = false;
            return found;
        });
    }

    const l2r = () => {
        noneselected.forEach((e) => {
            if (selHighlight[e]) {
                value.push(e);
                selHighlight[e] = false;
            }
        });
        value = value;

        lastclickedOpt['l'] = -1;
        lastclickedOpt['r'] = -1;
    };

    const r2l = () => {
        selected.forEach((e) => {
            if (selHighlight[e]) {
                const index = value.indexOf(e);
                if (index > -1) {
                    value.splice(index, 1);
                    selHighlight[e] = false;
                }
            }
        });
        value = value;

        lastclickedOpt['l'] = -1;
        lastclickedOpt['r'] = -1;
    };

    let [crosssend, crossreceive] = crossfade({ fallback: fly });
    /**
    let [crosssend, crossreceive] = crossfade({ fallback(node, params) {

			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 500,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		} })

    */
    onMount(() => onFilterChange())
</script>

<svelte:window 
    on:keydown={ (ev) => { heldShift = ev.shiftKey; return true }}
    on:keyup={   (ev) => { heldShift = ev.shiftKey; return true }}
/>


<div class="mb-2 mt-2">
    <label for="filter">Filter:</label>
    <input id="filter" type="text" bind:value={filter} on:keyup={onFilterChange} />
</div>

<div class="container">
    <div class="list" style:height={height + "rem"}>
        <label for={""}>available:</label>
        {#each noneselected as opt,index (opt)}
            {#if visible.indexOf(opt) > -1}
            <button
                class="mt-2 btnClean"
                class:sel={selHighlight[opt] === true}
                on:click={ () => onOptClick(noneselected, opt, index) }
                in:crossreceive={{key: opt}}
                out:crosssend={{key: opt}}
            >
                {@html source[opt]}
            </button>
            {/if}
        {/each}
    </div>

    <div class="btnline">
        <button class="btn" on:click={l2r}>&rarr;</button>
        <button class="btn" on:click={r2l}>&larr;</button>
    </div>

    <div class="list" style:height={height + "rem"}>
        <label for={""}>assigned:</label>
        {#each selected as opt,index (opt)}
            {#if visible.indexOf(opt) > -1}
            <button
                class="mt-2 btnClean"
                class:sel={selHighlight[opt] === true}
                on:click={ () => onOptClick(selected, opt, index) }
                in:crossreceive={{key: opt}}
                out:crosssend={{key: opt}}
            >
                {@html source[opt]}
            </button>
            {/if}
        {/each}
    </div>
</div>

<style lang="scss">
    @import "../css/form.sass";

    .container {
        display: grid;
        grid-template-columns: 1fr 0fr 1fr;
        grid-gap: 0.5rem;
        align-items: center;

        .btnline {
            BUTTON {
                margin: 0.2rem;
                margin-left: 0;
                margin-right: 0;

                font-weight: bold;
            }
        }

        .list {
            display: inline-block;
            background-color: white;
            overflow-y: scroll;
            overflow-x: hidden;
            padding-block: 0.5rem;
            border-radius: var(--border-rad);

            BUTTON {
                background-color: lightgray;
                padding: var(--border-rad);
                border-radius: var(--border-rad);
                width: calc(
                    100% - var(--border-rad) - var(--border-rad) - 0.5rem
                );
                margin-inline: 0.25rem;

                &.sel {
                    background-color: var(--accent-highlight);
                    color: var(--accent-text);
                }
            }
        }
    }
    LABEL {
        font-weight: bold;
    }
</style>
