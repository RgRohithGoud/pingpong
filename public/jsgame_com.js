let top_score = 5;
let player1_score=0;
let player2_score=0;

let player1_name = prompt("Enter you name");
if(player1_name==""){
    player1_name = "Player";
}
let player2_name = "Computer";

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
let up = false;
let down = false;
document.addEventListener("keydown", function (event){
    switch(event.keyCode){
        case 38:
            up = true;
            break;
        case 40:
            down = true;
            break;
    }
});

document.addEventListener("keyup",function(event){
    switch(event.keyCode){
        case 38:
            up = false;
            break;
        case 40:
            down = false;
            break;
    }
});

let player1_box = new box(2);

player1_box.move = function(){
    if(up && this.y>2){
    this.y-=this.speed;
    }
    if(down && this.y+this.breadth<canvas.height-2){
        this.y+=this.speed;
    }
}

let player2_box = new box(canvas.width-22);

player2_box.computer_move = function(){
    if(playBall.dx>0){
        projected_y = playBall.y+(playBall.dy/playBall.dx)*(canvas.width-playBall.x-player2_box.length) - player2_box.breadth/2;
        projected_y = Math.trunc(projected_y);
        projected_y = projected_y - projected_y%player2_box.speed;
        if(projected_y>0 && projected_y+player2_box.breadth<canvas.height-2)
        {
            if(projected_y != player2_box.y){
                if(projected_y>player2_box.y)player2_box.y+=player2_box.speed;
                else{
                    player2_box.y-=player2_box.speed;
                }
            }
        }
        
    }
    else{
        if(player2_box.y !== (canvas.height-player2_box.breadth)/2){
            if(player2_box.y < (canvas.height-player2_box.breadth)/2){
                player2_box.y+=player2_box.speed;
            }
            else{
                player2_box.y-=player2_box.speed;
            }
        }
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
    up = false;
    down = false;
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
            serverData(player2_name);
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
            serverData(player1_name);
            alert(player1_name+" Wins");
        }
    }
}

function animation_loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player1_box.draw();
    player1_box.move();
    player2_box.computer_move();
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