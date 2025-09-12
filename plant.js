class Plant {
	constructor(other, automata) {
		this.automata = automata;
		this.hue = other.hue;
		
		this.x = other.x;
		this.y = other.y;

		this.growth = 0;
	}	

	normalize(value, max) { 
		// return value >= max ? max-1 : value < 0 ? 0 : value; // no wrap
		return (value + max) % max; // wrap
	}

	mutate() {
		const newX = this.normalize(this.x - 1 + randomInt(3), PARAMETERS.dimension);
		const newY = this.normalize(this.y - 1 + randomInt(3), PARAMETERS.dimension);
		const hue = this.normalize(this.hue - 10 + randomInt(21), 360);
		return{hue:hue,x:newX,y:newY};
	}

	update() {
		const growthrate = parseInt(document.getElementById("plantgrowth").value);

		if(this.growth < 80) this.growth += 80/growthrate;
		if(this.growth >= 80){
			
			const other = this.mutate();

			if(!this.automata.plants[other.x][other.y]) {
				this.automata.plants[other.x][other.y] = new Plant (other, this.automata)
				this.growth -= 80;
			} 
		}
	}

	draw(ctx) {
		ctx.fillStyle = hsl(this.hue,20 + this.growth,50);
		ctx.strokeStyle = "dark gray";
		ctx.fillRect(this.x*PARAMETERS.size, this.y*PARAMETERS.size, PARAMETERS.size, PARAMETERS.size);
		ctx.strokeRect(this.x*PARAMETERS.size, this.y*PARAMETERS.size, PARAMETERS.size, PARAMETERS.size);
	}
};