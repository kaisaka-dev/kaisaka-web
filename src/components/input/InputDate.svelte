<script>
	import Validation from '$components/text/Validation.svelte';

	export let label = "Date";
	export let id = "date";
	export let required = false;
	export let msg = "";
	export let value = "";
</script>

<div class="input-container">
	<label for={id}>{label} {required ? " *" : ""}</label>

	<div class="input-wrapper">
		<input type="date" id={id} class="input" bind:value={value} />

		{#if msg}
			<Validation msg={msg} />
		{/if}
	</div>
</div>