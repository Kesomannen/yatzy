<script lang="ts">
	import { game, Player, type ScoreTableRow } from '$lib/game.svelte';
	import Button from './Button.svelte';

	let { player, row }: { player: Player; row: ScoreTableRow | undefined } = $props();
</script>

{#if row}
	<td class="w-30">
		{#if row.state.type === 'open'}
			{#if game.playing && game.activePlayer === player}
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
		{:else if row.state.type === 'closed'}
			---
		{:else if row.state.type === 'claimed'}
			{row.state.points}
		{/if}
	</td>
{:else}
	<td> Elliot </td>
{/if}
