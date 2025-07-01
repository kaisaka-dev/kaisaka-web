<script>
	export let label = "Option";
	export let id = "radio";
	export let name = "group";
	export let value = "";
	export let checked = false;
	export let disabled = false;
	export let group;
</script>

<div class="input-container" style="align-items: center; gap:8px; padding-bottom: 0.5rem;" >
	<input type="radio" id={id} name={name} value={value} bind:group={group} checked={checked} {disabled} class="radio" />
	<label for={id}>{label}</label>
</div>

<style>

    .radio {
        width: 1rem;
        height: 1rem;
        margin: 0;
        padding: 10px;
        position: relative;
				color: transparent;
    }

    .radio:checked, .radio:disabled:checked {
        background-color: var(--green);
    }

    .radio:disabled {
        background-color: gray;
        cursor: not-allowed;
    }


</style>