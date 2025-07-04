<script>
	import Validation from '../text/Validation.svelte';

	export let label = "Textarea";
	export let id = "text";
	export let rows = 4;
	export let required = false;
	export let msg = "";
	export let value = "";
	export let disabled = false;

	export let margin = true;			// false if no margin, true if the default margin
</script>

<div class="input-container" class:no-margin={label === '' || !margin}>
	<label for={id}>{label} {required ? " *" : ""}</label>

	<div class="input-wrapper">
		<textarea id={id} class="input no-resize" rows={rows} style="height:auto; margin-top: 0.25rem" bind:value={value} {disabled}> </textarea>
		{#if msg}
			<Validation msg={msg} />
		{/if}
	</div>
</div>

<style>
    textarea:disabled {
        background-color:gray;
        color: lightgray;
    }
</style>