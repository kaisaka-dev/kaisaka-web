<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
<script>
	export let label = "";
	export let btnClass = "green"
</script>
<div id="disable-cover" class="!fixed !top-0 !left-0 !w-full !h-full !bg-[rgba(0,0,0,0.2)] !z-[9999] !pointer-events-auto !flex !items-center !h-screen">
	<i class="fa fa-circle-notch fa-spin mr-2 !text-[var(--background)] !text-[150px] !mx-auto !my-auto"></i></div>
<button class={btnClass} disabled><i class="fa fa-circle-notch fa-spin mr-2 !text-[inherit]"></i>{label}</button>