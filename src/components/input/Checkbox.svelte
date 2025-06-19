<script>
	export let label = "Checkbox";
	export let id = "checkbox";
</script>

<style>
  input[type='checkbox']:checked {
      background-color: var(--green);
  }
</style>

<div class="input-container" style="align-items: center; gap:8px">
	<input type="checkbox" id="{id}" name="{id}" value="Bike" class="check" style=" height:10px; width: 10px; padding: 10px;">
	<label for={id}>{label}</label>


</div>