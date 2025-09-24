class DataManager {
	constructor(automata) {
		this.automata = automata;
		this.plantPopulation = [];
		this.animatPopulation = [];
		this.plantHues = [];
		this.animatHues = [];

		this.avgFoodWebDegree = [];
		this.maxFoodWebDegree = [];
		this.minFoodWebDegree = [];

		this.foodWebHistogram = [];
		this.visitedHistogram = [];
	}

	fillFoodWebHistogram() {
		let foodWebHistogram = new Array(20).fill(0);
		this.automata.deadAnimats.forEach(animat => {
			const degree = animat.foodWeb.size;
			const index = Math.min(Math.floor(degree / 5), 19);
			foodWebHistogram[index]++;
		});
		this.foodWebHistogram.push(foodWebHistogram);
	}

	fillVisitedWebHistogram() {
		let visitedHistogram = new Array(20).fill(0);
		this.automata.deadAnimats.forEach(animat => {
			const visited = animat.visited.size;
			const index = Math.min(Math.floor(visited / 5), 19);
			visitedHistogram[index]++;
		});
		this.visitedHistogram.push(visitedHistogram);
	}

	computeFoodWebStats() {
		const degrees = this.automata.deadAnimats.map( animat => animat.foodWeb.size);
		if(degrees.length > 0) {
			const sum = degrees.reduce( (a,b) => a + b, 0);
			this.avgFoodWebDegree.push(sum / degrees.length);
			this.maxFoodWebDegree.push(Math.max(...degrees));
			this.minFoodWebDegree.push(Math.min(...degrees));
		} else {
			this.avgFoodWebDegree.push(0);
			this.maxFoodWebDegree.push(0);
			this.minFoodWebDegree.push(0);
		}
	}

	update() {
		if(this.automata.tick % PARAMETERS.reportingPeriod !== 0) return;
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

		this.computeFoodWebStats();
		this.fillFoodWebHistogram();
		this.fillVisitedWebHistogram();
	}

	draw(ctx) {
	}
};