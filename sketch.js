var girl, girl_running, girl_jumping;
var slidingGirl, slidingGirlImg, treeG;
var coin, coinImg;
var obstacle, obstacleImg;
var ghost, ghostImg;
var arrow, arrowImg2, arrowImg3, arrowG;
var wallpaper, wallpaperImg;
var rn;
var invisibleGround;
var score = 0;
var coinG, obstacleG, ghostG, arrowG;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var distance = 0;
var killSound, gameOverSound, pointSound, arrowSound, jumpSound;
var tree, treeImg;

function preload() {
  //loading image for ghost
  ghostImg = loadImage("ghost-jumping.png");
  
  //loading image for background
  wallpaperImg = loadImage("wallpaper (2).png");
  
  //loading image for coin
  coinImg = loadImage("coin.png");
  
  //loading girl running animation
  girl_running = loadAnimation("girl1.png","girl2.png","girl3.png","girl4.png");
  girl_jumping = loadAnimation("girl-jumping.png");
  
  //loading tombstone img
  obstacleImg = loadImage("tomb.png");
  
  //loading arrows of different directions
  arrowImg2 = loadAnimation("arrow2.png");
  arrowImg3 = loadAnimation("arrow3.png");
  
  //loading the sound
  killSound = loadSound("kill.wav");
  gameOverSound = loadSound("gameOver.wav");
  pointSound = loadSound("point.wav");
  arrowSound = loadSound("arrow.mp3");
  jumpSound = loadSound("jump.mp3");
  
  //loading tree image
  treeImg = loadImage("tree2.png");
  
  //loading sliding girl image
  slidingGirlImg = loadAnimation("girl-sliding.png");
}

function setup() {
  createCanvas(400, 400);
  
  //creating background
  wallpaper = createSprite(200,-5);
  wallpaper.addImage(wallpaperImg);
  wallpaper.scale = 1.85;
  
  //creating invisible ground on which the boy will run
  invisibleGround = createSprite(200,350,400,3);
  invisibleGround.visible = false;
  
  //creating girl
  girl = createSprite(50,320,30,30);
  girl.addAnimation("GirlRunning", girl_running);
  girl.addAnimation("GirlJumping", girl_jumping);
  girl.scale = 0.5;
  girl.setCollider("rectangle", 0 ,0 , 200 ,200);
 
  //creating groups
  coinG = new Group();
  obstacleG = new Group();
  ghostG = new Group();
  arrowG = new Group();
  treeG = new Group();
}

function draw() {
  background("black");
  
  //determining conditions if gameState is play
  if(gameState === PLAY){

    //making girl visible
    girl.visible = true;

    //calling in right and top arrows
    if (keyWentDown(RIGHT_ARROW)){
      rightDefense();
      arrowSound.play();
    }
    if (keyWentDown(UP_ARROW)){
      upDefense();
      arrowSound.play();
    }
    
    //calculating distance
    distance = distance + (getFrameRate()/60);
    
    //giving velocity to background
    wallpaper.velocityX = - 6;
     
    //creating an infinite background
    if(wallpaper.x<0){
      wallpaper.x = wallpaper.width/2;
    }

    //displaying ghost in ech 350 frames
    villain();

    //displaying coin in each 160 frames
    prize();

    //displaying tombstone in each 250 frames
    tombstone();
    
    //displaying trees in each 200 frames
    trees();

    //making girl jump when space is pressed and changing its animation
    if(keyDown("space")&& girl.y>280){
      girl.changeAnimation("GirlJumping", girl_jumping);
      girl.velocityY = -15;
      jumpSound.play();
    } 

    //creating sliding girl when s is pressed
    if(keyWentDown("s") || frameCount === 2) {
      slidingGirl = createSprite(girl.x,330);
      slidingGirl.addAnimation("GirlSliding", slidingGirlImg);
      slidingGirl.scale = 0.5;
      girl.visible = false;
      girl.y = 500;

    } else if(keyWentUp("s") || frameCount === 3) {
      girl.y = 320;
      slidingGirl.lifetime = 1;
    }
    
    //resetting its animation when it isn't jumping
    if(girl.isTouching(invisibleGround)){
      girl.changeAnimation("GirlRunning", girl_running);
    }

    //giving gravity to the girl
    girl.velocityY = girl.velocityY + 0.8;

    //increasing the score if the girl collects a coin
    if(coinG.isTouching(girl)){
      coinG.destroyEach();
      score = score + 1;
      pointSound.play();
    }
    if(coinG.isTouching(slidingGirl)){
      coinG.destroyEach();
      score = score + 1;
      pointSound.play();
    }
    
    //detroying arrow and ghost if arrow touches ghost
    if(arrowG.isTouching(ghostG)){
      ghostG.destroyEach();
      arrowG.destroyEach();
      killSound.play();
    }
    
    //going to gameState end when the ghost caught the girl or she hit the tombstone 
    if(ghostG.isTouching(girl) || obstacleG.isTouching(girl) || treeG.isTouching(girl)) {
      gameState = END;
      gameOverSound.play();
    }
    if(ghostG.isTouching(slidingGirl) || obstacleG.isTouching(slidingGirl)) {
      gameState = END;
      gameOverSound.play();
    }
  }
  
  
  //determining conditions when gameState is END
  if(gameState === END){
    //making the wallpaper invisible
    wallpaper.visible = false;
    
    //destroying the sprites and setting their velocity to 0
    obstacleG.destroyEach();
    obstacleG.setVelocityXEach(0);
    
    coinG.destroyEach();
    coinG.setVelocityXEach(0);
    
    ghostG.destroyEach();
    ghostG.setVelocityXEach(0);
    ghostG.setVelocityYEach(0);
    
    treeG.destroyEach();
    treeG.setVelocityXEach(0);
    
    //making girl invisible
    girl.visible = false;
    slidingGirl.visible = false;
    
    //resetting the game if R is pressed
    if(keyDown("R")){
      reset();
    }
  }
  
  //this is done so that the girl doesn't fall
  girl.collide(invisibleGround);
  
  drawSprites();
  
  //displaying points when the game is goung on
  if (wallpaper.visible === true){
    fill("Black");
    textSize(15);
    text("Points : " + score,300,20);
    
    //displaying text when game has ended
  } else{
    fill("Red");
    textSize(20);
    text("The Ghost Caught You!",100,200);
    text("Press 'R' if you dare to escape him again...",10, 230);
  }
  
}

function reset(){
  
  //So the obstacles come after some time
  frameCount = 0;
  
  //going back to gameState = PLAY
  gameState = PLAY;
  
  //setting score to 0
  score = 0;
  
  //resetting distance
  distance = 0;
  
  //resetting girls position
  girl.x = 50;
  girl.y = 320;
  
  //making the sprites visible
  girl.visible = true;
  wallpaper.visible = true;
  
  
}
function villain() {
  //creating ghost
  if(frameCount%350 === 0) {
    ghost = createSprite(200,200);
    ghost.addImage(ghostImg);
    ghost.scale = 0.3;
    
    //giving lifetime to it
    ghost.Lifetime = 200;
    
    //creating its collider so it doesn;t collide with the sprites before expected
    ghost.setCollider("rectangle", 0 ,0, 300, ghost.height);
    
    //giving the position and velocity of ghost randomly
    var position = Math.round(random(1,2));
    if(position === 1) {
        ghost.x = 405;
        ghost.y = 290;
        ghost.velocityX = - (6 + distance/100) ;
        ghost.velocityY = 0;
    } else{
        ghost.x = 50;
        ghost.y = 0;
        ghost.velocityY = (6 + distance/100);
        ghost.velocityX = 0;
    }

    //adding variable to group
    ghostG.add(ghost);
  }
  
}

function prize() {
  //creating coin
  if(frameCount%160 === 0){
    coin = createSprite(405,320);
    coin.addImage(coinImg);
    coin.scale = 0.05;
    
    //gradually increasing velocity
    coin.velocityX = - (6 + distance/100);
    
    //giving lifetime
    coin.Lifetime = 70;
    
    //creating its collider so it doesn;t collide with the sprites before expected
    coin.setCollider("rectangle", 0, 0, coin.width, coin.height);
    
    //adding variable to group
    coinG.add(coin);
  }  
}

function tombstone() {
  if(frameCount%250 === 0){
    //creating obstacle
    obstacle = createSprite(405,325);
    obstacle.addImage(obstacleImg);
    obstacle.scale = 0.095;
    
    //gradually increasing velocity
    obstacle.velocityX = - (6 + distance/100);
    
    //giving lifetime
    obstacle.lifetime = 70;
    
    //creating its collider so it doesn;t collide with the sprites before expected
    obstacle.setCollider("rectangle", 0 ,0 ,obstacle.width, obstacle.height)
    
    //adding variable to group
    obstacleG.add(obstacle); 
  }
}

function rightDefense() {
  //creating right arrow
  arrow2 = createSprite(50,290);
  arrow2.addAnimation("R_arrow",arrowImg3);
  
  //gradually increasing velocity
  arrow2.velocityX = 6 + distance/100;
  
  arrow2.scale = 0.5;
  
  //giving lifetime
  arrow2.Lifetime = 70;
  
  //creating its collider so it doesn;t collide with the sprites before expected
  arrow2.setCollider("rectangle", 0, 0, 300, 50);
  
  //adding variable to group
  arrowG.add(arrow2);
}

function upDefense() {
   //creating up arrow
  arrow3 = createSprite(50,290);
  arrow3.addAnimation("U_arrow",arrowImg2);
  
  //gradually increasing velocity
  arrow3.velocityY = - (6 + distance/100);
  
  arrow3.scale = 0.5;
  
  //giving lifetime
  arrow3.Lifetime = 70;
  
  //creating its collider so it doesn;t collide with the sprites before expected
  arrow3.setCollider("rectangle", 0, 0, 50, 300);
  
  //adding variable to group
  arrowG.add(arrow3);
}

function trees() {
  //creating trees
  if(frameCount%200 === 0){
      tree = createSprite(405,100);
      tree.addImage(treeImg);
      tree.scale = 0.3
    
      //giving velocity
      tree.velocityX =- (6 + distance/100);
    
      //creating collider
      tree.setCollider("rectangle", 0, 0, 100, 1000);
    
      //adding variable to group
      treeG.add(tree);
    }
}