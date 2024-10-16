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
let generatingInterval = 1000;
let gameOver = false;

const welcomeField = [
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];


class Basket extends EngineObject {
    constructor() {
        super(vec2(0, 0), vec2(4, 4), tile(0, vec2(32)));
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
        super(pos, fallItemSize, tile(harmfull ? 1 : 2, vec2(32, 32)));
        this.velocity = fallingVelocity;
        this.setCollision();
        this.harmfull = harmfull;
        this.mas = 0;
    }

    collideWithObject(o) {
        if (o instanceof Basket) {
            const color = new Color(0, 0, 0.5);
            
            new ParticleEmitter(
                this.pos, 0,	//position, angle
                0,	// emitSize
                0.25,	// emitTime
                200,	// emitRate
                3.14,	// emitConeAngle
                0,	// tileIndex
                new Color(0, 0.933, 1, 1),	// colorStartA
                new Color(0.259, 0.816, 1, 1),	// colorStartB
                new Color(0, 0.165, 0.98, 0.5),	// colorEndA
                new Color(0, 0.031, 1, 0.5),	// colorEndB
                0.5,	// particleTime
                0.1,	// sizeStart
                1,	// sizeEnd
                0.1,	// speed
                0.05,	// angleSpeed
                1,	// damping
                1,	// angleDamping
                1,	// gravityScale
                3.14,	// particleConeAngle
                0.1,	// fadeRate
                0.5,	// randomness
                0,	// collideTiles
                0,	// additive
                1,	// randomColorLinear
            ); // particle emitter
            
            if (this.harmfull) {
                gameOver = true;
            } else {
                score++;
                this.destroy();
            }
        }
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

function drawFallItemField(field, harmfull = false) {
    const baseY = levelSize.y / 2 + fallItemSize.x + field.length * fallItemSize.y;
    const baseX = -levelSize.x / 2 + 1;
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            if (field[y][x]) {
                new FallItem(harmfull, vec2(baseX + x * fallItemSize.x, baseY - fallItemSize.y * y ));
            }
        }
    }
}

function generateFallItem() {
    new FallItem(randInt(0, 2)), randInt(0, 250)

    if (generatingInterval >= 300) {
        generatingInterval-= 10;
    }
    
    !gameOver && setTimeout(generateFallItem, randInt(0, generatingInterval));
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    setObjectMaxSpeed(10);
    setCanvasFixedSize(screenSize);
    new Basket;

    if(window.location.hash == '#ryan') {
        setTimeout(() => barage(), 10000);
    } else {
        setTimeout(() => drawFallItemField(welcomeField), 500);
    }
    
    setTimeout(() => generateFallItem(), 2000);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    drawRect(vec2(0, 0), levelSize, BACKGROUND_COLOR);
    drawText(`Score: ${score}`, vec2(-levelSize.x / 2 + 7, levelSize.y / 2 - 4), 3);
    if (gameOver) {
        drawText("Game Over!", cameraPos.scale(.5), 5, new Color(0, 0, 0));
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    if (gameOver) {
        setPaused(true);
    }   
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);