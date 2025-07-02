<script>
	export let label = "Checkbox";
	export let id = "checkbox";
	export let checked = false;
	export let disabled = false;
	export let style = '';
</script>


<div class="input-container" style="align-items: center; gap:8px">
	<input type="checkbox" id={id} name="{id}" bind:checked class="check" {disabled} style=" height:10px; width: 10px; padding: 10px;">
	<label for={id} style="{style}">{label}</label>


</div>

<style>
    input[type='checkbox']:checked {
        background-color: var(--green);
    }
    input:disabled {
        background-color:gray;
				cursor: not-allowed;
    }
		input[type=checkbox] {
				border: none;
		}
</style>