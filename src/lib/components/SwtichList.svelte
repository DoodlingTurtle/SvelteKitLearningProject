<script>

    import { flip } from "svelte/animate";
    import { fly } from 'svelte/transition';

    export let source = {};
    export let value = [];
    export let height = 16;

    let filter = "";

    $: selHighlight = { ...source };
    $: for (let a in source) selHighlight[a] = false;

    $: noneselected = Object.keys(source).filter((e) => value.indexOf(e) == -1);
    $: selected = Object.keys(source).filter((e) => value.indexOf(e) != -1);

    $: visible = Object.keys(source);

    $: if (filter || source)
        visible = Object.keys(source).filter((e) => {
            const regExp = new RegExp(`${filter || ".*"}`, "gims");
            const found = regExp.exec(source[e]);

            if (!found) selHighlight[e] = false;

            return found;
        });

    const l2r = () => {
        noneselected.forEach((e) => {
            if (selHighlight[e]) {
                value.push(e);
                selHighlight[e] = false;
            }
        });
        value = value;
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
    };
</script>

<div class="mb-2 mt-2">
    <label for="filter">Filter:</label>
    <input id="filter" type="text" bind:value={filter} />
</div>

<div class="container">
    <div class="list" style:height={height + "rem"}>
        <label for={""}>available:</label>
        {#each noneselected as opt (opt)}
            <button
                style:display={visible.indexOf(opt) > -1 ? 'block' : 'none'}
                class="mt-2 btnClean"
                class:sel={selHighlight[opt] === true}
                on:click={() => (selHighlight[opt] = !selHighlight[opt])}
                animate:flip
                transition:fly
            >
                {@html source[opt]}
            </button>
        {/each}
    </div>

    <div class="btnline">
        <button class="btn" on:click={l2r}>&rarr;</button>
        <button class="btn" on:click={r2l}>&larr;</button>
    </div>

    <div class="list" style:height={height + "rem"}>
        <label for={""}>assigned:</label>
        {#each selected as opt (opt)}
            <button
                style:display={visible.indexOf(opt) > -1 ? 'block' : 'none'}
                class="mt-2 btnClean"
                class:sel={selHighlight[opt] === true}
                on:click={() => (selHighlight[opt] = !selHighlight[opt])}
                animate:flip
                transition:fly
            >
                {@html source[opt]}
            </button>
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
