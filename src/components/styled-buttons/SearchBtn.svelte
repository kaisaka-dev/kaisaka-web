<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<button> <i class="fa fa-search"></i> Search</button>

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