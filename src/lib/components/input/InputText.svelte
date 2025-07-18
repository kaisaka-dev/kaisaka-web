<script lang="ts">
	import Validation from '../text/Validation.svelte';

	// things that usually affect the component
	export let label = "";
	export let id = "";
	export let value: string | number = "";		// string for date, number for number

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
		<input {type} {id} class="input" bind:value {disabled}/>

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

</style>