<script lang="ts">
	import Validation from '../text/Validation.svelte';

	export let label = "";
	export let id = "";
	export let required = false;
	export let msg = ""; // Error message passed from parent
	export let value = "";
	export let disabled = false;
</script>

<div class="input-container">
	<label for={id}>{label} {required ? " *" : ""}</label>

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
</style>