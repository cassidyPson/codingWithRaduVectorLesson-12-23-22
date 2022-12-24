const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const G = {
    x: 20,
    y: 50
}



const offset = {
    x: canvas.width / 2,
    y: canvas.height / 2
}


const point = {
    x: 90,
    y: 120
}

c.translate(offset.x,offset.y);

document.onmousemove=(event)=>{
    point.x = event.x - offset.x;
    point.y = event.y - offset.y;
    update();
}


update();
function update(){
    c.clearRect(-offset.x, -offset.y, canvas.width, canvas.height);
    drawBackground();
    drawCoordinateSystem();
    const {mag,dir}=toPolar(point)
    const same = toXY({mag,dir})
    
    const resultAdd = add(point, G);
    c.beginPath();
    c.setLineDash([3,3])
    c.moveTo(G.x,G.y);
    c.lineTo(resultAdd.x, resultAdd.y);
    c.lineTo(point.x, point.y);
    c.stroke();
    c.setLineDash([]);
    drawArrow({x:0,y:0}, resultAdd, 'red');

    const resultSub = subtract(point,G);
    //console.log(resultSub);
    //{x:#, y:#}
    drawArrow({x:0,y:0}, resultSub, 'red');
    drawArrow(G,point, 'red');

    const scaledSub = scale(normalize(resultSub));
    drawArrow({x:0,y:0}, scaledSub, 'red')

    //console.log(dot(normalize(G),normalize(point)));

    drawArrow({x:0,y:0}, point)
    drawArrow({x:0,y:0}, G);
}

function drawArrow(tail,tip,color='white',size=20){
    const {dir,mag} = toPolar(subtract(tip, tail));
    const v1 = {dir:dir+Math.PI*0.8,mag:size/2}
    const p1 = toXY(v1)
    const t1 = add(p1,tip);
    const v2 = {dir:dir-Math.PI*0.8,mag:size/2}
    const p2 = toXY(v2)
    const t2 = add(p2,tip)
    c.beginPath();
    c.moveTo(tail.x,tail.y)
    c.lineTo(tip.x, tip.y)
    c.strokeStyle = color;
    c.stroke();
    c.beginPath();
    c.moveTo(tip.x,tip.y)
    c.lineTo(t1.x,t1.y)
    c.lineTo(t2.x,t2.y)
    c.closePath();
    c.stroke()
    c.fillStyle = color;
    c.fill();
}

function dot(p1,p2){
    return p1.x * p2.x + p1.y * p2.y;
}

function normalize(p){
    console.log(p);
    return scale(p,1/magnitude(p))
    
}

function scale(p,scalar){
    return {
        x: p.x * scalar,
        y: p.y * scalar
    }
}

function add(p1,p2){
    return{
        x: p1.x + p2.x,
        y: p1.y + p2.y
    }
}

function subtract(p1,p2){
    return{
        x: p1.x - p2.x,
        y: p1.y - p2.y
    }
}

function drawBackground(){
    c.fillStyle = 'darkred'
    c.fillRect(-offset.x,-offset.y,canvas.width, canvas.height);
}

function toXY({mag,dir}){
    return {
        x: Math.cos(dir)*mag,
        y: Math.sin(dir)*mag
    }
}

function toPolar({x,y}){
    return{
        dir: direction({x,y}),
        mag: magnitude({x,y}),
    }
}

function direction({x,y}){
    return Math.atan2(y,x)
}

function magnitude({x,y}){
    return Math.hypot(x,y);
}

function drawPoint(loc,size=10,color='white'){
    c.beginPath();
    c.fillStyle = color;
    c.arc(loc.x,loc.y,size,0,Math.PI*2);
    c.fill();
}

function drawCoordinateSystem(){
    c.beginPath();
    c.moveTo(-offset.x,0);
    c.lineTo(canvas.width - offset.x,0);
    c.moveTo(0,-offset.y)
    c.lineTo(0,canvas.height - offset.y)
    c.strokeStyle = 'black';
    c.stroke();
}