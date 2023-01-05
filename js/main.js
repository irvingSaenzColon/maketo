const arr = [100, 650, 840, 255, 360, 460, 760, 535, 10, 66];

// Element from document
const canvas = document.getElementById('graph');
const context = canvas.getContext('2d');

const coordinates = document.getElementById('coordinates');


const graph_properties = {
    x_start : 0,
    y_start: 0,
    width: canvas.width,
    height: canvas.height
};

// Colors
const color = {
    independence: '#545E75',
    blue_jeans: '#63ADF2',
    baby_blue_eyes: '#A7CCED',
    y_in_min_blue: '#304D6D',
    air_superiority_blue: '#82A0BC'   
   };
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
function drawGrid(graph, linesX, linesY){

    const height = graph.height;
    const width = graph.width;

    const x_offset = width / linesX;
    const y_offset = height / linesY ;

    for(let i = 0; i < linesX; i++)drawLine((i * x_offset) + graph.x_start, graph.y_start, 1, height, '#ccc');
    for(let i = 0; i < linesY; i++) drawLine(graph.x_start, (i * y_offset) + graph.y_start, width, 1, '#ccc');
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

function drawBackground(padding, color){
    console.dir(graph_properties);
    graph_properties.x_start = padding;
    graph_properties.y_start = padding;

    graph_properties.width = canvas.width - (padding * 2); 
    graph_properties.height = canvas.height - (padding * 2);

    context.fillStyle = color;
    context.fillRect(graph_properties.x_start, graph_properties.y_start, graph_properties.width, graph_properties.height);
}

function drawText(x, y){
    context.font = '15px Arial';
    context.strokeText('hola', x, y, '#888888');
}

function drawArray(array, width, height, x_start, y_start, speed, delay){
    console.table(array);
    // Space between graph elements
    const offset = 10;
    // graph width represents the width of each elemnt of the graph that i wanted to draw
    const graph_width = (width / array.length) - offset;

    const range = getMinMaxRange(array);
    
    // The color of graph elements
    context.fillStyle = color['blue_jeans'] ;
    for(let i = 0; i < array.length; i++){
        let porcentage = (array[i] / range.max) * height;

        for(let j = 0; j < porcentage; j++){
            setTimeout(
            context.fillRect.bind(context, ((i * graph_width) + (i * offset) + x_start) , height + y_start, graph_width, - ( j ) )
            , (!i ? 0 :  delay) + speed * j);
        }
        delay += 150;
    }
}

//Regular functions

function getMinMaxRange(array){
    const max = Math.max(...array) + 50;
    const min = Math.min(...array);
    
    return {max: max, min:  min};
}


// Calculate functions

drawBackground(20, '#eeeeee');
drawGrid(graph_properties ,10, 5);

drawArray(arr, graph_properties.width, graph_properties.height, graph_properties.x_start, graph_properties.y_start, 4, 0);
// drawLine(0, 500, 75, -100, '#65A3B8');
// drawLine(80, 500, 75, -50, '#65A3B8');