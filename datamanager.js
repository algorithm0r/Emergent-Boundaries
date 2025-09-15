class DataManager {
	constructor(automata) {
		this.automata = automata;
		this.plantPopulation = [];
		this.animatPopulation = [];
		this.plantHues = [];
		this.animatHues = [];
	}
	update() {
		const plantCount = new Array(360).fill(0);
		this.automata.plants.forEach( column => {
			column.forEach( plant => {
				if(plant) plantCount[plant.hue]++;
			});
		});
		this.plantHues.push(plantCount);
		this.plantPopulation.push(this.automata.plants.flat().filter( plant => plant !== null).length);

		const animatCount = new Array(360).fill(0);
		this.automata.animats.forEach( animat => {
			animatCount[animat.hue]++;
		});
		this.animatHues.push(animatCount);
		this.animatPopulation.push(this.automata.animats.length);
	}

	draw(ctx) {
	}
};