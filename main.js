const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.entities = [];

	gameEngine.init(ctx);

	let automata = new Automata();
	gameEngine.addEntity(automata);
	const dataManager = new DataManager(automata);
	gameEngine.addEntity(dataManager);
	const populationObserver = new PopulationObserver(automata, dataManager);
	gameEngine.addEntity(populationObserver);

	document.getElementById("plant").addEventListener("click", () => {
		automata.addRandomPlant();
	});

	document.getElementById("animat").addEventListener("click", () => {
		gameEngine.addEntity(new Animat({
			x:randomInt(PARAMETERS.dimension),
			y:randomInt(PARAMETERS.dimension),
			hue:randomInt(360),
			noise: randomInt(180) - 90
			},
			automata));
	});

	document.getElementById("clear").addEventListener("click", () => {
		gameEngine.clearAnimats();
		automata.clearPlants();
	});

	gameEngine.start();
});
