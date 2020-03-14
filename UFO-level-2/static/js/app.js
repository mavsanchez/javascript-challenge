// from data.js
var tableData = data;
// let arra = [1,1,2,3,4,5,6,6,6,9,10];
// console.log(new Set(arra));
// ************************************* Set up the calendar data ********************************************
// List all dates and save to an array

let dates = [], dates_data = [], cities = ['**ALL'], states = ['**ALL'], countries = ['**ALL'], shapes = ['**ALL'];

// Set up the calendar data
function format_date_w0(d) {
    // Create an array of strings from date parameter, joined or delimited by backward-slash
    return [('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2), d.getFullYear()].join('/');
}

function format_date(d) {
    // Create an array of strings from date parameter, joined or delimited by backward-slash
    return [('' + (d.getMonth() + 1)).slice(-2), ('' + d.getDate()).slice(-2), d.getFullYear()].join('/');
    // return [( (d.getMonth() + 1)).slice(-2), ( d.getDate()).slice(-2), d.getFullYear()].join('/');
}

tableData.map((sighting) => {
    dates.push(new Date(sighting.datetime));
    dates_data.push(format_date_w0(new Date(sighting.datetime)));
    cities.push(sighting.city);
    states.push(sighting.state);
    countries.push(sighting.country);
    shapes.push(sighting.shape);
});

function set_options(html_obj, lst){
    lst_dist = new Set(lst);
    lst_dist.forEach((opt) => {
        let new_option = html_obj.append("option").text(opt.toUpperCase());
        new_option.attr("value", opt);
    });
}

let cities_html = d3.select("#cities");
let states_html = d3.select("#states");
let countries_html = d3.select("#countries");
let shapes_html = d3.select("#shapes");

set_options(cities_html, cities.sort());
set_options(states_html, states.sort());
set_options(countries_html, countries.sort());
set_options(shapes_html, shapes.sort());


// Calculate minimum and maximum dates for our calendar
var maxDate = new Date(Math.max.apply(null, dates));
var minDate = new Date(Math.min.apply(null, dates));



// Using jQuery, initialize the calendar with only valid/allowable dates from our dataset
$(function () {
    $('#datetime').datetimepicker(
        {
            format: 'm/d/Y',
            timepicker: false,
            formatDate: 'm/d/Y',
            startDate: format_date_w0(minDate),
            maxDate: format_date_w0(maxDate) 
        }
    );
});

// ************************************* D3 Handlers ********************************************

// Define Objects 
wholePage = d3.select(window);
ufo_table = d3.select("#ufo-table");
ufo_table_body = d3.select("#ufo-table>tbody");
dateFilter_input = d3.select("#datetime");
filter_button = d3.select("#filter-btn");

// Function to refresh and display all data on page load
function refresh_data(){
    ufo_table_body.html("");
    tableData.forEach(
        (sighting) =>{
        let dataRow = ufo_table_body.append("tr");
            dataRow.append("td").text(sighting.datetime);
            dataRow.append("td").text(sighting.city);
            dataRow.append("td").text(sighting.state);
            dataRow.append("td").text(sighting.country);
            dataRow.append("td").text(sighting.shape);
            dataRow.append("td").text(sighting.durationMinutes);
            dataRow.append("td").text(sighting.comments);
    });
}


// Function to filter date selected
function filter_data() {
    ufo_table_body.html("");
    let filter = {}
    filter.datetime = format_date(new Date(dateFilter_input.property("value")));
    filter.city = cities_html.property("value");;
    filter.state = states_html.property("value");;
    filter.country = countries_html.property("value");;
    filter.shape = shapes_html.property("value");

    let filtered_sightings = tableData.filter(
        (sighting) => {
            for (var key in filter) {
                if ((sighting[key] === undefined || sighting[key] != filter[key]) && filter[key] != '**ALL' )
                    return false;
                }
            return true;
        });

    filtered_sightings.forEach(
        (sighting) => {
            let dataRow = ufo_table_body.append("tr");
            dataRow.append("td").text(sighting.datetime);
            dataRow.append("td").text(sighting.city);
            dataRow.append("td").text(sighting.state);
            dataRow.append("td").text(sighting.country);
            dataRow.append("td").text(sighting.shape);
            dataRow.append("td").text(sighting.durationMinutes);
            dataRow.append("td").text(sighting.comments);
        });
}

// Event handlers
dateFilter_input.on("change", filter_data);
cities_html.on("change", filter_data);
states_html.on("change", filter_data);
countries_html.on("change", filter_data);
shapes_html.on("change", filter_data);
filter_button.on("click", filter_data);
wholePage.on("load", refresh_data);
