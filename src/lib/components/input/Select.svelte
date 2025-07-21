<script lang="ts">
	import Validation from '../text/Validation.svelte';
	export let label = "";
	export let id = "";
	export let options: ({ label: string; value: string | number } | string)[] = []; 	// Array of dropdown options
	export let required = false;
	export let disabled = false;
	export let msg = ""; 										// Validation message
	export let value: string | number = ""; // Declare selected as a reactive variable
	export let margin = true;								// false if no margin, true if the default margin
	export let event = ""
</script>

<div class="input-container" class:no-margin={label === '' || !margin}>
	<label for={id}>{label} {required ? " *" : ""}</label>

	<div class="input-wrapper">
		<select id={id} class="input" bind:value={value} {disabled}>
			{#if !required}
				<option value="" disabled={required} selected></option> <!-- Default option -->
			{/if}
			{#each options as option}
				{#if typeof option === 'string'}
					<option value={option}>{option}</option>
				{:else}
					<option value={option.value}>{option.label}</option>
				{/if}
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
  select:disabled {
      background-color:gray;
      font-weight: bold;
      color: white;
  }
</style>