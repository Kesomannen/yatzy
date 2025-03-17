<script lang="ts">
	import { game, Player, type ScoreTableRow } from '$lib/game.svelte';
	import Button from './Button.svelte';

	let { player, row }: { player: Player; row: ScoreTableRow } = $props();
</script>

<tr class="border border-gray-400 odd:bg-gray-200 even:bg-gray-100">
	<td
		class="py-1.5 pl-4 text-gray-700"
		class:font-semibold={row.state.type === 'open' && game.activePlayer === player}
		class:line-through={row.state.type === 'closed'}
	>
		{row.name}
	</td>
	<td class="pr-4">
		{#if row.state.type === 'open'}
			{#if game.activePlayer === player}
				{@const points = row.behavior(game.diceValues, game.diceDist)}

				<Button
					size="sm"
					color={points ? 'blue' : 'gray'}
					icon={points ? 'tabler:lock-filled' : 'tabler:trash-filled'}
					onclick={() => {
						row.state =
							points === null
								? { type: 'closed' }
								: {
										type: 'claimed',
										dice: game.diceValues,
										points
									};
						game.nextTurn();
					}}
				>
					{#if points}
						Lås in {points}
					{:else}
						Stryk
					{/if}
				</Button>
			{:else}{/if}
		{:else if row.state.type === 'closed'}{:else if row.state.type === 'claimed'}
			{row.state.points}
		{/if}
	</td>
</tr>
