<script lang="ts">
	import Validation from '../text/Validation.svelte';
	export let label = "";
	export let id = "";
	export let options: string[] = []; // Array of dropdown options
	export let required = false;
	export let msg = ""; // Validation message

	export let value = ""; // Declare selected as a reactive variable
</script>

<div class="input-container">
	<label for={id}>{label} {required ? " *" : ""}</label>

	<div class="input-wrapper">
		<select id={id} class="input" bind:value={value}>
			<option value="" disabled selected></option> <!-- Default option -->
			{#each options as option}
				<option value={option}>{option}</option>
			{/each}
		</select>

		{#if required && value === ""}
			<Validation msg={msg} />
		{/if}
	</div>

</div>

<style>
	option {
      color:darkgray; font-size:var(--small-text)
	}
</style>