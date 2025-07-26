<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import '../app.css';
	import { onMount } from 'svelte'

	let { data, children } = $props()		// children: refers to the inner markup that gets rendered inside the layout

	let { session, supabase } = $derived(data)

  onMount(() => {
    let timeout: NodeJS.Timeout;
    supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.expires_at) {
      console.log('Access token expires at:', new Date(session.expires_at * 1000));
    } else {
      console.log('No session or expiration time');
    }
  });


    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }

      if (newSession?.expires_at) {
        const expiresInMs = newSession.expires_at * 1000 - Date.now();
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log('Token expired — logging out or showing modal');
          supabase.auth.signOut(); // or show a modal
        }, expiresInMs);
      }
    })
    return () => {
      data.subscription.unsubscribe();
      clearTimeout(timeout);
    }
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