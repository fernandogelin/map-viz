// Dropdown values

var dropdown_options = [
  {text: "Average BMI", value: 'BMI_M'},
  {text: "Unemployment claimants per 100 people", value: 'P_UI'},
  {text: "TDI claimants per 100 people", value: 'P_TDI'},
  {text: "Average score of AP exam", value: 'AVG_AP'},
  {text: "Proportion of students taking AP exam (%)", value: 'AP_TAKE'},
  {text: "Proportion of students taking SAT (%)", value: 'SAT_TAKE'},
  {text: "Average verbal SAT score", value: 'AVG_VERBAL'},
  {text: "Average math SAT score", value: 'AVG_MATH'},
  {text: "Average car mileage", value: 'MILE_M'},
  {text: "Average car age", value: 'CAR_AGE'},
  {text: "Proportion of blue-collar workers (%)", value: 'BLUE'},
  {text: "Proportion of pink-collar workers (%)", value: 'PINK'},
  {text: "Proportion of white-collar workers (%)", value: 'WHITE'},
  {text: "Proportion of government workers (%)", value: 'GOVT'},
  {text: "Proportion of teachers that add value (math)", value: 'va_math'},
  {text: "Proportion of teachers that add value (reading)", value: 'va_read'},
  {text: "Proportion ever incarcerated", value: 'PROPORTION_PRISONERS'}
]

// Populate dropdown
d3.select("#dropdown")
  .selectAll("option")
  .data(dropdown_options)
  .enter()
  .append("option")
  .attr("id", function(option) { return option.value; })
  .attr("value", function(option) { return option.value; })
  .text(function(option) { return option.text; });


//Width and height of map
var width = 600;
var height = 830;

var colorRange =  _.range(0,1,0.1).map(function(i){return d3.interpolateViridis(i)})

var lowColor = _.last(colorRange) // '#f9f9f9'
var highColor = _.first(colorRange) // '#bc2a66'

// first of two scales for linear fill; ref [1]
var fill_viridis = d3.scaleLinear()
                     .domain(d3.range(0, 1, 1.0 / (colorRange.length - 1)))
                     .range(colorRange);

// second of two scales for linear fill
var norm_fill = d3.scaleLinear()
                  .range([0,1]);

// D3 Projection
var projection = d3.geoMercator()
      .scale([40000])
      .translate([50250, 32390])

    // for geoAlbersUsa
    //.scale([33000])
    //.translate([-10000, 3300]);

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  .projection(projection); // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var minVal;
var maxVal;

var selected_dataset = "BMI_M";

function colorScale() {
  var variable = d3.select("#dropdown").property("value")
  d3.csv("data/data.csv", function(data) {
    var dataArray = [];
    for (var d = 0; d < data.length; d++) {
      dataArray.push(parseFloat(data[d][variable]))
    }
    minVal = d3.min(dataArray)
    maxVal = d3.max(dataArray)
  });
}

function chart(variable) {

    // Load GeoJSON data and merge with states data
    d3.json("data/merged.json", function(error, topology) {
			if (error) throw error;

      // Bind the data to the SVG and create one path per GeoJSON feature
      var selectedVar = document.getElementById("dropdown")

      map = svg.selectAll("path")
        .data(topology.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#FFF")
        .style("stroke-width", "0")
        .style("fill-opacity", "0.8")
        .call(updateFill, variable)
        .on("mouseover", function(d) {
          displayData(d);
        })
        .on("mouseout", function(d) {
          d3.select("#tooltip").remove()
          d3.select(this)
            .style("stroke-width", "0")
            .style("fill-opacity", "0.8")
        })
    });
}

function addLegend() {
  // add a legend
  colorScale()
  var w = 140, h = 300;

  var key = d3.select("#map")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "legend");

  var legend = key.append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "100%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

  legend.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", highColor)
    .attr("stop-opacity", 1);

  legend.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", lowColor)
    .attr("stop-opacity", 1);

  key.append("rect")
    .attr("width", w - 120)
    .attr("height", h)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(20,10)");

  var y = d3.scaleLinear()
    .range([h, 0])
    .domain([minVal, maxVal]);

  var yAxis = d3.axisRight(y);

  key.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(41,10)")
    .call(yAxis)
}

function updateFill(selection, selected_dataset) {
    var d_extent = d3.extent(selection.data(), function(d) {
        return parseFloat(d.properties[selected_dataset]);
    });

    rescaleFill(selection, d_extent);
}

function rescaleFill(selection, d_extent) {
    norm_fill.domain(d_extent)

    selection.transition()
             .duration(700)
             .attr("fill", function(d) {
                  var datum = parseFloat(d.properties[selected_dataset]);
                  return fill_viridis(norm_fill(datum));
  });
}

function displayData(d) {
  var selectedVar = document.getElementById("dropdown")

  d3.select(".town")
    .text(d.properties.NAME)
  d3.select(".blockgroup")
    .text("Blockgroup: " + d.properties.bg_id)
  d3.select(".variable")
    .text(selectedVar.options[selectedVar.selectedIndex].text)
  d3.select(".value")
    .text(parseFloat(d.properties[selected_dataset]));
  d3.select(this)
    .style("stroke-width", "3")
    .style("fill-opacity", "1")
}

var dropDown = d3.select("#dropdown");

dropDown.on("change", function() {
  d3.selectAll("g").remove()
  selected_dataset = d3.event.target.value;
  map.call(updateFill, selected_dataset)
});

chart(d3.select("#dropdown").property("value"))
