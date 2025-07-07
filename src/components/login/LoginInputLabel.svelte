<script lang="ts">
  let { labelText, forType, inputName, placeholder}: { labelText: string, forType: string, inputName: string, placeholder: string } = $props()
</script>


<div class="flex flex-wrap items-center mb-8 mx-10 gap-2">
  <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for={ forType }>
    { labelText }
  </label>
  <input name={ inputName } type={ forType } class="input !min-w-[50%] grow basis-0 !h-10" placeholder = { placeholder }/>
</div>