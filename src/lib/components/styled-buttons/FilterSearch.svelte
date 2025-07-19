<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">

    /**
     * an array of object, where object is a row of data. to be filtered and then returned to parent
     */
    export let searchedValue: string

    let showModal = false;

    function filter() {
        showModal = !showModal;
    }

</script>

<div class="flex flex-col">
    <div style="display:flex; flex-direction: row;">
        <div style="display: flex; flex-direction: row; background-color: lightgray; border-radius: 5px;
        width: fit-content;">

            <button onclick={filter}>Filter</button>

            <input
              type="text"
              id="search"
              class="input"
              bind:value={searchedValue}
              style="height: auto; width: 30rem;"
            />
            <i class="fa fa-search" style="color: var(--background); margin-top: 1rem; margin-right: 1rem"></i>

        </div>
        <div  class="!ml-[1rem]">
            <slot name="button-list" />
        </div>
    </div>

    {#if showModal}
        <div style="height: fit-content; width: fit-content; box-shadow: 0 4px 4px rgba(0,0,0,0.2); border-radius:16px; padding: 1.8rem; ">
            <slot name="modal" />
        </div>
    {/if}
</div>

<style>
    input:focus {
        outline: none;
        box-shadow: none;
    }
</style>