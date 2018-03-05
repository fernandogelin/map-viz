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

var colorRange =  _.range(0,1,0.1).map(function(i){return d3.interpolateWarm(i)})

var lowColor = _.last(colorRange) // '#f9f9f9'
var highColor = _.first(colorRange) // '#bc2a66'

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

function chart(variable) {
    d3.csv("data/data.csv", function(data) {

  	var dataArray = [];
  	for (var d = 0; d < data.length; d++) {
  		dataArray.push(parseFloat(data[d][variable]))
  	}
  	var minVal = d3.min(dataArray)
  	var maxVal = d3.max(dataArray)
  	var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])

    // Load GeoJSON data and merge with states data
    d3.json("data/merged.json", function(error, topology) {
			if (error) throw error;

      // Loop through each state data value in the .csv file
      for (var i = 0; i < data.length; i++) {
        // Grab State Name
        var dataState = data[i].bg_id;
        // Grab data value
        var dataValue = data[i][variable];
        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < topology.features.length; j++) {
          var jsonState = topology.features[j].properties.bg_id;

          if (dataState == jsonState) {
            // Copy the data value into the JSON
            topology.features[j].properties.value = dataValue;
            // Stop looking through the JSON
            break;
          }
        }
      }

      // Bind the data to the SVG and create one path per GeoJSON feature
      var selectedVar = document.getElementById("dropdown")

      svg.selectAll("path")
        .data(topology.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#FFF")
        .style("stroke-width", "0")
        .style("fill-opacity", "0")
        .style("fill", function(d) { return ramp(d.properties.value) })
        .on("mouseover", function(d) {
					d3.select(".town")
						.text(d.properties.NAME)
          d3.select(".blockgroup")
            .text("Blockgroup: " + d.properties.bg_id)
          d3.select(".variable")
            .text(selectedVar.options[selectedVar.selectedIndex].text)
          d3.select(".value")
            .text(d.properties.value)
          d3.select(this)
            .style("stroke-width", "3")
            .style("fill-opacity", "1")
        })
        .on("mouseout", function(d) {
          d3.select("#tooltip").remove()
          d3.select(this)
            .style("stroke-width", "0")
            .style("fill-opacity", "0.8")
        })
        .transition()
        .ease(d3.easeQuad)
        .duration(500)
        .style("fill-opacity", "0.8");

  		// add a legend
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
    });
  });
}


chart(d3.select("#dropdown").property("value"))

function updateMap() {
  d3.selectAll("path").transition().ease(d3.easeCubic).duration(1000).style("fill-opacity", "0")
  d3.selectAll("path").remove()
  d3.selectAll("legend").remove()
	d3.selectAll("g").remove()
  d3.select("#dropdown").on("change", chart(d3.select("#dropdown").property("value")))
}
