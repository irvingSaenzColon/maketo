const arr = [100, 650, 840, 255, 360, 460, 760, 535];
// Colors
const color = {
 independence: '#545E75',
 blue_jeans: '#63ADF2',
 baby_blue_eyes: '#A7CCED',
 y_in_min_blue: '#304D6D',
 air_superiority_blue: '#82A0BC'   
};

// Element from document
const canvas = document.getElementById('graph');
const context = canvas.getContext('2d');

const coordinates = document.getElementById('coordinates');

console.log(context);

// Eventlisteners
window.addEventListener('resize', onWindowResize);

canvas.addEventListener('mousemove', getCanvasCoordinates);
canvas.addEventListener('mouseenter', onCanvasEnter);
canvas.addEventListener('mouseleave', onCanvasLeave);

// Resize functions
function onWindowResize(event){
    console.log(`Ancho: ${event.target.innerWidth} Alto: ${event.target.innerHeight}`);
}

// Mousemove functions
function getCanvasCoordinates(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    coordinates.innerText = `X: ${x}, Y:  ${y}`;
}

// Mouseenter function
function onCanvasEnter(event){
    canvas.classList.add('canvas-graph--cursor-crosshair');
}

// Mouseleave function
 function onCanvasLeave(event){
    canvas.classList.remove('canvas-graph--cursor-crosshair');
 }

// Drawing Functions
function drawGrid(linesX, linesY){
    const height = canvas.height;
    const width = canvas.width;

    const x_offset = width / linesX;
    const y_offset = height / linesY ;

    for(let i = 0; i < linesX; i++)drawLine(i * x_offset, 0, 1, height, '#ccc');
    for(let i = 0; i < linesY; i++) drawLine(0, i * y_offset, width, 1, '#ccc');
}

function drawLine(x_position, y_position, width, height, color){
    context.fillStyle  = color;
    context.fillRect(x_position, y_position, width, height);
    context.fillRect.bind(context, )
}

function drawLineBind(context, x_position, y_position, width, height, color){
    context.fillStyle  = color;
    context.fillRect.bind(context, x_position, y_position, width, height);
}

function drawText(x, y){
    context.font = '15px Arial';
    context.strokeText('hola', x, y, '#888888');
}

function drawArray(array, speed, delay){
    console.table(array);
    const offset = 10;
    const graph_width = (canvas.width / array.length) - offset;

    const range = getMinMaxRange(array);
    
    context.fillStyle = color['blue_jeans'] ;
    for(let i = 0; i < array.length; i++){
        let porcentage = (array[i] / range.max) * canvas.height;

        for(let j = 0; j < porcentage; j++){
            setTimeout(
            context.fillRect.bind(context, (i * graph_width) + (i * offset) , canvas.height, graph_width, - ( j ) )
            , (!i ? 0 :  delay) + speed * j);
        }
        delay += 150;
        //drawLine(( (i * graph_width) + (i * offset) ), canvas.height, graph_width, - ( porcentage * canvas.height ), color['blue_jeans']);    
    }
}

//Regular functions

function getMinMaxRange(array){
    const max = Math.max(...array) + 50;
    const min = Math.min(...array);
    
    return {max: max, min:  min};
}

//max - 100
//cur -  ?

// Calculate functions
console.dir( getMinMaxRange(arr) );

drawGrid(10, 5);
drawArray(arr, 4, 0);
// drawLine(0, 500, 75, -100, '#65A3B8');
// drawLine(80, 500, 75, -50, '#65A3B8');