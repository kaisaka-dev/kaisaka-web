<script>
	import Validation from '$components/text/Validation.svelte';

	export let label = "Textarea";
	export let id = "text";
	export let rows = 4;
	export let required = false;
	export let msg = "";
	export let value = "";

</script>

<div class="input-container">
	<label for={id}>{label} {required ? " *" : ""}</label>

	<div class="input-wrapper">
		<textarea id={id} class="input no-resize" rows={rows} style="height:auto; margin-top: 0.25rem" bind:value={value}> </textarea>
		{#if msg}
			<Validation msg={msg} />
		{/if}
	</div>
</div>