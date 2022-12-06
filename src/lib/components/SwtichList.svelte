<script>
    export let source = { };
    export let value = [];

    $: selHighlight = { ...source };
    $: for(let a in source) selHighlight[a] = false;

    $: noneselected = Object.keys(source).filter( (e) => value.indexOf(e) == -1 )
    $: selected     = Object.keys(source).filter( (e) => value.indexOf(e) != -1 )
</script>


<div class="container">
    <div class="list">
        {#each noneselected as opt (opt)}
            <button  class="mb-2 btnClean" class:sel={selHighlight[opt] === true} on:click={() => selHighlight[opt] = !selHighlight[opt]} > {@html source[opt]} </button>
        {/each}
    </div>

    <div>
        <button>&rarr;</button>
        <button>&larr;</button>
    </div>

    <div class="list">
        {#each selected as opt (opt)}
            <button class="mb-2 btnClean" class:sel={selHighlight[opt] === true} on:click={() => selHighlight[opt] = !selHighlight[opt]} > {@html source[opt]} </button>
        {/each}
    </div>
</div>

<style lang="scss">

    .container {
        display: grid;
        grid-template-columns: 1fr 0fr 1fr;
        grid-gap: .5rem;

        .list {
            display: inline-block;

            BUTTON {
                background-color: var(--app-c-white);
                padding: var(--border-rad);
                border-radius: var(--border-rad);
                width: calc(100% - var(--border-rad) - var(--border-rad));

                &.sel {
                    background-color: var(--accent-highlight);
                    color: var(--accent-text);
                }
            }

        }

    } 
</style>
