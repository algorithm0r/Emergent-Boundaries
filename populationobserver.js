class PopulationObserver {
	constructor(automata, dataManager) {
		this.automata = automata;
		this.dataManager = dataManager;

		const popData = [this.dataManager.plantPopulation, this.dataManager.animatPopulation];
		this.populationGraph = new Graph(1000, 0, 1000, 100, popData, "Population", 0, 100, true);
		const foodWebData = [this.dataManager.avgFoodWebDegree];
		this.foodWebGraph = new Graph(1000, 115, 1000, 200, foodWebData, "Food Web Degree", 0, 100, false, ["white"]);

		this.foodWebHistogram = new Histogram(1000, 115, this.dataManager.foodWebHistogram, {label: "", width:1000, height: 200});
		this.visitedHistogram = new Histogram(1000, 330, this.dataManager.visitedHistogram, {label: "Number of Cells Visited", width:1000, height: 200});
		// this.plantHueDisplay = new HueTimeSeriesDisplay(1000, 230);
		// this.animatHueDisplay = new HueTimeSeriesDisplay(1000, 590);
	}

	update() {

	}

	draw(ctx) {
		this.populationGraph.draw(ctx);
		this.foodWebHistogram.draw(ctx);
		this.foodWebGraph.draw(ctx);
		this.visitedHistogram.draw(ctx);
		// this.plantHueDisplay.draw(ctx, this.dataManager.plantHues);
		// this.animatHueDisplay.draw(ctx, this.dataManager.animatHues);
	}
};