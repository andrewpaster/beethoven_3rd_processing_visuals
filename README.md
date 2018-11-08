# Beethoven's 3rd Symphony Mvt One Visualized with Processing.js

This project uses the processing.js library to visualize Beethoven's 3rd
Symphony Mvt One. 

To see the results, go to this link:
[http://andrewpaster.com/computers_arts/processing.html](http://andrewpaster.com/computers_arts/processing.html)

# Files in this Repository
* processing.html - boilerplate code for processing.js CDN and loading sketch.js
* sketch.js - processing code for the visualization

# Getting Started

To get the project working on a local machine, do the following:
1. Obtain an mp3 or ogg file of Beethoven's 3rd Symphony Mvt One: Allegro 
con brio. You can find a creative commons version [here](https://imslp.org/wiki/Symphony_No.3%2C_Op.55_(Beethoven%2C_Ludwig_van)). Note that the sketch.js was tuned to work well with this file

2. Download the repository locally

3. Open the sketch.js file and change the file name in line 101 to match
the file name you downloaded.

4. Start a local web server inside the repository. For example, from the terminal, you can use the command `python3 -m http.server` to start a local
server with port 8000.

5. Open a web browser and point to http://0.0.0.0:8000/ where 8000 is the
server port opened in the previous step.

6. In the browser, open the sketch.js file.

7. Wait for the program to load, and enjoy!

# Prerequisites

No specific software installation is required other than a web browser. You will need to have a local server running on your machine in order to see the visualizations. The instructions for setting this up were explained under the **Getting Started** heading.

# Deployment

If you would like to deploy the visualization to the web, you'll need a web
server. You should upload the processing.html, sketch.js, and sound file to
the server.

# Built With
Processing.js