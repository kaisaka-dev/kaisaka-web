<script>
  import { onMount } from 'svelte'

  export let data

</script>

{#if data.session}
  <h1>Profile</h1>
  <p>Email: {data.session.user.email}</p>
  <p>Username: {data.session.user.user_metadata?.username}</p>

{:else}
  <p>Please log in to view your profile</p>
{/if}