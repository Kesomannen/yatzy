<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		color?: 'blue' | 'gray';
		size?: 'sm' | 'md' | 'lg';
		icon?: string;
		children: Snippet<[]>;
	} & HTMLButtonAttributes;

	let { color = 'blue', size = 'md', icon, children, class: className, ...props }: Props = $props();

	let colorClasses = $derived(
		{
			blue: 'bg-amber-700 enabled:hover:bg-amber-600 disabled:bg-gray-300',
			gray: 'bg-gray-400 enabled:hover:bg-gray-500 disabled:bg-gray-400'
		}[color]
	);

	let sizeClasses = $derived(
		{
			sm: 'px-3 py-1 text-sm gap-1 font-semibold',
			md: 'px-4 py-1.5 gap-2 font-semibold',
			lg: 'px-6 py-2 text-lg gap-2 font-semibold'
		}[size]
	);
</script>

<button
	class="flex transform cursor-pointer items-center justify-center rounded-full text-white transition-all enabled:hover:scale-105 enabled:hover:shadow-md enabled:active:scale-100 disabled:cursor-not-allowed disabled:text-gray-400 {colorClasses} {sizeClasses} {className}"
	{...props}
>
	{#if icon}
		<Icon {icon} />
	{/if}

	{@render children()}
</button>
