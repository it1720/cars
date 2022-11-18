var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = new Image();
background.src = "img/highway.jpg";
var pauseImg= new Image();
pauseImg.src="img/pause.png";
var carImg = new Image();
var cloudImg = new Image();
var hillImg = new Image();
var gameover=false;
var highscore=0;
var cloudSpeed=10;
var speed=20;
var score=0;
var setStart=true;
//pomocná
var audioAuxiliary=0;
var gameoverAudio = new Audio('sound/Peter Griffin Laugh.mp3');
//pomocné proměnné
var scoreAuxiliary=0;
var pauseAuxiliary=0;

var cursor = {
  x: 0,
  y: 400,
  width: 130,
  height: 65,
  direction: "up",
  fillStyle: "rgba(255,255,255,0)",
  image: new Image(),
  src: "img/car-red.png",
  paint: function() {
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.image.src = "img/car-red.png";
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  },
  animates: function(){
    if(this.direction=="up"&&this.y>400) this.y-=speed;
    if(this.direction=="down"&&this.y<520) this.y+=speed;
    if(this.y>520)this.y=520;
    if(this.y<400)this.y=400;
  },
  move: function(event) {
    switch (event.code) {
      case "ArrowUp":if(pauseAuxiliary==0)this.direction='up';
        break;
      case "ArrowDown":if(pauseAuxiliary==0)this.direction='down';
        break;
      case "Space":if (this.direction=='up'&&pauseAuxiliary==0) this.direction='down';
      else if(this.direction=='down'&&pauseAuxiliary==0) this.direction='up';
        break;
      case "KeyW":if(pauseAuxiliary==0)this.direction='up';
        break;
      case "KeyS":if(pauseAuxiliary==0)this.direction='down';
        break;
      //pauza  
      case "Escape":if(gameover==false)pauseAuxiliary=1;  
      break;
      //odpauzování
      case "Enter":if(gameover==false)pauseAuxiliary=0;
        if(gameover==true)buttonPress();  
      break;
  } 
  },
  //kolize
  detect: function(mX, mY) {
    if ((mX >= this.x-this.width+10) && (mX <= this.x + this.width)&& (mY >= this.y - this.height+10) && (mY <= this.y + this.height)) 
      return true;
    else
      return false;  
  }
};
var mouse={
  x:0,
  y:0
};
var cloud={
  mx:120,
  my:50,
  x:800,
  y:50,
  width:400,
  height:280,
  image:new Image(),
  src:"img/cloud.png",
paintCloud: function(){
  this.image.src="img/cloud.png";
  ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  ctx.drawImage(this.image,this.mx,this.my,this.width,this.height);
  this.spawnCloud();
},
animateCloud: function(){
  this.x-=cloudSpeed;
  this.mx-=cloudSpeed;
},
spawnCloud: function(){
  var q=Math.floor(Math.random()*2)
  if(this.x<-this.width&&q==1){
    this.x=800;
    this.y=50;
  }
  if(this.mx<-this.width&&q==0){
    this.mx=800;
    this.my=50;
  }
}
};
var hill={
  x:0,
  y:189,
  mx:800,
  my:189,
  width:800,
  height:200,
  image:new Image(),
  src:"img/hill.png",
paintHill: function(){
  this.image.src="img/hill.png";
  ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  ctx.drawImage(this.image,this.mx,this.my,this.width,this.height);
  this.spawnHill();
},
animateHill: function(){
  this.x-=cloudSpeed;
  this.mx-=cloudSpeed;
},
spawnHill: function(){
  if(this.x<=-this.width){
    this.x=800;
    this.y=189;
  }
  if(this.mx<=-this.width){
  this.mx=800;
    this.my=189;
  }
}};
var car= {
  x : 800,
  y : 400,
  width: 130,
  height: 65,
  image: new Image(),
  src: "img/car-black.png",
  color:"black",
paints: function(){
  this.spawn();
  this.image.src = "img/car-"+this.color+".png";
  ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  },
animate: function() {
  this.x-=speed;
},
spawn: function(){
  if(this.x<-this.width){
    scoreAuxiliary=1;
    score++;
    this.randomCar();
    //náhodná pozice aut
    var a=Math.floor(Math.random()*2);
  if(a==0){
    this.x=800;
    this.y=400;
  }
  else{
    this.x=800;
    this.y=520;
  }
}
},
randomCar: function() {
  //náhodné barvy auta
  var a=Math.floor(Math.random()*5)
  if (a==0) this.color="black";
  if (a==1) this.color="blue";
  if (a==2) this.color="brown";
  if (a==3) this.color="green";
  if (a==4) this.color="yellow";
}};
function clearCanvas(fillColor, borderColor) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.style.border = "5px solid " + borderColor;
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(carImg,car.x,car.y,car.width, car.height);
  ctx.drawImage(hillImg,hill.x,hill.y,hill.width, hill.height);
  ctx.drawImage(hillImg,hill.mx,hill.my,hill.width, hill.height);
  ctx.drawImage(cloudImg,cloud.x,cloud.y,cloud.width, cloud.height);
  ctx.drawImage(cloudImg,cloud.mx,cloud.my,cloud.width, cloud.height);
  ctx.drawImage(pauseImg,774,3,23,23);
}
function paint() {
  clearCanvas("white", "black");
  cloud.paintCloud();
  hill.paintHill();
  car.paints();
  cursor.paint();
  setScore(score);     
}
document.addEventListener("keydown", function(event) {
  cursor.move(event);
  //kdy vykreslovat
  if(gameover==false&&pauseAuxiliary==0&&setStart==false)
  paint();
});
function text(txt,fnt,x,y,c){
  ctx.fillStyle=c;
  ctx.font=fnt;
  ctx.fillText(txt,x,y);
}
function buttonPress(){
  //reset
    gameover=false;
    car.x=800;
    car.y=400;
    cursor.y=400;
    cursor.direction="up";
    speed=20;
    if(score>highscore)highscore=score;
    score=0;
}
canvas.addEventListener("click", function(event) {
  mouse.x=event.offsetX;
  mouse.y=event.offsetY;
  onclick();
});
function onclick(){
  //pause button
  if(gameover==false&&setStart==false)
  if(mouse.x>=774&&mouse.x<=797&&mouse.y>=3&&mouse.y<=26)
  pauseAuxiliary=1;
  //play again button
  if(gameover==true)
  if(mouse.x>=220&&mouse.x<=580&&mouse.y>=285&&mouse.y<=375)
    buttonPress();
  //start button  
  if(gameover==false&&setStart==true)
  if(mouse.x>=150&&mouse.x<=770&&mouse.y>=235&&mouse.y<=365){
    buttonPress();
    setStart=false;
  }
  //reset mouse position
  mouse.x=0;
  mouse.y=0;
}
function pause(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  setScore(score);
  ctx.textAlign = "center";
  text('Pause','90px Comic Sans MS',400,280,'white');
  text('Press ENTER for resume','35px Comic Sans MS',400,370,'white');
}
function playAgain(){
    if(audioAuxiliary==0){
    gameoverAudio.play();
    audioAuxiliary=1;
  }
    ctx.fillStyle='black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='red';
    ctx.fillRect(220,285,360,90);
    text('Game over','100px Comic Sans MS',400,225,'white');
    text('Play again','75px Comic Sans MS',400,350,'white');
    setScore(score);
}
function start(){
  ctx.fillStyle='black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  canvas.style.border = "5px solid black";
  ctx.fillStyle='red';
  ctx.fillRect(150,235,520,130);
  ctx.textAlign = "center";
  text('START','150px Comic Sans MS',400,350,'white');
}
function setScore(score){
  //vypsání nul u skore
  ctx.textAlign="center";
  if(score<10) return text('Score: 00'+score+' High score: '+highscore,'20px Comic Sans MS',125,25,'white');
  if(score<100&&score>=10) return text('Score: 0'+score+' High score: '+highscore,'20px Comic Sans MS',125,25,'white');
  if(score>=100) return text('Score: '+score+' High score: '+highscore,'20px Comic Sans MS',125,25,'white');
}
var interval=setInterval(function() {
  //play
  if (gameover==false&&setStart==false){
    audioAuxiliary=0; 
  if(pauseAuxiliary==0){
  hill.animateHill();
  cloud.animateCloud();
  car.animate();
  cursor.animates();
  paint();
  if(score%2==0&&scoreAuxiliary==1){ 
    speed++;
    scoreAuxiliary=0;
  }
  if (cursor.detect(car.x, car.y))gameover=true;
}
if(pauseAuxiliary==1)pause();
}
//game over
if(gameover==true&&setStart==false)playAgain();
//start game
if(gameover==false&&setStart==true)start();  
}, 40);