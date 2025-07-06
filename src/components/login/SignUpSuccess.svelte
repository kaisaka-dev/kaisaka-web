<script lang="ts">
  let { data } : { data: boolean } = $props()
</script>

{#if data}
    <div id="error-msg" style="z-index: 10; width: 100%" class = "!mb-5 !bg-green-400 !text-black !text-sm !border-green-400 !rounded-lg alert alert-success">
        Successfully Created an Account. Redirecting back...
    </div>
{/if}
