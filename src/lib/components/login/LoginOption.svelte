<script lang="ts">
  let { ButtonText, buttonFunction }: { ButtonText: string, buttonFunction: () => {}} = $props()

</script>

<button type="submit" class = "btn green font-[JSans] !p-6" onclick = {buttonFunction}>
  { ButtonText }
</button>