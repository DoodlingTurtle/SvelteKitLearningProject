<script>
    import { createEventDispatcher } from 'svelte';

    export let edit  = false;

    export let value = "";
    export let id = "";
    export let style = "";
    export let className = "";
    export let name = "";
    export let placeholder = "";

    export let valueFormat = (val) => val; 

    const on = createEventDispatcher();


</script>

<span {style} class={className}>
    <div class="main-input" class:edit={edit}>
        <input 
            type="text"
            bind:value={value}

            on:focus={(ev) => on("blur", ev)} 
            on:blur={(ev) => on("blur", ev)} 
            on:keydown={(ev) => on("keydown", ev)} 
            on:keyup={(ev) => on("keyup", ev)} 
            
            {id} {name} {placeholder} />
        <span  area-hidden=true class:placeholder={!value}>{value ? valueFormat(value) : (placeholder || ' ') }</span>
    </div>
</span>

<style lang="scss">

    :root {
        --inline-padding: .5em;
        --block-padding: 0.125em;
    }

    SPAN.placeholder {
        color: gray;
    }

    .main-input {

        display: inline-block;
        position: relative;
        padding-block: var(--block-padding);

        * {
            box-sizing: border-box;
            padding-inline: var(--inline-padding);
        }

        SPAN {
            min-width: 10ch;
            font-size: 1em;
        }

        INPUT {
            position: absolute;
            display: none;
            left: 0px;
            top: calc(var(--block-padding) * -1);
            width: 100%;
            font-size: 1.01em;

            padding-inline-start: var(--inline-padding);
            padding-block: var(--block-padding);
        }

        &.edit  {
            SPAN {
                visibility: hidden;
            }

            INPUT {
                display: block;
            }
        }
    }

</style>