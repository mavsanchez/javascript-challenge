// from data.js
var tableData = data;

// ************************************* Set up the calendar data ********************************************
// List all dates and save to an array
let dates = tableData.map((sighting) => new Date(sighting.datetime));

// Calculate minimum and maximum dates for our calendar
var maxDate = new Date(Math.max.apply(null, dates));
var minDate = new Date(Math.min.apply(null, dates));

// Set up the calendar data

function format_date(d){ 
    // Create an array of strings from date parameter, joined or delimited by backward-slash
    return [('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2), d.getFullYear()].join('/'); 
}

// Using jQuery, initialize the calendar with only valid/allowable dates from our dataset
$(function () {
    $('#datetime').datetimepicker(
        {
            format: 'm/d/Y',
            timepicker: false,
            formatDate: 'm/d/Y',
            startDate: format_date(minDate),
            maxDate: format_date(maxDate) 
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
    let date_input_value = dateFilter_input.property("value");
    // Filter the inputted date, note that I changed the date format to match with our calendar input
    let filtered_sightings = tableData.filter((sighting) => format_date(new Date(sighting.datetime)) == date_input_value );
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
filter_button.on("click", filter_data);
wholePage.on("load", refresh_data);
