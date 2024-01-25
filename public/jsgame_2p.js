let top_score = 5;
let player1_score=0;
let player2_score=0;

let player1_name = prompt("Enter Player 1 Name");
let player2_name = prompt("Enter Player 2 Name");

if(player1_name==""){
    player1_name = "Player1";
}

if(player2_name==""){
    player2_name = "Player2";
}

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.height=800;
canvas.width=1200;

game = true;
class box{
    constructor (pos) {
    this.x = pos;
    this.length = 20;
    this.breadth = 100;
    this.y = (canvas.height-this.breadth)/2;
    this.speed = 10;
    }
    draw(){
        
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.length,this.breadth);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
        
    }
    
}
let player1_up = false;
let player1_down = false;
let player2_up = false;
let player2_down = false;

document.addEventListener("keydown", function (event){
    switch(event.keyCode){
        case 119:
        case 87:
            player1_up = true;
            break;
        case 115:
        case 83:
            player1_down = true;
            break;
        case 38:
            player2_up = true;
            break;
        case 40:
            player2_down = true;
            break;
    }
});

document.addEventListener("keyup",function(event){
    switch(event.keyCode){
        case 119:
        case 87:
            player1_up = false;
            break;
        case 115:
        case 83:
            player1_down = false;
            break;
        case 38:
            player2_up = false;
            break;
        case 40:
            player2_down = false;
            break;
    }
});

let player1_box = new box(2);

player1_box.move = function(){
    if(player1_up && this.y>2){
    this.y-=this.speed;
    }
    if(player1_down && this.y+this.breadth<canvas.height-2){
        this.y+=this.speed;
    }
}



let player2_box = new box(canvas.width-22);

player2_box.move = function(){
        if(player2_up && this.y>2){
        this.y-=this.speed;
        }
        if(player2_down && this.y+this.breadth<canvas.height-2){
            this.y+=this.speed;
        }
}


class ball{
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 10;
        this.speed = 5;
        this.dy = (Math.random()*2*this.speed)-this.speed;
        this.dx = -1 * Math.sqrt(this.speed*this.speed-this.dy*this.dy);
    }
    drawBall(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius, 0, Math.PI*2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
    }
    move(){
        this.x+=this.dx;
        this.y+=this.dy;
    }
}

function restart(){
    player1_box.y = (canvas.height-player1_box.breadth)/2;
    player2_box.y = (canvas.height-player2_box.breadth)/2;
    playBall.x = canvas.width/2;
    playBall.y = canvas.height/2;
    playBall.dy = (Math.random()*2*playBall.speed)-playBall.speed;
    playBall.dx = -1 * Math.sqrt(playBall.speed*playBall.speed-playBall.dy*playBall.dy);    
    player1_up = false;
    player1_down = false;
    player2_up = false;
    player2_down = false;
}

let playBall = new ball();

function checks(){
    if((playBall.y<playBall.radius && playBall.dy<0)|| (playBall.y > canvas.height-playBall.radius && playBall.dy>0)){
        playBall.dy*=-1;
    }
    if(playBall.x < playBall.radius+player1_box.x+player1_box.length && playBall.y > player1_box.y && playBall.y < player1_box.y + player1_box.breadth && playBall.dx<0){
        playBall.dx*=-1;
    }
    if(playBall.x > player2_box.x-playBall.radius && playBall.y > player2_box.y && playBall.y < player2_box.y + player2_box.breadth && playBall.dx>0){
        playBall.dx*=-1;
    }
    if(playBall.x<0){
        player2_score++;
        alert(player1_name+" : "+player1_score+" - "+player2_name+" : "+player2_score);
        restart();
        if(player2_score===top_score){
            game=false;
            dataLocal(player2_name);
            dataSession(player2_name);
            alert(player2_name+" Wins");
        }
    }
    if(playBall.x>canvas.width){
        player1_score++;
        alert(player1_name+" : "+player1_score+" - "+player2_name+" : "+player2_score);
        restart();
        if(player1_score===top_score){
            game=false;
            dataLocal(player1_name);
            dataSession(player1_name);
            alert(player1_name+" Wins");
        }
    }
}


function animation_loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player1_box.draw();
    player1_box.move();
    player2_box.move();
    player2_box.draw();
    playBall.drawBall();
    playBall.move();
    checks();
    if(game){
        window.requestAnimationFrame(animation_loop);
    }    
}


window.requestAnimationFrame(animation_loop);

function dataLocal(winName){
    let datetime = new Date();
    let data = {
        "players": player1_name+" vs "+player2_name,
        "points": player1_score+"-"+player2_score,
        "win":winName,
        "dt": datetime.toUTCString(),
        "type": "game-score"
    };
    let dataString = JSON.stringify(data);
    let id = Math.trunc(Math.random()*10000);
    window.localStorage.setItem(id,dataString);
}
function dataSession(winName){
    let datetime = new Date();
    let data = {
        "players": player1_name+" vs "+player2_name,
        "points": player1_score+"-"+player2_score,
        "win":winName,
        "dt": datetime.toUTCString(),
        "type": "game-score"
    };
    let dataString = JSON.stringify(data);
    let id = Math.trunc(Math.random()*10000);
    window.sessionStorage.setItem(id,dataString);
}

function serverData(winName){
    let datetime = new Date();
    let data = {
        "players": player1_name+" vs "+player2_name,
        "points": player1_score+"-"+player2_score,
        "win":winName,
        "dt": datetime.toUTCString()
    };
    let dataString = JSON.stringify(data);
    let option = {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:dataString
    };
    fetch('/api',option)
}