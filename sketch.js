var mario,mario_running ,bg,bgImage,brickGroup,brickImage,coinGroup,coinImage,coinScore = 0,coinSound,mario_collided,gameState = "PLAY"

function preload(){
mario_running = loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png","images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png")

bgImage = loadImage("images/bgnew.jpg")
brickImage = loadImage("images/brick.png")
coinSound = loadSound("sounds/coinSound.mp3")
coinImage = loadAnimation("images/con1.png","images/con2.png","images/con3.png","images/con4.png","images/con5.png","images/con6.png")
mushImage = loadAnimation("images/mush1.png","images/mush2.png","images/mush3.png","images/mush4.png","images/mush5.png","images/mush6.png")
turImage = loadAnimation("images/tur1.png","images/tur2.png","images/tur3.png","images/tur4.png","images/tur5.png")
dieSound = loadSound("sounds/dieSound.mp3")
mario_collided = loadAnimation("images/dead.png")
tur2Image = loadAnimation("images/tur1.png")
mush2Image = loadAnimation("images/mush1.png")
restartImage = loadImage('images/restart.png')
}

function setup() {
createCanvas(1400, 625);

// create background sprite
bg = createSprite(580,300)
bg.addImage(bgImage)
bg.scale = 0.5

// create mario sprite
mario = createSprite(200,584,20,50)
mario.addAnimation("running",mario_running)
mario.addAnimation("collided",mario_collided)
mario.scale = 0.3
mario.debug = true

// creating collision for mario
skyline = createSprite(200,0,400,10)
skyline.visible = false

// create ground sprite
ground = createSprite(200,590,400,10)
ground.visible = false

// creating groups
brickGroup = new Group()
coinGroup = new Group()
obsGroup = new Group()

// creating restart sprite
restart = createSprite(700,300) 
restart.addImage(restartImage)
restart.visible = false
}

function draw() {
    if(gameState === "PLAY"){

    // jump with space    
    if(keyDown("space")){
        mario.velocityY=-10
        
    }

    // gravity
    mario.velocityY=mario.velocityY+0.5


    // giving velocity to background 
    bg.velocityX=-6

    // repeating background
    if(bg.x<500){
        bg.x = bg.width/4
    }

    // call the function to generatebricks
    generateBricks()

    // make mario collide on bricks
    for(var i=0; i<(brickGroup).length; i++){
        var temp=brickGroup.get(i);

        if(temp.isTouching(mario)){
            mario.collide(temp)
        }
    }

    // prevent mario from moving out with the bricks 
    if(mario.x<200){
        mario.x=200
    }

    mario.setCollider("rectangle",0,0,200,500)

    // prevent mario to go in sky
    mario.collide(skyline)

    // call the function to generate coins
    generateCoins()

    // make mario catch the coins 
    for(var i=0; i<(coinGroup).length; i++){
        var temp=coinGroup.get(i);
        if(temp.isTouching(mario)){
            // play sound when mario touches coins
            coinSound.play()
            // destroys coins when mario touches coins
            temp.destroy()
            // increase the score when mario touches coins
            coinScore++
        }
    }

    // call the function to generate obstacle
    generateObs()


    if(mario.isTouching(obsGroup)){
        gameState = "END"

    }

    }
    else if(gameState === "END"){
        bg.velocityX = 0
        mario.velocityY = 0
        mario.velocityX = 0
        obsGroup.setVelocityXEach(0)
        coinGroup.setVelocityXEach(0)
        brickGroup.setVelocityXEach(0)
        obsGroup.setLifetimeEach(-1)
        brickGroup.setLifetimeEach(-1)
        coinGroup.setLifetimeEach(-1)
        mario.changeAnimation("collided",mario_collided)
        mario.y = 570
        mario.setCollider("rectangle",0,0,300,100)
        restart.visible = true

    }

    //callback restart function
    if(mousePressedOver(restart)){
        restartGame()
    }
    // mario collide with ground 
    mario.collide(ground)


    drawSprites()    
    textSize(20)
    fill("red")
    text("Coin Collected"+coinScore,500,50)

}

// creating brick function
function generateBricks(){
    if(frameCount % 70 === 0){
        var brick = createSprite(1200,120,40,10)
        brick.y = random(50,450)
        brick.addImage(brickImage)
        brick.velocityX=-5
        brick.scale=0.5
        brick.lifetime=250
        brickGroup.add(brick)
    }
}

// creating coin function
function generateCoins(){
    if(frameCount % 50 === 0){
        var coin = createSprite(1200,120,40,10)
        coin.y = random(80,350)
        coin.velocityX = -3
        coin.addAnimation("coin",coinImage)
        coin.scale = 0.1
        coin.lifetime = 1000
        coinGroup.add(coin)
    }
}

// crteating obstacle functioin
function generateObs(){
    if(frameCount % Math.round(random(150,200)) === 0){
        var obs = createSprite(1200,540,10,40)
        obs.velocityX = -3
        obs.scale = 0.2
        var r  = Math.round(random(1,2))
        switch(r){
            case 1:
                obs.addAnimation("mush",mushImage)
                break
            case 2:
                obs.addAnimation("tur",turImage)
                break
            default:
                break        
        }
        obs.lifetime = 500
        obsGroup.add(obs)
    }
}

// creating restart function
function restartGame(){
    gameState = "PLAY"
    obsGroup.destroyEach()
    brickGroup.destroyEach()
    coinGroup.destroyEach()
    mario.changeAnimation("running",mario_running)
    coinScore = 0
    restart.visible = false
}

