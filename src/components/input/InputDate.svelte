<script lang="ts">
	import Validation from '../text/Validation.svelte';

	export let label = "Date";
	export let id = "date";
	export let required = false;
	export let msg = "";
	export let value: string | number = "";		// string for date, number for year
	export let type = "date"; // for the type of date input
</script>

<div class="input-container">
	<label for={id}>{label} {required ? " *" : ""}</label>

	<div class="input-wrapper">
		<input type={type} id={id} class="input" bind:value={value} />

		{#if msg}
			<Validation msg={msg} />
		{/if}
	</div>
</div>