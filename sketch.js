// count increases after a time block has passed
var i_global = 0;

// point object
class Point {
	constructor(loc_x, loc_y, w, h, rotation, speed, angle, opacity, x_forward, freq_range, colors) {
		this.loc_x = loc_x;
		this.loc_y = loc_y;
		this.w = w;
		this.h = h;
		this.previous_loc = [];
		this.random_max = .1;
		this.random_min = -.1;
		this.rotation = rotation;
		this.speed = speed;
		this.angle = angle; 
		this.line_x_length = 35;
		this.line_y_length = 0;
		this.x_forward = x_forward;
		this.opacity = opacity;
		this.freq_range = freq_range;
		this.colors = colors; // array with min/max colors
	}

	// updates the location and angle every time the draw function is called
	update_locations(level, energy, centroid) {

		// randomly move in the x direction with some given forward movement
		this.loc_x += Math.round(Math.random() * (this.random_max - this.random_min) + this.random_min) + Math.random() * this.x_forward 
		+ this.rotation * map(energy, 0, 255, 0, 1);

		// randomly move in the y direction
		this.loc_y += Math.round(Math.random() * (this.random_max - this.random_min)) + this.random_min + this.rotation * map(energy, 0, 255, 0, 1);	
		
		// move object across screen when hittings borders
		this.loc_x = (this.loc_x + width) % width;
		this.loc_y = (this.loc_y + height) % height;

		// store previous locations
		this.previous_loc.push([this.loc_x, this.loc_y]);

		// don't keep more previous locations than necessary
		if (this.previous_loc.length >= 25) {
			this.previous_loc.shift();
		}

		// increase rotation based on energy
		this.angle += this.rotation * map(energy, 0, 255, 0, Math.PI/50);

	}

	// draw the object 
	draw_object(level, energy, centroid, fill_red, fill_green, fill_blue) {

		// slowly increase opacity as time goes on
		if (this.opacity < 95) {
			this.opacity += .0005;
		}

		// fill and stroke for the arc
		fill(255, 255, centroid, this.opacity);
		stroke(255, 255, 255, this.opacity);
		strokeWeight(1);

		var size = map(mySound.currentTime(), 0, mySound.duration(), 0, 25);
		
		arc(this.loc_x, this.loc_y, this.w + size, this.h + size, Math.random() * Math.PI, Math.PI);

		// set up for the lines
		var previous_location;
		var rand_multiplier = 40 * Math.random();
		var energy_multiplier = 2 * energy;

		// rotates the x and y coordinates using rotation matrix
		var x_length = Math.cos(this.angle) * this.line_x_length - Math.sin(this.angle) * this.line_y_length;
		var y_length = Math.sin(this.angle) * this.line_x_length + Math.cos(this.angle) * this.line_y_length;
		
		// draw lines for the object based on the amount of previous locations stored
		for (var p = 0; p < this.previous_loc.length; p++) {
			previous_location = this.previous_loc[p];
			fill(255, 255, centroid, centroid);
			stroke(fill_red, fill_green, fill_blue, this.opacity);
			strokeWeight(1);
			
			line(previous_location[0], previous_location[1], previous_location[0] + x_length * energy_multiplier / 2, 
				previous_location[1] + y_length * energy_multiplier / 2);
			// line(previous_location[0], previous_location[1], previous_location[0] + x_length * energy_multiplier / 5 + energy_multiplier/2, 
			// 	previous_location[1] + y_length * energy_multiplier / 5 + energy_multiplier/2);
			// line(previous_location[0], previous_location[1], previous_location[0] + x_length * energy_multiplier / 5 - energy_multiplier/2, 
			// 	previous_location[1] + y_length * energy_multiplier / 5 - energy_multiplier/2);
			line(previous_location[0], previous_location[1], previous_location[0] + x_length + this.rotation * energy_multiplier, 
				previous_location[1] - y_length - energy_multiplier);
			line(previous_location[0], previous_location[1], previous_location[0] - x_length/2 - this.rotation * energy_multiplier, 
				previous_location[1] + y_length*2 + energy_multiplier);

		}

	}

}

// load the files
function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('Beethoven.mp3');

}

// set up the music file and canvass
function setup() {

	// set up canvass
	cnv = createCanvas(1000,650);

	// set up amplitude measurement
	amplitude = new p5.Amplitude();
	amplitude.toggleNormalize(true);

	// dictionary mapping integers to the 5 frequency bands
	energy_dict = {};
	energy_dict.bass = 0;
	energy_dict.lowMid = 1;
	energy_dict.mid = 2;
	energy_dict.highMid = 3;
	energy_dict.treble = 4;

	// store objects in an array called points
	points = []
	var rotation;


	n_points = 25; // number of objects

	// for each point, assign rotation direction,
	// frequency and color
	frequencies = ["bass", "low", "lowMid", "highMid", "treble"]
	// frequencies = ["mid", "highMid", "mid", "highMid", "treble"]

	for (var i = 0; i < n_points; i++) {
		if (i % 2 == 0) {
			rotation = 1;
		}
		else {
			rotation = -1;
		}
		
		frequency_range = Math.floor(Math.random() * 5)
		color_range = Math.floor(Math.random() * 5)

		if (color_range == 0) {
			colors = [85, 150, 85, 150, 200, 255];
		}
		else if (color_range == 1) {
			colors = [0, 0, 20, 50, 200, 255];
		}
		else if (color_range == 2) {
			colors = [20, 50, 20, 50, 20, 50];
		}
		else if (color_range == 3) {
			colors = [155, 210, 0, 40, 0, 0];
		}
		else {
			colors = [85, 150, 85, 100, 0, 0];
		}

		points.push(new Point(Math.random() * width, Math.random() * height, 10, 10, 
			rotation, Math.random() * .1, Math.random()*2*Math.PI, 0, Math.random()*.1 - .1, frequencies[frequency_range], colors));
	}

	// change point zero and one to tell more of a story
	points[0].opacity = 25;
	points[1].opacity = 25;
	points[0].x_forward = .05;
	points[1].x_forward = -.08;
	points[0].freq_range = "total";
	points[1].freq_range = "total";
	points[0].colors = [85, 150, 85, 150, 0, 0];
	points[1].colors = [85, 150, 85, 150, 0, 0];
	points[0].loc_x = width / 2 - 70;
	points[0].loc_y = height / 2 - 30;	
	points[1].loc_x = points[0].loc_x + 70; 
	points[1].loc_y = points[0].loc_y + 10;

	// take the fast fourier transform
	fft = new p5.FFT();
	fft.smooth(.9);
	
	// load the sound and start playing
	mySound.setLoop(true);
	mySound.setVolume(1.0);
	mySound.play();

	// use length of song to create break points
	var total_song = 1015
	break_points = []
	for (var i = 0; i < n_points; i++) {
		break_points.push(Math.floor(i * total_song / n_points)); 
	}
	current_time = break_points[0]; // track current point in the break
}


function draw() {
	
	// check if a time point has past and then increase the global counter
	if (mySound.currentTime() > current_time) {
		current_time = break_points.shift();
		if (i_global < points.length) {
	  		i_global++;
	  	}
	}

	// reset background for fade effect
	background(0, 0, 0, 7);

	// analyze the sound
  	var level = amplitude.getLevel();
	var spectrum = fft.analyze();
	var energy = fft.getEnergy(20, 20000);
	var energy_division = [fft.getEnergy("bass"), 
		fft.getEnergy("lowMid"), 
		fft.getEnergy("mid"), 
		fft.getEnergy("highMid"), 
		fft.getEnergy("treble")]
	var centroid = fft.getCentroid();
	level = map(level, 0, 1, 0, 255);
	centroid = map(centroid, 0, 8000, 0, 255);


  	for (var i = 0; i < i_global; i++) {
  		// use total energy for the first two points
  		if (points[i].freq_range != "total") {
	  		energy = energy_division[energy_dict[points[i].freq_range]];
	  	}
  		points[i].draw_object(level, energy, centroid, 
  			Math.round(Math.random() * points[i].colors[0] + points[i].colors[1]), 
  			Math.round(Math.random() * points[i].colors[2] + points[i].colors[3]), 
  			Math.round(Math.random() * points[i].colors[4] + points[i].colors[5]));
  		points[i].update_locations(level, energy , centroid);
  	}
}