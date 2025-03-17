<script lang="ts">
	import type { Die } from '$lib/game.svelte';
	import Icon from '@iconify/svelte';

	let { die }: { die: Die } = $props();

	type Dots = {
		topLeft?: boolean;
		topRight?: boolean;
		bottomLeft?: boolean;
		bottomRight?: boolean;
		center?: boolean;
		left?: boolean;
		right?: boolean;
	};

	let dots: Dots = $derived.by(() => {
		switch (die.value) {
			case 1:
				return { center: true };
			case 2:
				return { topLeft: true, bottomRight: true };
			case 3:
				return { topLeft: true, bottomRight: true, center: true };
			case 4:
				return { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true };
			case 5:
				return { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true, center: true };
			case 6:
				return {
					topLeft: true,
					topRight: true,
					bottomLeft: true,
					bottomRight: true,
					left: true,
					right: true
				};
			default:
				return {};
		}
	});
</script>

<div class="select-none">
	<Icon
		icon="tabler:lock-filled"
		class="mx-auto text-3xl text-amber-700 {die.locked ? 'block' : 'invisible'}"
	/>

	<button
		class="mt-1 rounded-lg border-2 border-amber-700 p-3 hover:ring-2 hover:ring-amber-700"
		onclick={() => (die.locked = !die.locked)}
	>
		<div class="relative h-10 w-10">
			{#if dots.topLeft}
				<div class="dot top-0 left-0"></div>
			{/if}
			{#if dots.topRight}
				<div class="dot top-0 right-0"></div>
			{/if}
			{#if dots.bottomLeft}
				<div class="dot bottom-0 left-0"></div>
			{/if}
			{#if dots.bottomRight}
				<div class="dot right-0 bottom-0"></div>
			{/if}
			{#if dots.center}
				<div class="dot half-top half-left"></div>
			{/if}
			{#if dots.left}
				<div class="dot half-top left-0"></div>
			{/if}
			{#if dots.right}
				<div class="dot half-top right-0"></div>
			{/if}
		</div>
	</button>
</div>

<style>
	@import 'tailwindcss';

	.dot {
		background-color: theme(--color-amber-700);
		border-radius: 999px;
		width: 10px;
		height: 10px;
		position: absolute;
	}

	.half-top {
		top: calc(50% - 5px);
	}

	.half-left {
		left: calc(50% - 5px);
	}
</style>
