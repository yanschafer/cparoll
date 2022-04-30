import * as PIXI from "https://cdn.skypack.dev/pixi.js";
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";

// return a random number within a range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Create a new simplex noise instance
const simplex = new SimplexNoise();

// ColorPalette class
class ColorPalette {
    constructor() {
        this.setColors();
        this.setCustomProperties();
    }

    setColors() {
        // pick a random hue somewhere between 220 and 360
        this.hue = 150;
        this.complimentaryHue1 = this.hue + 30;
        this.complimentaryHue2 = this.hue + 60;
        // define a fixed saturation and lightness
        this.saturation = 95;
        this.lightness = 50;

        // define a base color
        this.baseColor = hsl(this.hue, 100, 50);
        // define a complimentary color, 30 degress away from the base
        this.complimentaryColor1 = hsl(
            this.complimentaryHue1,
            this.saturation,
            this.lightness
        );
        // define a second complimentary color, 60 degrees away from the base
        this.complimentaryColor2 = hsl(
            239,
            82,
            65
        );

        // store the color choices in an array so that a random one can be picked later
        this.colorChoices = [
            this.baseColor,
            this.complimentaryColor2,
            this.complimentaryColor1,
        ];
    }

    randomColor(type = 0) {
        console.log(type)
        console.log(this.colorChoices[type])
        // pick a random color
        return this.colorChoices[type].replace("#", "0x");
    }

    setCustomProperties() {
        // set CSS custom properties so that the colors defined here can be used throughout the UI
        document.documentElement.style.setProperty("--hue", this.hue);
        document.documentElement.style.setProperty(
            "--hue-complimentary1",
            this.complimentaryHue1
        );
        document.documentElement.style.setProperty(
            "--hue-complimentary2",
            this.complimentaryHue2
        );
    }
}

// Orb class
class Orb {
    // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
    constructor(fill = 0x000000, x, y) {
        // bounds = the area an orb is "allowed" to move within
        this.bounds = this.setBounds();
        // initialise the orb's { x, y } values to a random point within it's bounds
        this.x = x;
        this.y = y;

        // how large the orb is vs it's original radius (this will modulate over time)
        this.scale = 1;

        // what color is the orb?
        this.fill = fill;

        // the original radius of the orb, set relative to window height
        this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

        // starting points in "time" for the noise/self similar random values
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        // how quickly the noise/self similar random values step through time
        this.inc = 0.002;

        // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
        this.graphics = new PIXI.Graphics();
        this.graphics.alpha = 0.825;

        // 250ms after the last window resize event, recalculate orb positions.
        window.addEventListener(
            "resize",
            debounce(() => {
                this.bounds = this.setBounds();
            }, 250)
        );
    }

    setBounds() {
        // how far from the { x, y } origin can each orb move
        const maxDist =
            window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
        // the { x, y } origin for each orb (the bottom right of the screen)
        const originX = window.innerWidth / 1.7;
        const originY =
            window.innerWidth < 1000
                ? window.innerHeight * 0.3
                : window.innerHeight * 0.3;

        // allow each orb to move x distance away from it's x / y origin
        return {
            x: {
                min: originX - maxDist,
                max: originX + maxDist
            },
            y: {
                min: originY - maxDist,
                max: originY + maxDist
            }
        };
    }

    update() {
        // self similar "psuedo-random" or noise values at a given point in "time"
        const xNoise = simplex.noise2D(this.xOff, this.xOff);
        const yNoise = simplex.noise2D(this.yOff, this.yOff);
        const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

        // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
        this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
        this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
        // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
        this.scale = map(scaleNoise, -1, 1, 0.5, 1);

        // step through "time"
        this.xOff += this.inc;
        this.yOff += this.inc;
    }

    render() {
        // update the PIXI.Graphics position and scale values
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);

        // clear anything currently drawn to graphics
        this.graphics.clear();

        // tell graphics to fill any shapes drawn after this with the orb's fill color
        this.graphics.beginFill(this.fill);
        // draw a circle at { 0, 0 } with it's size set by this.radius
        this.graphics.drawCircle(0, 0, this.radius);
        // let graphics know we won't be filling in any more shapes
        this.graphics.endFill();
    }
}
class OrbGreen {
    // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
    constructor(fill = 0x000000, x, y) {
        // bounds = the area an orb is "allowed" to move within
        this.bounds = this.setBounds();
        // initialise the orb's { x, y } values to a random point within it's bounds
        this.x = x;
        this.y = y;

        // how large the orb is vs it's original radius (this will modulate over time)
        this.scale = 1;

        // what color is the orb?
        this.fill = fill;

        // the original radius of the orb, set relative to window height
        this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

        // starting points in "time" for the noise/self similar random values
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        // how quickly the noise/self similar random values step through time
        this.inc = 0.002;

        // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
        this.graphics = new PIXI.Graphics();
        this.graphics.alpha = 0.825;

        // 250ms after the last window resize event, recalculate orb positions.
        window.addEventListener(
            "resize",
            debounce(() => {
                this.bounds = this.setBounds();
            }, 250)
        );
    }

    setBounds() {
        // how far from the { x, y } origin can each orb move
        const maxDist =
            window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
        // the { x, y } origin for each orb (the bottom right of the screen)
        const originX = window.innerWidth * 0.2;
        const originY =
            window.innerWidth < 1000
                ? window.innerHeight * 0.7
                : window.innerHeight * 0.7;

        // allow each orb to move x distance away from it's x / y origin
        return {
            x: {
                min: originX - maxDist,
                max: originX + maxDist
            },
            y: {
                min: originY - maxDist,
                max: originY + maxDist
            }
        };
    }

    update() {
        // self similar "psuedo-random" or noise values at a given point in "time"
        const xNoise = simplex.noise2D(this.xOff, this.xOff);
        const yNoise = simplex.noise2D(this.yOff, this.yOff);
        const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

        // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
        this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
        this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
        // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
        this.scale = map(scaleNoise, -1, 1, 0.5, 1);

        // step through "time"
        this.xOff += this.inc;
        this.yOff += this.inc;
    }

    render() {
        // update the PIXI.Graphics position and scale values
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);

        // clear anything currently drawn to graphics
        this.graphics.clear();

        // tell graphics to fill any shapes drawn after this with the orb's fill color
        this.graphics.beginFill(this.fill);
        // draw a circle at { 0, 0 } with it's size set by this.radius
        this.graphics.drawCircle(0, 0, this.radius);
        // let graphics know we won't be filling in any more shapes
        this.graphics.endFill();
    }
}
class OrbLeft {
    // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
    constructor(fill = 0x000000, x, y) {
        // bounds = the area an orb is "allowed" to move within
        this.bounds = this.setBounds();
        // initialise the orb's { x, y } values to a random point within it's bounds
        this.x = x;
        this.y = y;

        // how large the orb is vs it's original radius (this will modulate over time)
        this.scale = 1;

        // what color is the orb?
        this.fill = fill;

        // the original radius of the orb, set relative to window height
        this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

        // starting points in "time" for the noise/self similar random values
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        // how quickly the noise/self similar random values step through time
        this.inc = 0.002;

        // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
        this.graphics = new PIXI.Graphics();
        this.graphics.alpha = 0.825;

        // 250ms after the last window resize event, recalculate orb positions.
        window.addEventListener(
            "resize",
            debounce(() => {
                this.bounds = this.setBounds();
            }, 250)
        );
    }

    setBounds() {
        // how far from the { x, y } origin can each orb move
        const maxDist =
            window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
        // the { x, y } origin for each orb (the bottom right of the screen)
        const originX = 30;
        const originY =
            window.innerWidth < 1000
                ? window.innerHeight
                : window.innerHeight * 0.4;

        // allow each orb to move x distance away from it's x / y origin
        return {
            x: {
                min: originX - maxDist,
                max: originX + maxDist
            },
            y: {
                min: originY - maxDist,
                max: originY + maxDist
            }
        };
    }

    update() {
        // self similar "psuedo-random" or noise values at a given point in "time"
        const xNoise = simplex.noise2D(this.xOff, this.xOff);
        const yNoise = simplex.noise2D(this.yOff, this.yOff);
        const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

        // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
        this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
        this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
        // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
        this.scale = map(scaleNoise, -1, 1, 0.5, 1);

        // step through "time"
        this.xOff += this.inc;
        this.yOff += this.inc;
    }

    render() {
        // update the PIXI.Graphics position and scale values
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);

        // clear anything currently drawn to graphics
        this.graphics.clear();

        // tell graphics to fill any shapes drawn after this with the orb's fill color
        this.graphics.beginFill(this.fill);
        // draw a circle at { 0, 0 } with it's size set by this.radius
        this.graphics.drawCircle(0, 0, this.radius);
        // let graphics know we won't be filling in any more shapes
        this.graphics.endFill();
    }
}
class OrbLeftDown {
    // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
    constructor(fill = 0x000000, x, y) {
        // bounds = the area an orb is "allowed" to move within
        this.bounds = this.setBounds();
        // initialise the orb's { x, y } values to a random point within it's bounds
        this.x = x;
        this.y = y;

        // how large the orb is vs it's original radius (this will modulate over time)
        this.scale = 1;

        // what color is the orb?
        this.fill = fill;

        // the original radius of the orb, set relative to window height
        this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

        // starting points in "time" for the noise/self similar random values
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        // how quickly the noise/self similar random values step through time
        this.inc = 0.002;

        // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
        this.graphics = new PIXI.Graphics();
        this.graphics.alpha = 0.825;

        // 250ms after the last window resize event, recalculate orb positions.
        window.addEventListener(
            "resize",
            debounce(() => {
                this.bounds = this.setBounds();
            }, 250)
        );
    }

    setBounds() {
        // how far from the { x, y } origin can each orb move
        const maxDist =
            window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
        // the { x, y } origin for each orb (the bottom right of the screen)
        const originX =  window.innerWidth ;
        const originY =
            window.innerWidth < 1000
                ? window.innerHeight
                : window.innerHeight / 1.175;

        // allow each orb to move x distance away from it's x / y origin
        return {
            x: {
                min: originX - maxDist,
                max: originX + maxDist
            },
            y: {
                min: originY - maxDist,
                max: originY + maxDist
            }
        };
    }

    update() {
        // self similar "psuedo-random" or noise values at a given point in "time"
        const xNoise = simplex.noise2D(this.xOff, this.xOff);
        const yNoise = simplex.noise2D(this.yOff, this.yOff);
        const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

        // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
        this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
        this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
        // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
        this.scale = map(scaleNoise, -1, 1, 0.5, 1);

        // step through "time"
        this.xOff += this.inc;
        this.yOff += this.inc;
    }

    render() {
        // update the PIXI.Graphics position and scale values
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);

        // clear anything currently drawn to graphics
        this.graphics.clear();

        // tell graphics to fill any shapes drawn after this with the orb's fill color
        this.graphics.beginFill(this.fill);
        // draw a circle at { 0, 0 } with it's size set by this.radius
        this.graphics.drawCircle(0, 0, this.radius);
        // let graphics know we won't be filling in any more shapes
        this.graphics.endFill();
    }
}

// Create PixiJS app
const app = new PIXI.Application({
    // render to <canvas class="orb-canvas"></canvas>
    view: document.querySelector(".orb-canvas"),
    // auto adjust size to fit the current window
    resizeTo: window,
    // transparent background, we will be creating a gradient background later using CSS
    transparent: true
});

// Create colour palette
const colorPalette = new ColorPalette();

app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

// Create orbs
const orbs = [];

for (let i = 0; i < 2; i++) {
    const orb = new Orb(colorPalette.randomColor(1), window.innerWidth - 200, 0);

    app.stage.addChild(orb.graphics);

    orbs.push(orb);
}
for (let i = 0; i < 2; i++) {
    const orb = new OrbGreen(colorPalette.randomColor(0), window.innerWidth - 200, 0);

    app.stage.addChild(orb.graphics);

    orbs.push(orb);
}

for (let i = 0; i < 4; i++) {
    const orb = new OrbLeft(colorPalette.randomColor(0), window.innerWidth - 200, 0);

    app.stage.addChild(orb.graphics);

    orbs.push(orb);
}

for (let i = 0; i < 4; i++) {
    const orb = new OrbLeftDown(colorPalette.randomColor(0), window.innerWidth - 200, 0);

    app.stage.addChild(orb.graphics);

    orbs.push(orb);
}

// Animate!
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    app.ticker.add(() => {
        orbs.forEach((orb) => {
            orb.update();
            orb.render();
        });
    });
} else {
    orbs.forEach((orb) => {
        orb.update();
        orb.render();
    });
}

document
    .querySelector(".overlay__btn--colors")
    .addEventListener("click", () => {
        colorPalette.setColors();
        colorPalette.setCustomProperties();

        orbs.forEach((orb) => {
            orb.fill = colorPalette.randomColor();
        });
    });
