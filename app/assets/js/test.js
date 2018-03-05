

// populate drop-down
d3.select("#dropdown")
  .selectAll("option")
  .data(dropdown_options)
  .enter()
  .append("option")
  .attr("value", function(option) { return option.value; })
  .text(function(option) { return option.text; });

// initial dataset on load
var selected_dataset = "empl13";

var w = 700,
    h = 650;

var svg = d3.select("#map")
            .append("svg")
            .attr("height", h)
            .attr("width", w);

var projection = d3.geo.mercator()
                   .center([-76.6180827, 39.323953])
                   .scale([140000])
                   .translate([270, 165]);

var path = d3.geo.path()
             .projection(projection);

// first of two scales for linear fill; ref [1]
var fill_viridis = d3.scale.linear()
                     .domain(d3.range(0, 1, 1.0 / (viridis_colors.length - 1)))
                     .range(viridis_colors);

// second of two scales for linear fill
var norm_fill = d3.scale.linear()
                  .range([0,1]);

var geojson = "https://feyderm.github.io/data/Workforce and Economic Development (2010-2013) - Shape.geojson";

d3.json(geojson, function(json) {

    plot = svg.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("stroke", "#808080")
              .attr("fill", "#b3b3b3")
              .call(updateFill, selected_dataset)
              .on("mouseover", function(d) { displayData(d); })
              .on("mouseout", hideData);
});

// dropdown dataset selection
var dropDown = d3.select("#dropdown");

dropDown.on("change", function() {

    // newly selected dataset includes downtown
    d3.select("#downtown")
      .property("checked", true);

    checked = true;

    selected_dataset = d3.event.target.value;

    plot.call(updateFill, selected_dataset)

});

// checkbox to include/exclude downtown
var checkbox = d3.select("#downtown");

checkbox.on("change", function() {

    checked = !checked;

    if (checked == false) {
        plot.call(updateFillxDt, selected_dataset);
    }
    else {
        plot.call(updateFill, selected_dataset);
    }
});

function displayData(d) {

    d3.select("#neighborhood")
       .text(d.properties.csa2010)

    d3.select("#datum")
      .text(parseFloat(d.properties[selected_dataset]).toFixed(2));
}

function hideData() {

    d3.select("#neighborhood")
      .text("\u00A0");

    d3.select("#datum")
      .text("\u00A0");
}

function updateFill(selection, selected_dataset) {

    var d_extent = d3.extent(selection.data(), function(d) {
        return parseFloat(d.properties[selected_dataset]);
    });

    rescaleFill(selection, d_extent);
}

function updateFillxDt(selection, selected_dataset) {

    var d_wo_downtown = selection.data()
                                 .filter(function(d) {
                                     return d.properties.csa2010 != "Downtown/Seton Hill";
                                 });

    d_extent_wo_downtown = d3.extent(d_wo_downtown, function(d) {
            return parseFloat(d.properties[selected_dataset]);
        });

    rescaleFill(selection, d_extent_wo_downtown)
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
