<script lang="ts">
	import Icon from '@iconify/svelte';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Yatzyspel</title>
	<meta name="description" content="Det klassika yatzyspelet för 2-4 spelare." />
</svelte:head>

<main
	class="font-fredoka mx-auto flex w-full flex-col items-center justify-center gap-12 overflow-y-auto p-6 lg:flex-row"
>
	{@render children()}
</main>

<footer class="fixed bottom-2 left-3 flex items-center gap-1 text-gray-600 underline">
	<Icon icon="mdi:github" class="text-lg" />
	<a href="https://github.com/Kesomannen/yatzy">Github</a>
</footer>
