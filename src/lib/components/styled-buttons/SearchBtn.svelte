<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<script lang="ts">
	// callback props to send a signal back to the parent component
	export let onSearch: () => void;

	function handleClick() {
		onSearch?.();
	}
</script>

<button on:click={handleClick}> <i class="fa fa-search"></i> Search</button>

<style>
	button i {
			color: var(--background);
			margin-right: 8px;
	}
	button:hover i {
			color: inherit;
			transition: inherit;
	}
</style>

