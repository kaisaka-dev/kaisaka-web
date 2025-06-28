<script lang="ts">
	import Validation from '../text/Validation.svelte';

	export let label = "";
	export let id = "";
	export let required = false;
	export let msg = ""; // Error message passed from parent
	export let value = "";
	export let disabled = false;
</script>

<div class="input-container" class:no-margin={label === ''}>
	{#if label !== ""}
		<label for={id}>{label} {required ? " *" : ""}</label>
	{/if}

	<div class="input-wrapper">
		<input type="text" {id} class="input" bind:value {disabled}/>

		{#if msg}
			<Validation {msg} />
		{/if}
	</div>

</div>

<style>
	input:disabled {
			background-color:gray;
			color: lightgray;
	}
  .no-margin {
      margin: 0 !important;
  }
</style>