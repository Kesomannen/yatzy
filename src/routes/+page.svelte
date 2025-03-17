<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Die from '$lib/components/Die.svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import { game } from '$lib/game.svelte';
</script>

<div class="flex flex-col items-center">
	<h1
		class="font-display bg-gradient-to-tr from-amber-600 to-amber-700 bg-clip-text pb-4 text-8xl text-transparent"
	>
		Yatzy
	</h1>

	<div class="flex items-center gap-1">
		{#each game.dice as die}
			<Die {die} />
		{/each}
	</div>

	<Button
		size="lg"
		icon="tabler:dice-2-filled"
		onclick={() => game.rollDice()}
		disabled={game.rollsLeft <= 0}
		class="my-2"
	>
		Kasta ({game.rollsLeft} kvar)
	</Button>
</div>

<div class="flex w-full max-w-lg gap-8">
	{#each game.players as player}
		<PlayerCard {player} />
	{/each}
</div>
