<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Die from '$lib/components/Die.svelte';
	import PlayerScoreRow from '$lib/components/PlayerScoreRow.svelte';
	import { game, Player, rowNames } from '$lib/game.svelte';

	let newName = $state('');

	function addPlayer() {
		game.players.push(new Player(newName));
		newName = '';
	}
</script>

<div class="flex flex-col items-center">
	<h1
		class="font-display bg-gradient-to-tr from-amber-600 to-amber-700 bg-clip-text pb-4 text-8xl text-transparent"
	>
		Yatzy
	</h1>
	{#if game.playing}
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
	{:else}
		<div class="mt-2 flex gap-1">
			<input
				type="text"
				bind:value={newName}
				placeholder="Spelarnamn..."
				class="rounded-xl border-2 border-gray-300 px-4 py-2 placeholder-gray-400 ring-amber-600 outline-none focus:ring-2"
			/>

			<Button icon="tabler:plus" onclick={addPlayer} disabled={newName.length === 0}></Button>
		</div>

		<Button
			size="lg"
			icon="tabler:player-play"
			onclick={() => game.start()}
			disabled={game.players.length === 0}
			class="mt-3"
		>
			Starta spel
		</Button>
	{/if}
</div>

{#if game.players.length > 0}
	<table>
		<thead>
			<tr class="border border-gray-400 bg-gray-100 py-1 font-bold text-gray-800">
				<td> </td>
				{#each game.players as player}
					<td class="py-1.5">
						{player.name}
					</td>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rowNames.slice(0, 6) as name, j}
				<tr class="border border-gray-400 odd:bg-gray-200 even:bg-gray-100">
					<td class="py-1.5 pr-12 pl-4">
						{name}
					</td>

					{#each game.players as player}
						<PlayerScoreRow {player} row={player.scoreTable[j]} />
					{/each}
				</tr>
			{/each}

			<tr class="border border-gray-400 font-bold text-gray-800 odd:bg-gray-200 even:bg-gray-100">
				<td class="py-2 pl-4"> Summa </td>
				{#each game.players as player}
					<td>{player.homoScore}</td>
				{/each}
			</tr>

			<tr class="border border-gray-400 odd:bg-gray-200 even:bg-gray-100">
				<td class="py-2 pl-4"> Bonus </td>
				{#each game.players as player}
					<td>{player.bonusScore}</td>
				{/each}
			</tr>

			{#each rowNames.slice(6) as name, i}
				<tr class="border border-gray-400 odd:bg-gray-200 even:bg-gray-100">
					<td class="py-1.5 pr-8 pl-4">
						{name}
					</td>

					{#each game.players as player}
						<PlayerScoreRow {player} row={player.scoreTable[i + 6]} />
					{/each}
				</tr>
			{/each}

			<tr class="border border-gray-400 font-bold text-gray-800 odd:bg-gray-200 even:bg-gray-100">
				<td class="py-2 pl-4"> Summa </td>
				{#each game.players as player}
					<td class="pr-4">
						{player.totalScore}
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
{/if}
