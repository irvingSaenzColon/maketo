// Element from document
const body = document.querySelector('body');

    // navbar
const nav_options = document.querySelectorAll('button.nav__option');

    // Submenu
const aside_menu = document.querySelector('aside.flex');

    // canvas elements
const canvas = document.getElementById('graph');
const context = canvas.getContext('2d');

const coordinates = document.getElementById('coordinates');
const container = document.querySelector('section.container');

    // Page
const home = document.querySelector('div.tables-container');
const about = document.getElementById('about-page');

    // Form elements
const calculate_form = document.querySelector('form.form');
const investment_input = document.getElementById('investment');
const annual_rate_input = document.getElementById('yield');
const inv_time_select = document.getElementById('investment_time');
const time_limit_select = document.getElementById('time_limit');

const contact_form = document.getElementById('contact-form'); 


const initial_table = document.getElementById('initial-table');
const worth_table = document.getElementById('worth-table');
const return_table = document.getElementById('return-table');

const page_number_buttons = document.querySelector('div.pageable-table>div');
const change_page_buttons = document.querySelectorAll('div.pageable-table>button');
const next_page = document.querySelector('button[data-direction="right"]');
const previous_page = document.querySelector('button[data-direction="left"]');

const burger_buton = document.querySelector('button.nav__burger');
const new_calculus = document.querySelector('div.aside__footer>button');

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

calculate_form.addEventListener('submit', onCalculate);
contact_form.addEventListener('submit', onSendMail);

burger_buton.addEventListener('click', onClickBurger);
new_calculus.addEventListener('click', onNewCalculus);

investment_input.addEventListener('keypress', onDecimalInput);
annual_rate_input.addEventListener('keypress',  onDecimalInput);

annual_rate_input.addEventListener('keyup',  onDecimalHundred);

// Resize functions
function onWindowResize(event){
    console.log(`Ancho: ${event.target.innerWidth} Alto: ${event.target.innerHeight}`);
}

// Load window
function onWindowLoad(event){

    change_page_buttons.forEach(function(button){
        button.addEventListener('click', onChangePage);
    })

    nav_options.forEach(function(button){
        button.addEventListener('click', onNavOption);
    })

    // if(container.classList.contains('inactive'))
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

//  Submit functions

function onCalculate(event){
    event.preventDefault();

    
    const investment = Number(investment_input.value);
    const annual_rate = Number(annual_rate_input.value) / 100;

    //if investment or annual rate is cero then make an animation in order to give feedback
    inputsValidate(investment, annual_rate);

    if(investment === 0 || annual_rate === 0)
        return;

    // Hide form element
    calculate_form.classList.add('form--out');
    setTimeout(function(){
        calculate_form.classList.add('inactive');
    }, 500);

    const years = Number(inv_time_select.value);
    const time_limit = time_limit_select.value;
    
    const final_return = returnOfInvestment(years, investment, annual_rate);
    const time_return = investmentReturn(investment, annual_rate, time_limit);

    dates_result = calculatePayDay(years, time_limit);

    // Reesctructuring information to make it more readeable
    dates_result = dates_result.map(function(element, index){
        return {date: element.date, pay: index === (dates_result.length - 1) ? time_return + investment :  time_return};
    });

    console.table(dates_result);

    // Calculating if user would like to see what would happen if he/her/they invest that money through time
    investmentPorjection(investment, 10, annual_rate);


    container.classList.remove('inactive');
    container.classList.add('container--fade-in');
    setTimeout(function(){
        container.classList.remove('container--fade-in');
    }, 500);

    // Showing values given by user
    document.querySelector('table#initial-table>tbody>tr:last-of-type>td:first-of-type').innerText = investment;
    document.querySelector('table#initial-table>tbody>tr:last-of-type>td:last-of-type').innerText = `${annual_rate * 100} %`;
    document.querySelector('table#worth-table>tbody>tr:last-of-type>td:first-of-type').innerText = final_return;
    document.querySelector('table#worth-table>tbody>tr:last-of-type>td:last-of-type').innerText = investment + final_return;

    console.log(return_table.previousElementSibling);
    return_table.previousElementSibling.innerText = `Usted ha elegido el pago de intereses ${time_limit} por lo que se dividirán en diferentes exhibiciones:`;
    
    // getting an array of elements limited so it can be displayed a few elements
    const page = pageableTable( dates_result, 0, 6);

    // getting the total pages from a collection of elements, each page will of 6 elements
    let page_count = getPages(dates_result, 6) ;
    
    page_count = page_count === 0 ? 1 : page_count;
    
    let limit_page_count = (page_count > 4) ? 4 : page_count;

    // Setting in which pages is the current data
    return_table.setAttribute('data-page', 1);

    // Show the aside arrows to move through pages
   showForBackOnActivePage(1, page_count);

    //adding rows to a table    
    for(let i = 0; i < limit_page_count; i++){
        let btn = createButtonHTML(i + 1, 'pageable-table__button');
        btn.addEventListener('click', onChangeSpecificPage);
        page_number_buttons.appendChild( btn );
    }

    
    page_number_buttons.querySelector('button:nth-child(1)').classList.add('pageable-table__button--active');

    page.forEach(function(element){
        const tr = createTableRowHTML(element.date, element.pay.toFixed(2));
        tr.classList.add('inactive');
        return_table.appendChild( tr );
    });

    const table_rows = return_table.querySelectorAll('tr');
    return_table.setAttribute('height', (table_rows.length * 35) + 35);

    showPage(table_rows);

}

function onSendMail(event){
    console.log('Enviando correo');
    event.preventDefault();

    window.fetch('http://localhost:8080/testreader.php',{
        method:'POST',
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    });
}

//  Click functions
function onNewCalculus(event){
    aside_menu.classList.add('submenu--out');

    //if it is already open just close mobile menu
    if(!calculate_form.classList.contains('inactive')){
        setTimeout(function(){
            aside_menu.classList.remove('submenu--out');
            aside_menu.classList.add('inactive') ;
            body.classList.remove('no-overflow');
        }, 500);
        return;
    }

    // closing aside menu
    
    container.classList.add('container--fade-out');
    
    setTimeout(function(){
        aside_menu.classList.remove('submenu--out');
        aside_menu.classList.add('inactive') ;
        body.classList.remove('no-overflow');
        container.classList.add('inactive');
        container.classList.remove('container--fade-out');

        calculate_form.classList.add('form--in');

        if( calculate_form.classList.contains('form--out') )
            calculate_form.classList.remove('form--out');

        calculate_form.classList.remove('inactive');

    }, 500);

    // Clearing the table
    clearTable(return_table);
    // Clearing pages
    clearPeagable(page_number_buttons.querySelectorAll('button'));
    //Setting next and preovios button to a default state
    resetFoBaButtons([next_page, previous_page]);



}

function onNavOption(event){
    console.log(event.target);

    nav_options.forEach(function(option){
        option === event.target ? option.classList.add('nav__option--active') : option.classList.remove('nav__option--active') ;
    });

    // Show page and hide previous one
    console.log(event.target.innerText);
    if(event.target.innerText === 'Acerca de'){
        // Esconde el Inicio
        if(!home.classList.contains('inactive')){
            home.classList.add('');
            //Crear animación para pasar de página
            setTimeout(function(){
                
            }, 250)
        }
    }
    else if(event.target.innerText === 'Inicio'){
        // Verificar si hay datos en el arreglos
        //si hay datos en el arreglo entonces muestra lo que está
        //Si no hay datos en el arreglo muestra el formulario del principio

    }
}

function onClickBurger(event){

    if(aside_menu.classList.contains('inactive')){
        aside_menu.classList.remove('inactive');
        body.classList.add('no-overflow');
        aside_menu.classList.add('submenu--in');

        setTimeout(function(){
            aside_menu.classList.remove('submenu--in');
        }, 500);
    }
    else{
        aside_menu.classList.add('submenu--out');

        setTimeout(function(){
            aside_menu.classList.remove('submenu--out');
            aside_menu.classList.add('inactive') ;
            body.classList.remove('no-overflow');
        }, 500);
    }
        
        
}

function onChangePage(event){
    
    const button = event.target.closest('button');
    const total_pages = Math.floor(dates_result.length / 6);
    const buttons = page_number_buttons.querySelectorAll('button');
    let direction = button.getAttribute('data-direction') === 'left' ? false : true;

    let position = Number( return_table.getAttribute('data-page') ) ;

    button.getAttribute('data-direction') === 'right' ? position++ : position--;

    if(total_pages === (position - 1) || ( position === 0 && !direction) || !total_pages)
        return;

    console.log('Holi hijo de tu puta madre');
    
    return_table.setAttribute('data-page', position);

    removeActiveFromPageable(buttons);

    //This is gonna execute whenever the las buttons or first is active
    if((isFirstLimitButton(buttons, position - 1 ) && !direction && position != 2) || (isLastLimitButton(buttons, position - 1 ) && direction) )
        movePageableDirection( direction, buttons);

    setActivePageFromIndex(buttons, position);

    showForBackOnActivePage(position, total_pages);

    let table_rows = return_table.querySelectorAll('table>tr');

    console.log(table_rows);
    hidePage(table_rows);

    setTimeout(function(){
        removePage(table_rows);
        drawTableElements(return_table, dates_result, position, 6);  
    }, 100*table_rows.length);

    //drawTableElements(return_table, dates_result, position, 6);
    
}

function onChangeSpecificPage(event){
    let position = Number( event.target.innerText );
    const total_pages = dates_result.length / 6;
    const buttons = page_number_buttons.querySelectorAll('button');
    const current_page = Number( return_table.getAttribute('data-page') );

    //If the position is equals to current page then return because there is no reason to do something
    if(current_page === position)
        return;

    //Setting table current page
    return_table.setAttribute('data-page', position);

    //Removing  active class from element
    removeActiveFromPageable(buttons);
    
    if(event.target.previousSibling === null){
        if(position > 1)
        {
            //I need to know if previous element is next to the first one
            if(position === 2)
            {
                //Just move the element to the right and get rid of "previous button"
                buttons.forEach(function(button, index){
                    button.innerText = index + 1;
                });

            }
            else {
                //Move the element to the center left and then set the table to that page, also rename inner text buttons
                buttons.forEach(function(button, index){
                    button.innerText = (position - 1) + index;
                });
            }
        }
    }
    else if(event.target.nextSibling === null && total_pages > 4){
        if(position === total_pages - 1){

            buttons.forEach(function(button, index){
                button.innerText = position + (index - 2);
            });
        }
        else if(position === total_pages && total_pages != buttons.length ){
            console.log('Hola hijo de tu puta madre');
            buttons.forEach(function(button, index){
                button.innerText = position + (index - 3);
            });
        }
        else {
            console.log('hola');
         //It means that we have to move elements to left
            buttons.forEach(function (button, index) {
                button.innerText = (position - 1) + index;

            });
        }
    }

    showForBackOnActivePage(position, total_pages);

    setActivePageFromIndex(buttons, position);

    drawTableElements(return_table, dates_result, position, 6);

    console.log(event.target.innerText);
}

// Keypress functions
function onDecimalInput(event){
    console.log(event);
    const output = event.target.value;
    let decimal = 0;
    if(output.indexOf('.')> -1 )
        decimal = output.substring(output.indexOf('.'), output.length - 1);

    if(decimal.length > 1 )
        event.preventDefault();
}

// Keyup functions
function onDecimalHundred(event){
    const output = event.target.value;

    if(Number(output)> 100)
        event.target.value = 100;
    else if(Number(output) < 1 )
        event.target.value = 1;
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

function resetFoBaButtons(buttons){
    buttons.forEach(function(button){
        if(button.classList.contains('inactive'))
            button.classList.remove('inactive');
    });
}

// HTML clear table
function clearTable(table_element){
    const tr = table_element.querySelectorAll('table>tr');
    
    tr.forEach(function(element){
        table_element.removeChild(element);
    });
}

function clearPeagable(buttons){
    buttons.forEach(function(button){
        button.remove();
    });
}

// Drawing Functions
function drawTableElements(table, array, position, limit){
    clearTable(table);

    let page = pageableTable(array, position - 1, limit);

    page.forEach(function (element) {
        const tr = createTableRowHTML(element.date, element.pay.toFixed(2))
        tr.classList.add('inactive');
        table.appendChild( tr );
    });

    const table_rows = table.querySelectorAll('table>tr');
    showPage(table_rows);
}

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

// Input validations
function inputsValidate(investment, annual_rate){
    if(!investment){
        if(investment_input.classList.contains('form__input--error'))
            investment_input.classList.remove('form__input--error');

        setTimeout(function(){
            investment_input.classList.add('form__input--error');
        }, 100);
    }
    else{
        if(investment_input.classList.contains('form__input--error'))
            investment_input.classList.remove('form__input--error');
    }

    if(!annual_rate){
        if(annual_rate_input.classList.contains('form__input--error'))
            annual_rate_input.classList.remove('form__input--error');

        setTimeout(function(){
            annual_rate_input.classList.add('form__input--error');
        }, 100);
    }
    else{
        if(annual_rate_input.classList.contains('form__input--error'))
            annual_rate_input.classList.remove('form__input--error');
    }
}


// Pageable
function showPage(table_rows){
    
    [...table_rows].forEach(function(row, index){
        setTimeout(function(){
            row.classList.remove('inactive');
            row.classList.add('table-row--in');
        }, 100 * index);
    });

    setTimeout(function(){
        [...table_rows].forEach(function(row){
            row.classList.remove('table-row--in');
        });    
    }, 100 * table_rows.length);
    
}

function hidePage(table_rows){
    [...table_rows].forEach(function(row, index){
        setTimeout(function(){
            row.classList.add('table-row--out');
        }, index * 100);
    });
}

function removePage(table_rows){
    [...table_rows].forEach(function(row){
        row.remove();
    });
}

function pageableTable( array, page, limit){

    if(array.length <= limit)
        return array;

    let current_position =  page ? (page * limit) : 0;

    let new_array = [];
    
    for(let i = current_position; i < (current_position + limit); i++ )
        new_array.push({date: array[i].date, pay: array[i].pay });

    return new_array;
}

function getPages(array, limit){
    return Math.round( array.length / limit );
}

function movePageableDirection(direction, buttons){
    let increment = 0;
    //If it is true it means is moving right
    direction ? increment = 1 : increment = -1;
    
    buttons.forEach(function (button) {
        button.innerText = Number(button.innerText) + increment;
    });
}

function setActivePageBackwards(current_page, buttons){
    
    buttons.forEach(function(button){
        let button_page = Number( button.innerText ) ;

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

function showForBackOnActivePage(page, total_pages){
    if(page === 1 && total_pages > 1)
    {
        previous_page.classList.add('inactive');
        if(next_page.classList.contains('inactive'))
            next_page.classList.remove('inactive');
    }
    else if(page === total_pages && total_pages > 1){
        next_page.classList.add('inactive');
        if(previous_page.classList.contains('inactive'))
            previous_page.classList.remove('inactive');
    }
    else if(total_pages === 1){

        if(!next_page.classList.contains('inactive'))
            next_page.classList.add('inactive')

        if(!previous_page.classList.contains('inactive'))
            previous_page.classList.add('inactive')
    }
    else{
        if(next_page.classList.contains('inactive'))
            next_page.classList.remove('inactive')
        if(previous_page.classList.contains('inactive'))
            previous_page.classList.remove('inactive');
    }
}

function setActivePageFromIndex(buttons, page){

    const button = [...buttons].find(function(button){
        if(button.innerText == page)
            return button;
    });

    button?.classList.add('pageable-table__button--active');
}

function isLastLimitButton(buttons, page){
    return [...buttons].some(function(button){
        return (button.nextSibling === null && button.innerText == page);
    });
}

function isFirstLimitButton(buttons, page){
    return [...buttons].some(function(button){
        return (button.previousSibling === null && button.innerText == page);
    });
}

function removeActiveFromPageable(buttons){
    buttons.forEach(function(button){
        if(button.classList.contains('pageable-table__button--active'))
            button.classList.remove('pageable-table__button--active');
    })
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