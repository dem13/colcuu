/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

'use strict';

const BACKGROUND_COLOR = new Color(0.976, 0.69, 0.176);

const screenSize = vec2(1200, 2400);
const levelSize = screenSize.scale(1 / cameraScale);
const fallItemSize = vec2(2.5, 2.5);
let fallingVelocity = vec2(0, -0.5);
let score = 0;
let maxGeneratingInterval = 1000;

class Basket extends EngineObject {
    constructor() {
        super(vec2(0, 0), vec2(3, 4));
        this.setCollision();
        this.mass = 0;
    }

    update() {
        this.pos.x = mousePos.x;
        this.pos.y = -levelSize.y / 2 + this.size.y + 5;
    }
}

class FallItem extends EngineObject {
    constructor(harmfull, pos) {
        pos = pos || vec2(randInt(-levelSize.x / 2, levelSize.x / 2), levelSize.y / 2 + fallItemSize.x);
        super(pos, fallItemSize);
        this.color = harmfull ? new Color(1, 0, 0) : new Color(0, 1, 0);
        this.velocity = fallingVelocity;
        this.setCollision();
        this.harmfull = harmfull;
    }

    collideWithObject(o) {
        if (o instanceof Basket) {
            const color = this.color;
            new ParticleEmitter(
                this.pos, 0,            // pos, angle
                this.size, .1, 200, PI, // emitSize, emitTime, emitRate, emiteCone
                0,                      // tileInfo
                color, color,           // colorStartA, colorStartB
                color.scale(1,0), color.scale(1,0), // colorEndA, colorEndB
                .2, .5, 1, .1, .1,  // time, sizeStart, sizeEnd, speed, angleSpeed
                .99, .95, .4, PI,   // damping, angleDamping, gravityScale, cone
                .1, .5, 0, 1        // fadeRate, randomness, collide, additive
            );
            
            if (this.harmfull) {
                alert("You're dead!");
                window.location.reload();
            } else {
                score++;
            }
        }
        this.destroy();
    }

    update() {
        if (this.pos.y < -levelSize.y * 2 - fallItemSize.y) {
            this.destroy();
        }
        super.update();
    }
}

function barage() {
    for(let i = -levelSize.x / 2; i < levelSize.x / 2; i+= fallItemSize.x + 0.5) {
        new FallItem(true, vec2(i, levelSize.y / 2 + fallItemSize.x));
    }
}

function generateFallItem() {
    new FallItem(randInt(0, 2)), randInt(0, 250)
    maxGeneratingInterval-= 10;
    return setTimeout(generateFallItem, randInt(0, maxGeneratingInterval));
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    setObjectMaxSpeed(10);
    setCanvasFixedSize(screenSize);
    new Basket;
    // setInterval(() => {
    //     const itemsAmount = randInt(0, 3);
    //     for(let i = 0; i < itemsAmount; i++) {
           
    //        setTimeout(() => new FallItem(randInt(0, 2)), randInt(0, 250)); 
    //     }
    //     fallingVelocity = fallingVelocity.add(vec2(0, -0.01));
    //     console.log(fallingVelocity.y);
    // }, 500);

    generateFallItem();

    if(window.location.hash == '#ryan') {
        setTimeout(() => barage(), 4500);
    }
    // called once after the engine starts up
    // setup the game
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    // called every frame at 60 frames per second
    // handle input and update the game state
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
    drawRect(vec2(0, 0), levelSize, BACKGROUND_COLOR);
    drawText(`Score: ${score}`, vec2(-levelSize.x / 2 + 6, levelSize.y / 2 - 4), 3);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);