class Automata {
	constructor() {
		this.tick = 0;
		this.plants = [];
		this.animats = [];
		this.deadAnimats = [];
		for(var i = 0; i < PARAMETERS.dimension; i++) {
			this.plants.push([]);
			for(var j = 0; j < PARAMETERS.dimension; j++) {
				this.plants[i].push(null);
			}
		}
		this.wasteList = [];
		this.initializePlants();
	}	

	addAnimats(){
		for(var i = 0; i < PARAMETERS.initialAnimats; i++) {
			const x = randomInt(PARAMETERS.dimension);
			const y = randomInt(PARAMETERS.dimension);
			const hue = randomInt(360);
			this.animats.push(new Animat({x:x,y:y,hue:hue,noise: randomInt(180) - 90}, this));
		}
	}

	initializePlants() {
		for(var i = 0; i < PARAMETERS.initialPlants; i++) {
			this.addRandomPlant();
		}
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
			this.addPlant(waste.hue, waste.x, waste.y, waste.planter);
		});
		this.wasteList = [];
	}

	addRandomPlant() {
		const i = randomInt(PARAMETERS.dimension);
		const j = randomInt(PARAMETERS.dimension);
		this.addPlant(randomInt(360), i, j);
	}

	addPlant(hue, x, y, planter) {
		this.plants[x][y] = new Plant({hue: hue, x:x, y:y, planter:planter}, this)
	}

	addRock(x, y) {
		this.plants[x][y] = new Rock({x:x, y:y}, this)
	}

	addAnimat(animat) {
		this.animats.push(animat);
	}
	
	update() {
		if(++this.tick - PARAMETERS.animatAddTime === 0) 
			this.addAnimats();

		for(var i = 0; i < PARAMETERS.dimension; i++) {
			for(var j = 0; j < PARAMETERS.dimension; j++) {
				this.plants[i][j]?.update();
				if(Math.random() < PARAMETERS.plantDeathChance) this.plants[i][j] = null;
			}
		}
		this.animats.forEach( animat => {
			animat.update();
		});
		this.deadAnimats = [];
		for(let i = this.animats.length - 1; i >= 0; i--) {
			let animat = this.animats[i];
			if(animat.removeFromWorld) {
				this.animats.splice(i, 1);
				this.deadAnimats.push(animat);
			}
		}
		this.processWaste();
	}

	draw(ctx) {
		for(var i = 0; i < PARAMETERS.dimension; i++) {
			for(var j = 0; j < PARAMETERS.dimension; j++) {
				this.plants[i][j]?.draw(ctx);
			}
		}
		for(var i = 0; i < this.animats.length; i++) {
			this.animats[i].draw(ctx);
		}
	}
};