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
function populateDropdown(drodownId) {
  d3.select("#" + drodownId)
    .selectAll("option")
    .data(dropdown_options)
    .enter()
    .append("option")
    .attr("id", function(option) { return option.value; })
    .attr("value", function(option) { return option.value; })
    .text(function(option) { return option.text; });

}
populateDropdown("dropdown");
populateDropdown("dropdown-right");


//Width and height of map
var margin = {top: 10, left: 10, bottom: 10, right: 10}
  , width = parseInt(d3.select('#map').style('width'))
  , width = width - margin.left - margin.right
  , mapRatio = 1.2
  , height = width * mapRatio + 20;

var centered;

var colorRange =  _.range(0,2,0.3).map(function(i){return d3.interpolateViridis(i)})

var lowColor = _.first(colorRange) // '#f9f9f9'
var highColor = _.last(colorRange) // '#bc2a66'

// first of two scales for linear fill; ref [1]
var fill_viridis = d3.scaleLinear()
                     .domain(d3.range(0, 1, 1.0 / (colorRange.length - 1)))
                     .range(colorRange);

// second of two scales for linear fill
var norm_fill = d3.scaleLinear()
                  .range([0,1]);

// D3 Projection
var mapBase = width * 4.7;
var projection = d3.geoMercator()
      .scale([mapBase * 12.339])
      .translate([mapBase * 15.528, mapBase * 10])

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  .projection(projection); // tell path generator to use albersUsa projection

var scale = d3.scaleLinear();

var axis = d3.axisRight();

d3.select(window).on('resize', resize);

//Create SVG element and append map to the SVG
function initMap(divId) {
  var svg = d3.select("#" + divId)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("rect")
      .attr("class", "background")
      .style("fill", "none")
      .attr("width", width)
      .attr("height", height)
      .on("click", clicked);

  var g = svg.append("g");
  return g;
}

var selected_dataset = "BMI_M";

function chart(variable, dropdown, divId) {
    // Load GeoJSON data and merge with states data
    d3.json("data/merged.json", function(error, topology) {
			if (error) throw error;
      g = initMap(divId)

      // Bind the data to the SVG and create one path per GeoJSON feature

      // var bbox = path.bounds(topology.features[0])
      // var s = .95 / Math.max((bbox[1][0] - bbox[0][0]) / width, (bbox[1][1] - bbox[0][1]) / height);
      // var t = [(width - s * (bbox[1][0] + bbox[0][0])) / 2, (height - s * (bbox[1][1] + bbox[0][1])) / 2];

      // console.log(t)
      // projection.scale(s).translate(t)
      g.append("g")
        .attr("id", "blkgrp")
        .selectAll("path")
        .data(topology.features)
        .enter()
        .append("path")
        .attr("class", function(d) {
          return divId + " b" + d.properties.bg_id;
        })
        .attr("d", path)
        .style("stroke", "#f8f8f8")
        .style("stroke-width", 0.3)
        .style("fill-opacity", 0.8)
        .call(updateFill, variable)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", clicked)

      var w = width * 0.1, h = 350;

      var legendClass = "legend " + divId + "legend";

      var selectedVar = d3.select("#" + dropdown).property("value");
      var extent = d3.extent(topology.features, function(d) {return d.properties[selectedVar]; });

      scale.range([h,0]).domain(extent);

      axis = d3.axisRight(scale);

      var key = d3.select("#" + divId)
        .append("svg")
        .attr("width", w)
        .attr("height", h+10)
        .attr("class", legendClass)
        .attr("transform", "translate(20,100)");

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
        .attr("class", "color-scale")
        .attr("width", "10px")
        .attr("height", h+3)
        .style("fill", "url(#gradient)");

      key.append("g")
        .attr("class", "y axis" + divId)
        .attr("transform", "translate(10,0)")
        .call(axis);

    });
  }

function toggle(){
    var fn = arguments;
    var l = arguments.length;
    var i = 0;
    return function(){
        if(l <= i) i=0;
        fn[i++]();
    }
}

// Functions to update and transition path fill

function updateFill(selection, selected_dataset) {
    var d_extent = d3.extent(selection.data(), function(d) {
        return parseFloat(d.properties[selected_dataset]);
    });

    rescaleFill(selection, d_extent);
}

function rescaleFill(selection, d_extent) {
    norm_fill.domain(d_extent)
    selection.transition()
             .duration(1200)
             .attr("fill", function(d) {
              var datum = parseFloat(d.properties[selected_dataset]);
              if (isNaN(datum)) { return "#fff";
              } else {
                return fill_viridis(norm_fill(datum));

              }
  });
}

function updateAxis(selected_dataset, divId) {
  var selection = d3.selectAll("." + divId).data();

  var extent = d3.extent(selection, function(d) {
      return parseFloat(d.properties[selected_dataset]);
  });

  var w = 140, h = 348;

  scale = d3.scaleLinear()
    .range([h,0])
    .domain(extent);

  axis = d3.axisRight(scale);

  d3.select(".axis" + divId)
    .transition()
    .call(axis);
}

// scatterplot

scatterplot("BMI_M", "BMI_M")

// plot init

chart(d3.select("#dropdown").property("value"), "dropdown", "map");
chart(d3.select("#dropdown-right").property("value"), "dropdown-right", "map-right");

updateData("dropdown", "map");
updateData("dropdown-right", "map-right");
