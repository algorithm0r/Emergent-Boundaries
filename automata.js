class Automata {
	constructor() {
		this.plants = [];
		for(var i = 0; i < PARAMETERS.dimension; i++) {
			this.plants.push([]);
			for(var j = 0; j < PARAMETERS.dimension; j++) {
				this.plants[i].push(null);
			}
		}
		this.wasteList = [];
	}	

	clearPlants() {
		for(var i = 0; i < PARAMETERS.dimension; i++) {
			for(var j = 0; j < PARAMETERS.dimension; j++) {
				this.plants[i][j] = null;
			}
		}
	}

	processWaste() {
		this.wasteList.forEach( waste => {
			this.addPlant(waste.hue, waste.x, waste.y);
		});
		this.wasteList = [];
	}

	addRandomPlant() {
		const i = randomInt(PARAMETERS.dimension);
		const j = randomInt(PARAMETERS.dimension);
		this.addPlant(randomInt(360), i, j);
	}

	addPlant(hue, x, y) {
		this.plants[x][y] = new Plant({hue: hue, x:x, y:y}, this)
	}

	update() {
		this.processWaste();
		for(var i = 0; i < PARAMETERS.dimension; i++) {
			for(var j = 0; j < PARAMETERS.dimension; j++) {
				this.plants[i][j]?.update();
				if(Math.random() < 0.001) this.plants[i][j] = null;
			}
		}

	}

	draw(ctx) {
		for(var i = 0; i < PARAMETERS.dimension; i++) {
			for(var j = 0; j < PARAMETERS.dimension; j++) {
				this.plants[i][j]?.draw(ctx);
			}
		}
	}
};