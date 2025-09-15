class PopulationObserver {
	constructor(automata, dataManager) {
		this.automata = automata;
		this.dataManager = dataManager;

		const popData = [this.dataManager.plantPopulation, this.dataManager.animatPopulation];
		this.populationGraph = new Graph(1000, 0, 1000, 100, popData, "Population", 0, 100, true);
		this.plantHueDisplay = new HueTimeSeriesDisplay(1000, 115);
		this.animatHueDisplay = new HueTimeSeriesDisplay(1000, 475);
	}

	update() {

	}

	draw(ctx) {
		this.populationGraph.draw(ctx);
		this.plantHueDisplay.draw(ctx, this.dataManager.plantHues);
		this.animatHueDisplay.draw(ctx, this.dataManager.animatHues);
	}
};