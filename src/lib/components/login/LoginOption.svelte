<script lang="ts">
  let { ButtonText, buttonFunction }: { ButtonText: string, buttonFunction: () => {}} = $props()

</script>

<button type="submit" class = "btn font-[JSans] !text-[var(--medium-text)] !bg-[#C5C5C5] !p-8 !rounded-md hover:!shadow-xl" onclick = {buttonFunction}>
  { ButtonText }
</button>