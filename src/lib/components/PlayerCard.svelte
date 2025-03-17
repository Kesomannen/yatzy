<script lang="ts">
	import { game, type Player } from '$lib/game.svelte';
	import PlayerCardRow from './PlayerCardRow.svelte';

	let { player }: { player: Player } = $props();
</script>

<div class="grow">
	<table class="w-full text-left">
		<tbody>
			{#each player.scoreTable.slice(0, 6) as row}
				<PlayerCardRow {player} {row} />
			{/each}

			<tr class="border border-gray-400 font-bold text-gray-800 odd:bg-gray-200 even:bg-gray-100">
				<td class="py-2 pl-4"> Bonus </td>
				<td class="pr-4">{player.bonusScore} </td>
			</tr>

			{#each player.scoreTable.slice(6) as row}
				<PlayerCardRow {player} {row} />
			{/each}

			<tr class="border border-gray-400 font-bold text-gray-800 odd:bg-gray-200 even:bg-gray-100">
				<td class="py-2 pl-4"> Summa </td>
				<td class="pr-4">
					{player.totalScore}
				</td>
			</tr>
		</tbody>
	</table>
</div>
