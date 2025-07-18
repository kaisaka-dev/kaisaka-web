<script>
import Header from '$components/Header.svelte';
</script>

<Header page="dashboard" />

<section id="guide">
	<ol>
		<li>Select a child from <a href="/dashboard/members/children">list of children</a></li>
		<li>Navigate to "family" section and click the <button>Add</button> button</li>
	</ol>
</section>

<style>
		a {
				text-decoration: underline;
        color: var(--pink);

		}
		a:hover {
				color: var(--green);
		}
</style>