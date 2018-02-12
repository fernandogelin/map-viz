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
var width = 600,
    height = 830,
    centered;

var colorRange =  _.range(0,2,0.3).map(function(i){return d3.interpolateYlOrRd(i)})

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
var projection = d3.geoMercator()
      .scale([39700])
      .translate([49850, 32150])

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

svg.append("rect")
    .attr("class", "background")
    .style("fill", "#fff")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

var minVal;
var maxVal;

var selected_dataset = "BMI_M";

// Function to calculate color scale and min, max values based on csv data
function colorScale(selected_dataset) {
  d3.csv("data/data.csv", function(data) {
    var dataArray = [];
    for (var d = 0; d < data.length; d++) {
      dataArray.push(parseFloat(data[d][selected_dataset]))
    }
    minVal = d3.min(dataArray)
    maxVal = d3.max(dataArray)
  });
}

function chart(variable) {
    colorScale(variable)
    // Load GeoJSON data and merge with states data
    d3.json("data/merged.json", function(error, topology) {
			if (error) throw error;

      // Bind the data to the SVG and create one path per GeoJSON feature
      var selectedVar = document.getElementById("dropdown")

      // var bbox = path.bounds(topology)
      // var s = .95 / Math.max((bbox[1][0] - bbox[0][0]) / width, (bbox[1][1] - bbox[0][1]) / height);
      // var t = [(width - s * (bbox[1][0] + bbox[0][0])) / 2, (height - s * (bbox[1][1] + bbox[0][1])) / 2];
      // console.log(t)
      // projection.scale(s).translate(t)
      map = g.append("g")
        .attr("id", "blkgrp")
        .selectAll("path")
        .data(topology.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#c8c8c8")
        .style("stroke-width", "0.3")
        .style("fill-opacity", "0.8")
        .call(updateFill, variable)
        .on("mouseover", function(d) {
          d3.select(this)
            .style("stroke-width", "3")
            .style("fill-opacity", "1")
          displayData(d);
          plotAge(d);
          plotAgeRI();
          plotRace(d);
          plotRaceRI();
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("stroke-width", "0.3")
            .style("fill-opacity", "0.8")
        })
        .on("click", clicked)
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
        .attr("height", h + 40)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(20,10)");

    axisUpdate(variable)

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
// Function to update and transition axis
function axisUpdate(selected_dataset) {
    colorScale(selected_dataset)
    var svg = d3.select(".legend")
    var yScale = d3.scaleLinear()
    var yAxisCall = d3.axisRight()
    var w = 140, h = 300;

    setScale1()
    initAxis()

    setInterval(toggle(
        function(){
            setScale2()
            updateAxis()
        },
        function(){
            setScale1()
            updateAxis()
        }), 1000)

    function setScale1(){
        yScale.domain([minVal, maxVal]).range([h, 0])
        yAxisCall.scale(yScale)
    }

    function setScale2(){
        yScale.domain([minVal, maxVal]).range([h, 0])
        yAxisCall.scale(yScale)
    }

    function initAxis() {
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(41,10)")
            .call(yAxisCall)
    }

    function updateAxis(){
        var t = d3.transition()
            .duration(200)
        svg.select(".y")
            .transition(t)
            .call(yAxisCall)
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
             .duration(700)
             .attr("fill", function(d) {
                  var datum = parseFloat(d.properties[selected_dataset]);
                  return fill_viridis(norm_fill(datum));
  });
}

// function to plot demographics
var bars = d3.select(".age-plot")
             .append("svg")
             .attr("width", 400)
             .attr("height", 400)
             .append("g")


var ageBins = ["Xunder_5_years", "X10_to_14_years", "X15_to_17_years",
               "X18_to_21_years", "X22_to_24_years", "X25_to_29_years",
               "X30_to_34_years", "X35_to_39_years", "X40_to_44_years",
               "X45_to_49_years", "X50_to_54_years", "X55_to_59_years",
               "X5_to_9_years", "X60_and_61_years", "X62_to_64_years",
               "X65_and_66_years", "X67_to_69_years", "X70_to_74_years",
               "X75_to_79_years", "X80_to_84_years", "X85_years_and_over"];

function plotAge(d) {
  ageBins.forEach(function(element) {
    var width = parseFloat(d.properties[element]) * 2.5
    var i = ageBins.indexOf(element)
    bars.append("rect")
      .attr("class", element)
      .attr("height", 10)
      .attr("width", 0)
      .attr("transform", "translate(15," + i*12 + ")")
      .attr("fill", "blue")

    var elemClass = "." + element
    d3.select(elemClass)
      .transition().attrTween("width", function() {
        return d3.interpolateRound(this.getAttribute("width"), width)
      });
  })
}

function plotAgeRI() {
  d3.json("data/ri_age.json", function(error, data) {
    if (error) throw error;

    bars.selectAll("line").data(data).enter()
      .append("line")
      .attr("x1", function(d) { return parseFloat(d.value); })
      .attr("y1", function(d, i) { return i; })
      .attr("x2", function(d) { return parseFloat(d.value); })
      .attr("y2", function(d, i) { return i+10; })
      .attr("transform", function(d, i) {
        return "translate(15," + i*11 + ")";
      })
      .style("stroke-width", 2)
      .style("stroke", "black")
  });
}

// Race plot
var rWidth = 300,
    rHeight = 400;

var raceBar = d3.select('.race-plot')
  .append('svg')
  .attr('width', rWidth)
  .attr('height', rHeight)
  .attr('class', 'race-svg')
  .append('g')
  .attr('transform', 'translate(0,10)');

var rColor = d3.schemeDark2;

var races = ["american indian and alaska native ", "asian ", "black or african american ",
             "native hawaiian and other pacific islander ", "some other race ", "white "];

var classes = ["native-american", "black", "asian", "pacific", "other", "white"];

raceBar.selectAll(".race-section").data(classes).enter()
    .append("rect")
    .attr("class", "race-section")
    .attr("class", function(d) {return d})

function plotRace(d) {
  races.forEach(function(element) {
    var width = parseFloat(d.properties[element]) * 2
    var i = races.indexOf(element)

    var raceClass = "." + classes[i]
    d3.select(raceClass)
      .attr("transform", "translate(10," + i*25 + ")")
      .attr("fill", rColor[i])
      .attr("height", 20)
      .transition().attrTween("width", function() {
        return d3.interpolateRound(this.getAttribute("width"), width)
      });
    });
}

var raceAll = d3.select(".race-svg").append("g")
                .attr('transform', 'translate(0,10)');

function plotRaceRI() {
  d3.json("data/ri_race.json", function(error, data) {
    if (error) throw error;

    raceAll.selectAll("line").data(data).enter()
      .append("line")
      .attr("x1", function(d) { return parseFloat(d.value); })
      .attr("y1", function(d, i) { return i-2; })
      .attr("x2", function(d) { return parseFloat(d.value); })
      .attr("y2", function(d, i) { return i+22; })
      .attr("transform", function(d, i) {
        return "translate(10," + i*24 + ")";
      })
      .style("stroke-width", 3)
      .style("stroke", "black")
  });
}


// function to display data on the side
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
}

// functions to zoom on block group path
function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

// Dropdown change updates
var dropDown = d3.select("#dropdown");

dropDown.on("change", function() {
  d3.select(".y.axis").remove()
  selected_dataset = d3.select("#dropdown").property("value");
  map.call(updateFill, selected_dataset)
  axisUpdate(selected_dataset)
});

// plot init
chart(d3.select("#dropdown").property("value"))
