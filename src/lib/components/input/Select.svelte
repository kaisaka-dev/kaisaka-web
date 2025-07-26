<script lang="ts">
	import Validation from '../text/Validation.svelte';
	export let label = "";
	export let id = "";
	export let options: ({ id: string | number; name: string; } | string)[] = []; 	// Array of dropdown options
	export let required = false;
	export let disabled = false;
	export let msg = ""; 										// Validation message
	export let value: string | number | null = null; // Declare selected as a reactive variable
	export let margin = true;								// false if no margin, true if the default margin
</script>

<div class="input-container" class:no-margin={label === '' || !margin}>
	{#if label}
		<label for={id}>{label} {required ? " *" : ""}</label>
	{/if}

	<div class="input-wrapper">
		<select id={id} class="input" bind:value={value} {disabled}>
			{#if !required && typeof options[0] === 'string'}
				<option value="" selected></option> <!-- Default option, null selection only available if NOT required -->
			{:else if !required}
				<option value={null} selected></option> <!-- Default option, null selection only available if NOT required -->
			{/if}
			{#each options as option}
				{#if typeof option === 'string'}
					<option value={option}>{option}</option>
				{:else}
					<option value={option.id}>{option.name}</option>
				{/if}
			{/each}
			
		</select>

		<Validation msg={msg} />
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