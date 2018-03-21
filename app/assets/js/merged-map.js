// Dropdown values

var dropdown_options = [
  {text: 'Average BMI',
  value: 'BMI_M',
  description: 'Body mass index (BMI) was constructed from anonymous height and weight data from the Division of Motor Vehicles database, 2014 records. BMI equals weight (in kg) divided by the square of height (in meters).'
  },
  {text: 'Unemployment claimants per 100 people',
  value: 'P_UI',
  description: 'Unemployment claimants were calculated from the anonymous count of people who applied for and received payment for unemployment insurance in 2014. This measure shows the number of anonymous claimants out of every 100 people who paid income tax in 2014.'
  },
  {text: 'TDI claimants per 100 people',
  value: 'P_TDI',
  description: 'Temporary disability insurance (TDI) claimants were calculated from the number of anonymous individuals who applied for and received payment for TDI in 2014, excluding any TDI payments related to pregnancy. This metric shows the number of claimants out of every 100 people who paid income tax in 2014.'
  },
  {text: 'Average score of AP exam',
  value: 'AVG_AP',
  description: 'The average Advanced Placement (AP) score was constructed by taking the average of all anonymized AP exam scores for exams taken during the school years 2012-13 through 2014-15.'
  },
  {text: 'Proportion of students taking AP exam (%)',
  value: 'AP_TAKE',
  description: 'The number of anonymized individuals who took the Advanced Placement (AP) exam was divided by the total number of students. The sample was restricted to anonymized students turning 18 in the school years 2012-13 through 2014-15.'
  },
  {text: 'Proportion of students taking SAT (%)',
  value: 'SAT_TAKE',
  description: 'The number of anonymized students who had taken the SAT exam was divided by the total number of students. The sample was restricted to anonymized students turning 18 years old during the school years 2012-13 through 2014-15.'
  },
  {text: 'Average verbal SAT score',
  value: 'AVG_VERBAL',
  description: 'The average verbal SAT score was constructed by taking the average of all verbal SAT exam scores from anonymized data on exams taken during the school years 2012-13 through 2014-15.'
  },
  {text: 'Average math SAT score',
  value: 'AVG_MATH',
  description: 'The average math SAT score was constructed by taking the average of all math SAT exam scores from anonymized data on exams taken during the school years 2012-13 through 2014-15.'
  },
  {text: 'Average car mileage',
  value: 'MILE_M',
  description: 'The average of the reported car mileage was constructed from anonymized car mileages for registered vehicles renewing registration in 2014 in the Division of Motor Vehicles database.'
  },
  {text: 'Average car age',
  value: 'CAR_AGE',
  description: 'The age of a vehicle was calculated from anonymized data on vehicle year for renewed registration data in the Division of Motor Vehicles database, excluding any vehicles which have a year prior to 1900.'
  },
  {text: 'Proportion of blue-collar workers (%)',
  value: 'BLUE',
  description: 'Using North American Industry Classification (NAICS) codes from the Department of Labor and Training data, data from anonymized firms were separated into industries based on categorizations put together by the Bureau of Labor Statistics.'
  },
  {text: 'Proportion of pink-collar workers (%)',
  value: 'PINK',
  description: 'Using North American Industry Classification (NAICS) codes from the Department of Labor and Training data, anonymized data on firms were separated into industries based on categorizations put together by the Bureau of Labor Statistics.'
  },
  {text: 'Proportion of white-collar workers (%)',
  value: 'WHITE',
  description:'Using North American Industry Classification (NAICS) codes from the Department of Labor and Training data, anonymized data on firms were separated into industries based on categorizations put together by the Bureau of Labor Statistics.'
  },
  {text: 'Proportion of government workers (%)',
  value: 'GOVT',
  description: 'Using North American Industry Classification (NAICS) codes from the Department of Labor and Training data, anonymized data on firms were separated into industries based on categorizations put together by the Bureau of Labor Statistics.'
  },
  {text: 'Proportion of teachers that add value (math)',
  value: 'va_math',
  description: "The fraction of anonymized elementary and middle school teachers accessible by students in a given census block that had a positive impact on test scores. A teacher's value-added is defined as the average test-score gain for her students, adjusted for differences across classrooms in students’ characteristics (including previous test scores). The estimates were constructed using Empirical Bayes shrinkage methods described in Kane and Staiger (2008). Model data included anonymized NECAP and PARCC standardized test scores from academic years 2011-2012 through 2014-2015."
  },
  {text: 'Proportion of teachers that add value (reading)',
  value: 'va_read',
  description: "The fraction of anonymized elementary and middle school teachers accessible by students in a given census block that had a positive impact on test scores. A teacher's value-added is defined as the average test-score gain for her students, adjusted for differences across classrooms in students’ characteristics (including previous test scores). The estimates were constructed using Empirical Bayes shrinkage methods described in Kane and Staiger (2008). Model data included anonymized NECAP and PARCC standardized test scores from academic years 2011-2012 through 2014-2015."},
  {text: 'Proportion ever incarcerated',
  value: 'PROPORTION_PRISONERS',
  description: 'The proportion of people who have ever been incarcerated was constructed using the most recent block group of residence from anonymized records of individuals who have ever been incarcerated. This number is presented as a proportion of the population over the age of 18. Note: there is a block group which may be disproportionately listed as a residential area for prior convicts due to the location of homeless shelters in the area.'
}
]

// Populate dropdown
function populateDropdown(dropownId) {
  d3.select("#" + dropownId)
    .selectAll("option")
    .data(dropdown_options)
    .enter()
    .append("option")
    .attr("id", function(option) { return option.value; })
    .attr("value", function(option) { return option.value; })
    .text(function(option) { return option.text; });

}
populateDropdown("dropdown-left");
populateDropdown("dropdown-right");

function displayDataDescription(dropdownId) {
  const position =  dropdownId.split("-")[1];
  var currentValue = d3.select("#" + dropdownId).property("value");
  var svg = d3.select(".data-description." + position);
  var description = _.where(dropdown_options, {value: currentValue});

  var textDescription = svg.append('text')
    .attr('x', '0')
    .attr('y', '0')
    .append('tspan')
    .attr('x', '0')
    .attr('dy', '1.2em')
    .attr('transform', 'translate(40,0)')
    .text(description[0].description)
    
  textDescription.append('tspan')
    .attr('x', '0')
    .attr('dy', '1.2em')
    .text('Block Groups are statistical divisions of census tracts, they are generally defined to contain between 600 and 3,000 people. A block group consists of clusters of blocks and usually covers a contiguous area. Block groups on the maps that appear in gray have insufficient data for the particular variable. Data sources: Rhode Island Government provided anonymized data for all indicators used on the maps and correlation plot. Demographics plots were created using Census data.')
}

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

chart(d3.select("#dropdown-left").property("value"), "dropdown-left", "map");
chart(d3.select("#dropdown-right").property("value"), "dropdown-right", "map-right");

updateData("dropdown-left", "map");
updateData("dropdown-right", "map-right");

displayDataDescription("dropdown-left");
displayDataDescription("dropdown-right");
