export type RowBehavior = (dice: number[], dist: number[]) => number | null;

export type RowState =
	| { type: 'open' }
	| { type: 'closed' }
	| { type: 'claimed'; dice: number[]; points: number };

export class ScoreTableRow {
	name: string;
	state: RowState = $state({ type: 'open' });
	behavior: RowBehavior;

	points = $derived.by(() => {
		if (this.state.type === 'claimed') {
			return this.state.points;
		} else {
			return 0;
		}
	});

	constructor(name: string, behavior: RowBehavior) {
		this.name = name;
		this.behavior = behavior;
	}
}

export function homoRow(value: number): RowBehavior {
	return (_, dist) => {
		const sum = dist[value] * value;
		if (sum === 0) {
			return null;
		} else {
			return sum;
		}
	};
}

export function ofAKindRow(count: number, overrideValue?: number): RowBehavior {
	return (_, dist) => {
		for (let i = dist.length - 1; i >= 1; i--) {
			if (dist[i] < count) continue;
			return overrideValue ?? count * i;
		}
		return null;
	};
}

export const twoPair: RowBehavior = (_, dist) => {
	let firstPair: number | null = null;

	for (let i = dist.length - 1; i > 0; i--) {
		const count = dist[i];
		if (count < 2) continue;

		if (firstPair === null) {
			firstPair = i;
		} else {
			return (firstPair + i) * 2;
		}
	}
	return null;
};

export const smallStraight: RowBehavior = (_, dist) => {
	for (let i = 1; i <= 5; i++) {
		if (dist[i] === 0) return null;
	}
	return 15;
};

export const largeStraight: RowBehavior = (_, dist) => {
	for (let i = 2; i <= 6; i++) {
		if (dist[i] === 0) return null;
	}
	return 20;
};

export const fullHouse: RowBehavior = (_, dist) => {
	let triple: number | null = null;
	for (let i = dist.length - 1; i >= 1; i--) {
		if (dist[i] !== 3) continue;
		triple = i;
	}
	if (triple === null) return null;

	let pair: number | null = null;
	for (let i = dist.length - 1; i >= 1; i--) {
		if (dist[i] !== 2) continue;
		pair = i;
	}
	if (pair === null) return null;

	return triple * 3 + pair * 2;
};

export function sumDice(dice: number[]): number {
	return dice.reduce((partialSum, a) => partialSum + a, 0);
}

export function diceDist(dice: number[]) {
	const result = Array.from({ length: 7 }, () => 0);
	for (const die of dice) {
		result[die ?? 0] += 1;
	}
	return result;
}

export const rowNames = [
	'Ettor',
	'Tvåor',
	'Treor',
	'Fyror',
	'Femmor',
	'Sexor',
	'Ett Par',
	'Två Par',
	'Tretal',
	'Fyrtal',
	'Liten Stege',
	'Stor Stege',
	'Kåk',
	'Chans',
	'Yatzy'
];

export class Player {
	name: string;
	scoreTable: ScoreTableRow[] = [
		new ScoreTableRow('Ettor', homoRow(1)),
		new ScoreTableRow('Tvåor', homoRow(2)),
		new ScoreTableRow('Treor', homoRow(3)),
		new ScoreTableRow('Fyror', homoRow(4)),
		new ScoreTableRow('Femmor', homoRow(5)),
		new ScoreTableRow('Sexor', homoRow(6)),
		new ScoreTableRow('Ett Par', ofAKindRow(2)),
		new ScoreTableRow('Två Par', twoPair),
		new ScoreTableRow('Tretal', ofAKindRow(3)),
		new ScoreTableRow('Fyrtal', ofAKindRow(4)),
		new ScoreTableRow('Liten Stege', smallStraight),
		new ScoreTableRow('Stor Stege', largeStraight),
		new ScoreTableRow('Kåk', fullHouse),
		new ScoreTableRow('Chans', (dice, _) => sumDice(dice)),
		new ScoreTableRow('Yatzy', ofAKindRow(5, 50))
	];

	homoScore = $derived(
		this.scoreTable
			.slice(0, 6)
			.map((row) => row.points)
			.reduce((partialSum, a) => partialSum + a, 0)
	);

	bonusScore = $derived(this.homoScore >= 63 ? 50 : 0);

	totalScore = $derived(
		this.scoreTable.map((row) => row.points).reduce((partialSum, a) => partialSum + a, 0) +
			this.bonusScore
	);

	tableComplete = $derived(!this.scoreTable.find((row) => row.state.type === 'open'));

	constructor(name: string) {
		this.name = name;
	}
}

export class Die {
	value: number | null = $state(0);
	locked = $state(false);
}

export class Game {
	players: Player[] = $state([]);
	dice: Die[] = [new Die(), new Die(), new Die(), new Die(), new Die()];
	activePlayerIndex: number = $state(0);
	rollsLeft: number = $state(2);
	playing: boolean = $state(false);

	diceValues = $derived(this.dice.map((die) => die.value ?? 0).sort());
	diceDist = $derived(diceDist(this.diceValues));
	activePlayer = $derived(this.players[this.activePlayerIndex]);

	constructor() {
		this.randomizeDice();
	}

	private randomizeDice() {
		for (const die of this.dice) {
			if (die.locked) continue;
			die.value = Math.round(Math.random() * 5 + 1);
		}
	}

	rollDice() {
		this.randomizeDice();
		this.rollsLeft--;
	}

	start() {
		this.playing = true;
	}

	nextTurn() {
		if (this.players.some((player) => !player.tableComplete)) {
			this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;

			for (const die of this.dice) {
				die.locked = false;
			}
			this.randomizeDice();
			this.rollsLeft = 2;
		} else {
			let winner = this.players.toSorted((a, b) => b.totalScore - a.totalScore)[0];

			alert(`${winner.name} vann!`);

			this.players.forEach((player) => {
				player.scoreTable.forEach((row) => {
					row.state = { type: 'open' };
				});
			});

			this.playing = false;
		}
	}
}

export const game = new Game();
