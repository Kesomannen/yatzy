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

function homogenousRow(value: number): RowBehavior {
	return (_, dist) => {
		const sum = dist[value] * value;
		if (sum === 0) {
			return null;
		} else {
			return sum;
		}
	};
}

function ofAKindRow(count: number, overrideValue?: number): RowBehavior {
	return (_, dist) => {
		for (let i = dist.length - 1; i >= 1; i--) {
			if (dist[i] < count) continue;
			return overrideValue ?? count * i;
		}
		return null;
	};
}

function sumDice(dice: number[]): number {
	return dice.reduce((partialSum, a) => partialSum + a, 0);
}

export class Player {
	name: string;
	scoreTable: ScoreTableRow[] = [
		new ScoreTableRow('Ettor', homogenousRow(1)),
		new ScoreTableRow('Tvåor', homogenousRow(2)),
		new ScoreTableRow('Treor', homogenousRow(3)),
		new ScoreTableRow('Fyror', homogenousRow(4)),
		new ScoreTableRow('Femmor', homogenousRow(5)),
		new ScoreTableRow('Sexor', homogenousRow(6)),
		new ScoreTableRow('Ett Par', ofAKindRow(2)),
		new ScoreTableRow('Två Par', (_, dist) => {
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
		}),
		new ScoreTableRow('Tretal', ofAKindRow(3)),
		new ScoreTableRow('Fyrtal', ofAKindRow(4)),
		new ScoreTableRow('Liten Stege', (_, dist) => {
			for (let i = 1; i <= 5; i++) {
				if (dist[i] === 0) return null;
			}
			return 15;
		}),
		new ScoreTableRow('Stor Stege', (_, dist) => {
			for (let i = 2; i <= 6; i++) {
				if (dist[i] === 0) return null;
			}
			return 20;
		}),
		new ScoreTableRow('Kåk', (_, dist) => {
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
		}),
		new ScoreTableRow('Chans', (dice, _) => sumDice(dice)),
		new ScoreTableRow('Yatzy', ofAKindRow(5, 50))
	];

	homoScore = $derived(
		this.scoreTable
			.splice(0, 6)
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
	players: Player[] = [new Player('Peter'), new Player('Bo')];
	dice: Die[] = [new Die(), new Die(), new Die(), new Die(), new Die()];
	activePlayerIndex: number = $state(0);
	rollsLeft: number = $state(2);

	diceValues = $derived(this.dice.map((die) => die.value ?? 0).sort());
	diceDist = $derived.by(() => {
		const result = Array.from({ length: 7 }, () => 0);
		for (const die of this.dice) {
			result[die.value ?? 0] += 1;
		}
		return result;
	});
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

	nextTurn() {
		this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;

		for (const die of this.dice) {
			die.locked = false;
		}
		this.randomizeDice();
		this.rollsLeft = 2;
	}
}

export const game = new Game();
