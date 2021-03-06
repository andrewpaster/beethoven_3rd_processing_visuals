// point object
class Point {
	constructor(loc_x, loc_y, w, h, rotation, speed, angle, opacity, x_forward, freq_range, colors, end_colors) {
		this.loc_x = loc_x;
		this.loc_y = loc_y;
		this.w = w;
		this.h = h;
		this.previous_loc = [];
		this.random_max = 1;
		this.random_min = -1;
		this.rotation = rotation;
		this.speed = speed;
		this.angle = angle; 
		this.line_x_length = 35;
		this.line_y_length = 0;
		this.x_forward = x_forward;
		this.opacity = opacity;
		this.freq_range = freq_range;
		this.colors = colors; // colors where object begins at start
		this.end_colors = end_colors // colors where object ends of animation
	}

	// updates the location and angle every time the draw function is called
	update_locations(energy, centroid) {

		// randomly move in the x direction with some given forward movement
		this.loc_x += Math.round(Math.random() * (this.random_max - this.random_min) + this.random_min) + Math.random() * this.x_forward 
		+ this.rotation * map(energy, 0, 255, 0, 1);

		// randomly move in the y direction
		this.loc_y += Math.round(Math.random() * (this.random_max - this.random_min)) + this.random_min + 
		this.rotation * map(energy, 0, 255, 0, 1);	
		
		// move object across screen when hittings borders
		this.loc_x = (this.loc_x + width) % width;
		this.loc_y = (this.loc_y + height) % height;

		// store previous locations
		this.previous_loc.push([this.loc_x, this.loc_y]);

		// don't keep more previous locations than necessary
		if (this.previous_loc.length >= 5) {
			this.previous_loc.shift();
		}

		// increase rotation based on energy
		this.angle += this.rotation * (map(energy, 0, 255, 0, Math.PI/360)  + map(mySound.currentTime(), 0, mySound.duration(), Math.PI/560, Math.PI/360));

	}

	// draw the object 
	draw_object(energy, centroid, fill_red, fill_green, fill_blue) {

		// slowly increase opacity as time goes on
		if (this.opacity < 95) {
			this.opacity += .005;
		}

		// fill and stroke for the arc
		fill(255, 255, 255 + Math.random() * -6 + 3, this.opacity);
		stroke(255, 255, 255, this.opacity);
		strokeWeight(1);

		var size = map(mySound.currentTime(), 0, mySound.duration(), 0, 25);
		arc(this.loc_x, this.loc_y, this.w + size, this.h + size, Math.random() * Math.PI, Math.PI);

		// set up for the lines
		var previous_location;
		var rand_multiplier = 40 * Math.random();
		var energy_multiplier = map(mySound.currentTime(), 0, mySound.duration(), 1, 3) * energy;

		// rotates the x and y coordinates using rotation matrix
		var x_length = Math.cos(this.angle) * this.line_x_length - Math.sin(this.angle) * this.line_y_length;
		var y_length = Math.sin(this.angle) * this.line_x_length + Math.cos(this.angle) * this.line_y_length;
		
		// draw lines for the object based on the amount of previous locations stored
		for (var p = 0; p < this.previous_loc.length; p++) {
			previous_location = this.previous_loc[p];
			fill(255, 255, centroid, centroid);

			stroke(fill_red, fill_green, fill_blue, this.opacity);
			strokeWeight(1);
			

			line(previous_location[0], previous_location[1], previous_location[0] + x_length * energy_multiplier / 25, 
				previous_location[1] + y_length * energy_multiplier / 25);
			line(previous_location[0], previous_location[1], previous_location[0] + x_length, 
				previous_location[1] - y_length * energy_multiplier / 50);
			line(previous_location[0], previous_location[1], previous_location[0] - x_length/2 * energy_multiplier / 50, 
				previous_location[1] + y_length*2);

		}

	}

}

// load the files
function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('beethoven.ogg');

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


	n_points = 30; // number of objects

	// for each point, assign rotation direction,
	// frequency and color
	frequencies = ["bass", "lowMid", "mid", "highMid", "treble"]

	for (var i = 0; i < n_points; i++) {
		if (i % 2 == 0) {
			rotation = 1;
		}
		else {
			rotation = -1;
		}
		
		frequency_range = Math.floor(Math.random() * 5);
		color_range = frequency_range;

		if (color_range == 0) {
			colors = [2, 12, 2, 127, 2, 69];
			end_colors = [2, 127, 2, 2, 2, 40];
		}
		else if (color_range == 1) {
			colors = [2, 101, 2, 255, 2, 177];
			end_colors = [2, 255, 2, 80, 2, 134];
		}
		else if (color_range == 2) {
			colors = [2, 24, 2, 255, 2, 138];
			end_colors = [2, 255, 2, 4, 2, 81];
		}
		else if (color_range == 3) {
			colors = [2, 50, 2, 127, 2, 88];
			end_colors = [2, 127, 2, 40, 2, 67];
		}
		else {
			colors = [2, 19, 2, 204, 2, 110];
			end_colors = [2, 204, 2, 3, 2, 65];
		}

		points.push(new Point(Math.random() * width, // x starting value on canvass
			Math.random() * height, // y starting value on canvass
			10, // arc width
			10, // arc height
			rotation, // rotate counter-clockwise (1) or clockwise (-1)
			Math.random() * .1, // rotation speed
			Math.random()*2*Math.PI, // rotation starting angle
			50, // starting opacity
			Math.random()*.1 - .1, // general x movement (forwards or backwards) 
			frequencies[frequency_range],  // frequency range represented by the object
			colors, // color of the object
			end_colors // color at end of animation
			));
	}

	// change point zero and one to tell more of a story
	points[0].opacity = 255;
	points[1].opacity = 255;
	points[0].x_forward = .05;
	points[1].x_forward = -.08;
	points[0].freq_range = "total";
	points[1].freq_range = "total";
	points[0].colors = [2, 237, 2, 237, 2, 147];
	points[1].colors = [4, 237, 4, 237, 4, 147];
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

}


function draw() {
	
	// analyze the sound
	var spectrum = fft.analyze();
	var energy = fft.getEnergy(20, 20000);
	var energy_factor = map(mySound.currentTime(), 0, mySound.duration(), 20, 3);
	var energy_division = [energy/energy_factor + fft.getEnergy("bass")/2, 
		energy/energy_factor + fft.getEnergy("lowMid")/2, 
		energy/energy_factor + fft.getEnergy("mid")/2, 
		energy/energy_factor + fft.getEnergy("highMid")*3, 
		energy/energy_factor + fft.getEnergy("treble")*3];
	var centroid = fft.getCentroid();
	centroid = map(centroid, 0, 8000, 0, 255);

	// reset background for fade effect
	background(
		map(mySound.currentTime(), 0, mySound.duration(), 255, 41), 
		map(mySound.currentTime(), 0, mySound.duration(), 255, 42), 
		map(mySound.currentTime(), 0, mySound.duration(), 255, 224), 
		map(energy, 10, 45, 80, 0));

  	for (var i = 0; i < n_points; i++) {
  		// use total energy for the first two points
  		if (points[i].freq_range != "total") {
	  		energy = energy_division[energy_dict[points[i].freq_range]];
	  	}
	  	points[i].opacity = map(energy, 0, 255, 0, 255);
  		points[i].draw_object(energy, centroid, 
  			Math.round(Math.random() * points[i].colors[0] * points[i].rotation + map(mySound.currentTime(), 0, mySound.duration(), points[i].colors[1], points[i].end_colors[1])), 
  			Math.round(Math.random() * points[i].colors[2] * points[i].rotation + map(mySound.currentTime(), 0, mySound.duration(), points[i].colors[3], points[i].end_colors[3])), 
  			Math.round(Math.random() * points[i].colors[4] * points[i].rotation + map(mySound.currentTime(), 0, mySound.duration(), points[i].colors[5], points[i].end_colors[5])));
  		points[i].update_locations(energy, centroid);
  	}
}