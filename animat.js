class Animat {
	constructor(other, automata) {
		this.age = 0;
		this.automata = automata;
		this.hue = other.hue;
		this.noise = other.noise;

		this.id = PARAMETERS.agentID++;

		this.foodWeb = new Map();
		this.visited = new Set();
		
		this.x = other.x;
		this.y = other.y;

		this.energy = 50;
	}	

	normalize(value, max) { 
		// return value >= max ? max-1 : value < 0 ? 0 : value; // no wrap
		return (value + max) % max; // wrap
	}

	move() {
		let x = this.x;
		let y = this.y;

		let best = Infinity;

		const empty = [];
		for(var i = -1; i < 2; i++) { // find cell to move to
			const newX = this.normalize(this.x + i, PARAMETERS.dimension);
			for(var j = -1; j < 2; j++) {
				const newY = this.normalize(this.y + j, PARAMETERS.dimension);
				const plant = this.automata.plants[newX][newY];
				
				if(!plant) {
					empty.push({x:newX,y:newY});
				}

				const diff = Math.abs(this.hue - (plant ? plant.hue : Infinity));
				
				if(diff < best) {
					best = diff;
					x = newX;
					y = newY;
				}
			}
		}

		this.x = x;
		this.y = y;
		if(!this.visited.has(`${x},${y}`)) {
			this.visited.add(`${x},${y}`);
		}
	}

	hueDifference (plant) {
		let diff = plant ? Math.abs(this.hue - plant.hue) : 180;
		if (diff > 180) diff = 360 - diff; // now diff is between 0-180 and wraps 
		return (90 - diff) / 90;
	}

	eat() {
		const growthrate = parseInt(document.getElementById("animatgrowth").value);
		const selectivity = parseFloat(document.getElementById("animatselection").value);
		const plant = this.automata.plants[this.x][this.y];
		const diff = this.hueDifference(plant);
	
		if(plant && diff >= selectivity) {
			let plant = this.automata.plants[this.x][this.y];
			this.automata.plants[this.x][this.y] = null; 
			let wasteHue = this.normalize(plant.hue + 180 + this.noise, 360);
			this.automata.wasteList.push({hue:wasteHue,x:this.x,y:this.y, planter:this.id});

			this.energy += 80 / growthrate * diff;

			if(plant.planter)
				this.foodWeb.set(plant.planter, this.foodWeb.get(plant.planter) + 1 || 1);
		}
	}

	reproduce() {
		if(this.energy > 80) {
			this.energy -= 80;

			this.automata.addAnimat(new Animat(this.mutate(),this.automata));
		}
	}

	die() {
		this.removeFromWorld = true;
		// console.log(`Animat ${this.id} died at age ${this.age} having eaten from ${this.foodWeb.size} different animats and visited ${this.visited.size} different cells with energy ${this.energy}.`);
	}

	mutate() {
		const newX = this.normalize(this.x - 1 + randomInt(3), PARAMETERS.dimension);
		const newY = this.normalize(this.y - 1 + randomInt(3), PARAMETERS.dimension);
		const hue = this.normalize(this.hue - 10 + randomInt(21), 360);
		const noise = this.normalize(this.noise - 5 + randomInt(11) - 90, 90);
		return{hue:hue,x:newX,y:newY, noise:noise};
	}

	update() {
		this.age++;
		this.move();
		this.eat();
		this.reproduce();
		if(this.energy < 0 || Math.random() < PARAMETERS.animatDeathChance) this.die();
	}

	draw(ctx) {
		ctx.fillStyle = hsl(this.hue,75,50);
		ctx.strokeStyle = "light gray";
		ctx.beginPath();
		ctx.arc((this.x + 1/2)*PARAMETERS.size, (this.y + 1/2)*PARAMETERS.size, PARAMETERS.size/2 - 1, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
};