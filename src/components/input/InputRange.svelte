<script lang="ts">
	import Validation from '../text/Validation.svelte';

	// things that usually affect the component
	export let label = "";
	export let id = "";
	export let valueFrom: string | number = "";		// string for date, number for number
	export let valueTo: string | number = "";		// string for date, number for number

	// other extra things to customize the input
	export let type = "text";			// can also be: date, number
	export let required = false;
	export let msg = ""; 					// error message passed from parent
	export let disabled = false;
	export let margin = true;			// false if no margin, true if the default margin
</script>

<div class="input-container" class:no-margin={label === '' || !margin}>
	{#if label !== ""}
		<label for={id}>{label} {required ? " *" : ""}</label>
	{/if}

	<div class="input-wrapper">
		<div style="justify-content: space-between; flex-direction: row; display:flex;">
			<input class="input !w-[180px]" {type} id="{id}-from"  bind:value={valueFrom} {disabled}>
			<span class="my-[6px] text-align:center"> to</span>
			<input class="input !w-[180px] !mr-0" {type} id="{id}-to"  bind:value={valueTo} {disabled}>
		</div>

		{#if msg}
			<Validation {msg} />
		{/if}
	</div>

</div>


<style>
    input:disabled {
        background-color:gray;
        font-weight: bold;
        color: white;
    }
    input[type="number"] {
        padding-right: 15px;
    }
		input[type="date"]::-webkit-calendar-picker-indicator {
				font-size: 0.9rem;
		}

</style>