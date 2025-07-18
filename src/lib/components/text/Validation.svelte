<script>
	export let msg = "Error: field is required";
	export let style = "";
	/**
	 * InputText, Inputdate, InputTextarea all have this defined inside them! call using `msg` label
	 */
</script>

<span class="error-message" style="{style};">{msg}</span>

<style>
    .error-message {
        color: var(--error-color);
        font-size: 0.75rem;
        font-style: italic;
        height: auto;
        padding: 0;
        display: block;
				margin-bottom: 0.3rem;
    }
</style>