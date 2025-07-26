

<script lang="ts">
  import { invalidate } from '$app/navigation';
  import '../app.css';
	import { onMount } from 'svelte'

  let { data, children } = $props()

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

{@render children()}
