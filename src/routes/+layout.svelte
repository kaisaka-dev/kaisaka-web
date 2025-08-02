<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import '../app.css';
	import { onMount } from 'svelte'

	let { data, children } = $props()		// children: refers to the inner markup that gets rendered inside the layout

	let { session, supabase } = $derived(data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<!-- Global Navigation Loading Bar -->
{#if $navigating}
	<div class="loading-container">
		<div class="loading-bar" />
	</div>
{/if}

{@render children()}

<style>
    .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        z-index: 9999;
        background-color: var(--green);
        overflow: hidden;
    }

    .loading-bar {
        height: 100%;
				background-color: var(--header-color);
        animation: loading 1.5s ease-in-out infinite;
    }

    @keyframes loading {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
</style>