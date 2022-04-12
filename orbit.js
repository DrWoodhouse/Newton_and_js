

//set the height and width of the canvas we will be drawing on
var HEIGHT = 600;
var WIDTH = 600;
//for readability we have a variable storing the "origin" where the sun will live
var ORIGIN_X = WIDTH / 2;
var ORIGIN_Y = HEIGHT / 2;

//this was set after a little experimentation so that we have nice orbits that fit on the canvas.
var mass_of_sun = 100000;

//Set the height and width attibutes to the canvas element in the html DOM
document.getElementById("myCanvas").height = HEIGHT;
document.getElementById("myCanvas").width = WIDTH;

// The GO variable allows us to start/stop the animation.
var GO = false;

// This relates to the convas object we will work with.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Draw the sun!
ctx.beginPath();
ctx.arc(ORIGIN_X, ORIGIN_Y, 30, 0, 2 * Math.PI);
ctx.stroke();

// stops the animation
function stop() {
    GO = false;
    document.getElementById("start_button").disabled = false;
    document.getElementById("stop_button").disabled = true;
}

// Object representing the "earth"
const earth = {
    x: WIDTH * 0.75,
    y: HEIGHT / 2,
    dx: 0,
    dy: parseFloat(document.getElementById("velocity").value),
    mass: 1,
    //We keep a record of the path that the earth travels along so that we can draw the trajectory.
    path: [
        [this.x, this.y]
    ],
    //This function updates the html elements above the canvas on the webpage, showing key stats.
    update_dial: function(){
        document.getElementById("x_display").innerHTML = this.x.toPrecision(5);
        document.getElementById("y_display").innerHTML = this.y.toPrecision(5);
        document.getElementById("dx_display").innerHTML = this.dx.toPrecision(5);
        document.getElementById("dy_display").innerHTML = this.dy.toPrecision(5);
        document.getElementById("velocity").value = (Math.sqrt(this.dx ** 2 + this.dy ** 2)).toPrecision(5);
    },
    //The function that "moves" the earth over the given time period at the current velocity. Then the velocity is updated and the new values updated on the webpage. The unit of time here is seconds.
    move: function(time) {
        //We compute the new position of the earth.
        this.x += this.dx * time;
        this.y += this.dy * time;
        //This is the point at which we apply the inverse square law to compute the new velocities in the x and y direction.
        this.dx -= time * mass_of_sun * ((this.x - ORIGIN_X) / Math.pow((this.x - ORIGIN_X) ** 2 + (this.y - ORIGIN_Y) ** 2, 1.5)) / this.mass;
        this.dy -= time * mass_of_sun * ((this.y - ORIGIN_Y) / Math.pow((this.x - ORIGIN_X) ** 2 + (this.y - ORIGIN_Y) ** 2, 1.5)) / this.mass;
        this.path.push([this.x, this.y]);

        this.update_dial();
    },
    // this function will draw a circle at the position of the earth.
    plot: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
    },
    // plots the trajectory of the earth so far.
    plot_trajectory: function() {
        ctx.beginPath();
        for (let i = 0; i < this.path.length - 1; i++) {
            ctx.moveTo(this.path[i][0], this.path[i][1]);
            ctx.lineTo(this.path[i + 1][0], this.path[i + 1][1]);
            ctx.stroke();
        }
    },
    //If the animation is stopped, then the user can change the velocity, and this function will adjust the valaues of dx and dy accordingly. Then when the animation is restarted earth will set off at the new velocity.
    set_velocity: function(new_velocity) {
        var current_velocity = Math.sqrt((this.dx) ** 2 + (this.dy) ** 2);
        this.dx = this.dx * (new_velocity / current_velocity);
        this.dy = this.dy * (new_velocity / current_velocity);
    }
};

function start() {

    let id = null;
    
    // We work with time in discrete intervals of length INCREMENT, which is in milliseconds.
    var INCREMENT = parseFloat(document.getElementById("time_interval").value) * 1000;

    GO = true;
    earth.set_velocity(document.getElementById("velocity").value);
    document.getElementById("start_button").disabled = true;
    document.getElementById("stop_button").disabled = false;

    
    //This is the function which realizes the animation.
    //The function step is performed every INCREMENT milliseconds.
    id = setInterval(step, INCREMENT);

    function step() {
        if ( GO == false) {
            clearInterval(id);
        } else {
            //Clear the canvas
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            //Draw the sun!
            ctx.beginPath();
            ctx.arc(ORIGIN_X, ORIGIN_Y, 30, 0, 2 * Math.PI);
            ctx.stroke();
            //move the earth
            earth.move(INCREMENT / 1000.0);
            //draw the trajectory           
            earth.plot_trajectory();
            //draw the earth
            earth.plot();
        }
    }
}
