const arr = [100, 650, 840, 255, 360, 460, 760, 535, 10, 66, 466, 350];

// Element from document
    // canvas elements
const canvas = document.getElementById('graph');
const context = canvas.getContext('2d');

const coordinates = document.getElementById('coordinates');
const graph_container = document.querySelector('section.container');

    // Form elements
const calculate_form = document.querySelector('form.form');
const investment_input = document.querySelector('input[name = "investment"]');
const annual_rate_input = document.querySelector('input[name = "yield"]');
const inv_time_select = document.querySelector('select[name = "investment_time"]');
const time_limit_select = document.querySelector('select[name = "time_limit"]');


const initial_table = document.getElementById('initial-table');
const worth_table = document.getElementById('worth-table');
const return_table = document.getElementById('return-table');

const page_number_buttons = document.querySelector('div.pageable-table>div');
const change_page_buttons = document.querySelectorAll('div.pageable-table>button');

const graph_properties = {
    x_start : 0,
    y_start: 0,
    width: canvas.width,
    height: canvas.height
};

let dates_result = [];

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
window.addEventListener('load', onWindowLoad);
window.addEventListener('resize', onWindowResize);

canvas.addEventListener('mousemove', getCanvasCoordinates);
canvas.addEventListener('mouseenter', onCanvasEnter);
canvas.addEventListener('mouseleave', onCanvasLeave);

calculate_form.addEventListener('submit', onCalculate)

// Resize functions
function onWindowResize(event){
    console.log(`Ancho: ${event.target.innerWidth} Alto: ${event.target.innerHeight}`);
}

// Load window
function onWindowLoad(event){

    change_page_buttons.forEach(function(button){
        button.addEventListener('click', onChangePage);
    })

    // if(graph_container.classList.contains('inactive'))
    //     return;
    // setCanvasResponsiveSize();

    // drawBackground(20, '#eeeeee');
    // drawGrid(graph_properties ,10, 5);

    // drawArray(arr, graph_properties.width, graph_properties.height, graph_properties.x_start, graph_properties.y_start, 4, 0);

}

// Mousemove functions
function getCanvasCoordinates(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    coordinates.innerText = `X: ${x}, Y:  ${y}`;
}

// Mouseenter functions
function onCanvasEnter(event){
    canvas.classList.add('canvas-graph--cursor-crosshair');
}

// Mouseleave function
 function onCanvasLeave(event){
    canvas.classList.remove('canvas-graph--cursor-crosshair');
 }

//  Click functions
function onCalculate(event){
    event.preventDefault();
    
    const investment = Number(investment_input.value);
    const annual_rate = Number(annual_rate_input.value) / 100;
    
    const years = Number(inv_time_select.value);
    const time_limit = time_limit_select.value;
    
    const final_return = returnOfInvestment(years, investment, annual_rate);
    const time_return = investmentReturn(investment, annual_rate, time_limit);

    dates_result = calculatePayDay(years, time_limit);

    dates_result = dates_result.map(function(element, index){
        return {date: element.date, pay: time_return};
    });

    console.table(dates_result);

    investmentPorjection(investment, 10, annual_rate);

    event.target.classList.add('inactive');

    graph_container.classList.remove('inactive');

    initial_table.appendChild(createTableRowHTML(investment, `${(annual_rate * 100)} %`));
    worth_table.appendChild(createTableRowHTML(final_return, investment + final_return));
    
    const page = pageableTable( dates_result, 0, 6);

    let page_count = getPages(dates_result, 6) ;

    let limit_page_count = page_count > 4 ? 4 : page_count;

    return_table.setAttribute('data-page', 1);

    change_page_buttons.forEach(function(button){
        if(button.getAttribute('data-direction') === 'left')
            button.classList.add('inactive');
    });

    for(let i = 0; i < limit_page_count; i++){
        let btn = createButtonHTML(i + 1, 'pageable-table__button');
        btn.addEventListener('click', onChangeSpecificPage);
        page_number_buttons.appendChild( btn );
    }

    page_number_buttons.querySelector('button:nth-child(1)').classList.add('pageable-table__button--active');

    page.forEach(function(element){
        return_table.appendChild( createTableRowHTML(element.date, element.pay.toFixed(2)) );
    });

}

function onChangePage(event){
    
    const button = event.target.closest('button');
    const buttons = page_number_buttons.querySelectorAll('button');
    const total_pages = Math.floor(dates_result.length / 6);

    //if next button is not 1 then 
    if(button.getAttribute('data-direction') === 'right'){

        let position = Number( return_table.getAttribute('data-page') ) ;
        console.log('Avanzando de página')
        //Preventing from user to get outside boundries of page e.g if my pages limit is 8 and users press m 
        if( total_pages  === position)
            return;
        console.log('Sí se cambió de página')
        position++;

        if(total_pages === position)
            document.querySelector('button[data-direction="right"]').classList.add('inactive');

        if(position != 1)
            document.querySelector('button[data-direction="left"]').classList.remove('inactive');
        
        // Clearing all objects that i don't need
        clearTable(return_table); //Make an animation before elements are deleted

        // Setting next page
        return_table.setAttribute('data-page', position);

        if(total_pages === position+1)
            document.querySelector('button[data-direction="left"]').classList.add('inactive');

        if(position != 1)
            document.querySelector('button[data-direction="left"]').classList.remove('inactive');
        

        const page = pageableTable( dates_result, position - 1 , 6 );

        page.forEach(function(element){
            return_table.appendChild( createTableRowHTML(element.date, element.pay.toFixed(2)) );
        });

        setActivePageForward(position, buttons);
    }
    else{
        let position = Number( return_table.getAttribute('data-page') ) ;
        
        //Preventing from user to get outside boundries of page e.g if my pages limit is 8 and users press m 
        if( position === 1)
            return;
        
        position--;

        // Clearing all objects that i don't need
        clearTable(return_table); //Make an animation before elements are deleted

        // Setting next page
        return_table.setAttribute('data-page', position);

        if(0 === (position-1))
            document.querySelector('button[data-direction="left"]').classList.add('inactive');

            if(position < total_pages){
                const right_button = document.querySelector('button[data-direction="right"]');
                if(right_button.classList.contains('inactive'))
                    right_button.classList.remove('inactive');
            }

        const page = pageableTable( dates_result, position - 1 , 6 );
        console.table(page);
        page.forEach(function(element){
            return_table.appendChild( createTableRowHTML(element.date, element.pay.toFixed(2)) );
        });

        setActivePageBackwards(position, buttons);
    }
}

function onChangeSpecificPage(event){
    let position = Number( event.target.innerText );
    const total_buttons = page_number_buttons.querySelectorAll('button');
    const total_pages = dates_result.length / 6;
    const buttons = page_number_buttons.querySelectorAll('button');
    
    if(event.target.previousSibling === null){
        if(position > 1)
        {
            //I need to know if previous element is next to the first one
            if(position === 2)
            {
                buttons.forEach(function(button, index){
                    
                    if(index === 1){
                        return_table.setAttribute('data-page', index +  1);
                        if(!button.contains('pageable-table__button--active'))
                            button.classList.add('pageable-table__button--active');
                    }
                    else {
                        if(button.classList.contains('pageable-table__button--active'))
                            button.classList.remove('pageable-table__button--active');
                    }
                    
                    button.innerText = index + 1;
                });
                //Just move the element to the right and get rid of "previous button"

            }
            else {
                //Move the element to the center left and then set the table to that page, also rename inner text buttons
                buttons.forEach(function(button, index){
                    button.classList.remove('pageable-table__button--active');

                    button.innerText = (position - 1) + index;
                    if(button.innerText == position){
                        if(!button.classList.contains('pageable-table__button--active'))
                            button.classList.add('pageable-table__button--active');
                    }
     
                });

            }
        }
    }
    else if(event.target.nextSibling === null){
        console.log('Soy el último botón');

        if(position < total_buttons){
         //It means that we have to move elements to left
            buttons.forEach(function (button, index) {
                button.classList.remove('pageable-table__button--active');

                button.innerText = (position - 1) + index;
                if (button.innerText == position) {
                    if (!button.classList.contains('pageable-table__button--active'))
                        button.classList.add('pageable-table__button--active');
                }

            });


        }
        else{

        }
    }
    else{
        
    }
    console.log(event.target.innerText);
}

// HTML create functions
function createTableRowHTML(value_left, value_right){
    const tr = document.createElement('tr');
    const td_left = document.createElement('td');
    const td_right = document.createElement('td');

    td_left.innerText = value_left;
    td_right.innerText = value_right;

    tr.append(td_left, td_right);

    return tr;

}

function createButtonHTML(value, class_name){
    const button = document.createElement('button');
    button.classList.add(class_name);
    button.innerText = value;

    return button;
}

// HTML clear table
function clearTable(table_element){
    const tr = table_element.querySelectorAll('table>tr');
    
    tr.forEach(function(element){
        table_element.removeChild(element);
    });
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
    context.fillRect.bind(context, );
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

// Pageable
function pageableTable( array, page, limit){

    if(array.length <= limit)
        return array;

    let current_position =  page ? (page * limit) : 0;

    let new_array = [];
    console.log(current_position);
    
    for(let i = current_position; i < (current_position + limit); i++ )
        new_array.push({date: array[i].date, pay: array[i].pay });

    return new_array;
}

function getPages(array, limit){
    return Math.floor( array.length / limit );
}

function setActivePageForward(current_page, buttons){
    console.log(buttons);
    console.log(current_page);
    buttons.forEach(function(button, index){
        let button_page = Number( button.innerText ) ;
        console.log(button_page, current_page);

        if(button_page === current_page ){
        
            if(!button.classList.contains('pageable-table__button--active'))
                button.classList.add('pageable-table__button--active');

        }
        else if(button.nextSibling === null && (button_page + 1) === current_page){
            
            for(let i = index - 1; i >= 0; i --) buttons[i].innerText = Number(buttons[i].innerText) + 1;
            button.innerText = current_page;
    
            if(!button.classList.contains('pageable-table__button--active'))
                button.classList.add('pageable-table__button--active');
        }
        else{
            button.classList.remove('pageable-table__button--active');
        }

        

    });
}

function setActivePageBackwards(current_page, buttons){
    console.log(buttons);
    console.log(current_page);
    buttons.forEach(function(button){
        let button_page = Number( button.innerText ) ;
        console.log(button_page, current_page);

        if(button_page === current_page ){
        
            if(!button.classList.contains('pageable-table__button--active'))
                button.classList.add('pageable-table__button--active');

        }
        else if(button.previousSibling === null && (button_page - 1) === current_page){
            
            for(let i = 1; i < buttons.length; i ++) buttons[i].innerText = Number(buttons[i].innerText) - 1;

            button.innerText = current_page;
    
            if(!button.classList.contains('pageable-table__button--active'))
                button.classList.add('pageable-table__button--active');
        }
        else{
            button.classList.remove('pageable-table__button--active');
        }
      
    });
}

function addEventListenerToButtons(buttons_array, event_function){
   
}

//Regular functions

function getMinMaxRange(array){
    const max = Math.max(...array) + 50;
    const min = Math.min(...array);
    
    return {max: max, min:  min};
}

function setCanvasResponsiveSize(){
    
    const width = window.innerWidth > 900 ? 800 : window.innerWidth;
    const height = window.innerHeight * 0.75;

    console.log('Ancho del viewport ' + window.innerWidth);

    canvas.width = width;
    canvas.height = height;
    
}

function investmentReturn(invest, annual_rate, time_limit){
    // Calculating Return of Investment for a month
    const roi = invest * (annual_rate / 12);

    if(time_limit === 'weekly')
        return roi / 4;
    else if(time_limit === 'biweekly')
        return roi / 2;
    else if(time_limit === 'monthly')
        return roi;
    else if(time_limit === 'quarterly')
        return roi * 3;
    else if(time_limit === 'biannual')
        return roi * 6;
    else if(time_limit === 'annual')
        return roi * 12;
}

function returnOfInvestment(years, invest, annual_rate){
    years*=12;
    return (invest * annual_rate * ( years / 12 ));
}

function calculatePayDay(years, type){
    let now = new Date();
    let count = 0;
    const dates = [];

    if(type === 'weekly'){
        count = (years * 12) * 4 ;
        for(let i = 0; i < count; i ++){
            now.setDate( now.getDate() +  7 );
            dates.push({
                date: `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`,
            });
        }
    }
    else if(type === 'biweekly'){
        count = (years * 12) * 2 ;
        for(let i = 0; i < count; i ++){
            now.setDate( now.getDate() +  (7 * 2) );
             dates.push({
                date: `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`,
            });
        }
    }
    else if(type === 'monthly'){
        count = (years * 12) ;
        for(let i = 0; i < count; i ++){
            now.setMonth( now.getMonth() +  1 );
             dates.push({
                date: `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`,
            });
        }
    }
    else if(type === 'quarterly'){
        count = (years * 12) / 3 ;
        for(let i = 0; i < count; i ++){
            now.setMonth( now.getMonth() +  3 );
             dates.push({
                date: `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`,
            });
        }
    }
    else if(type === 'biannual'){
        count = (years * 12) / 6 ;
        for(let i = 0; i < count; i ++){
            now.setMonth( now.getMonth() +  6 );
             dates.push({
                date: `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`,
            });
        }
    }
    else if(type === 'annual'){
        count = years;
        for(let i = 0; i < count; i ++){
            now.setFullYear( now.getFullYear() +  1 );
             dates.push({
                date: `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`,
            });
        }
    }

    return dates;
}

function addWeeks(date, weeks){
    date.setDate( date.getDate() + 7 * weeks );

    return date;
}

function investmentPorjection(invest, years, annual_rate){
    const projection = [];
    let current_invest = invest;
    for(let i = 0; i < years; i++) {
        let current_worth = returnOfInvestment(1, current_invest, annual_rate);
        current_invest = current_worth + current_invest;
        let invest_no_profit = current_invest - current_worth; 
        projection.push( {
            invest: invest_no_profit,
            profit: current_worth,
            total: current_invest,    
        } );
    }

    console.table( projection );
}