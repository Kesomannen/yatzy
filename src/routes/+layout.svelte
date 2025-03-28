<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div
	class="mx-auto flex w-full flex-col items-center justify-center gap-12 overflow-y-auto p-6 lg:flex-row"
>
	{@render children()}
</div>
