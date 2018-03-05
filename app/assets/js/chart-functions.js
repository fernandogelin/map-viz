function mouseover() {
  d3.select(".start-window").remove()
  d3.select(".stats-table").style("visibility", "visible")

  var c = "." + this.getAttribute("class").split(" ")[1];
  d3.selectAll(c)
    .style("stroke-width", 4)
    .style("fill-opacity", 1)
  d3.select("circle"+c)
      .style("fill", "red");
  d3.select(".scatterplot")
    .style("visibility", "visible")

  var d = d3.select(c).data();

  displayData(d);
  plotAge(d);
  plotAgeRI();
  plotRace(d);
  plotRaceRI();
}

function mouseout() {
  var c = "." + this.getAttribute("class").split(" ")[1];
  d3.selectAll(c)
    .style("stroke-width", 0.3)
    .style("fill-opacity", 0.8)
  d3.select("circle" + c)
    .style("fill", "steelblue");

}

// function to display data
function displayData(d) {
  var selectedVar = document.getElementById("dropdown");
  var selectedVar2 = document.getElementById("dropdown-right");
  var var1 = selectedVar.options[selectedVar.selectedIndex];
  var var2 = selectedVar2.options[selectedVar2.selectedIndex];

  d3.selectAll(".center-col")
    .style("background-color", "#f0f0f0")
  d3.select(".town")
    .text(d[0].properties.NAME)
  d3.select(".blockgroup")
    .text("Blockgroup: " + d[0].properties.bg_id)

  d3.selectAll(".current-value")
    .style("border-radius", "3px")
    .style("background-color", "#007bff")
}

// functions to zoom on block group path
function clicked(d) {
  var x, y, k;

  var pathClass = this.getAttribute("class").split(" ")[0];
  var g2 = d3.selectAll("." + pathClass);


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

  g2.selectAll("." + pathClass)
      .classed("active", centered && function(d) { return d === centered; });

  g2.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
}


// Dropdown change updates
function updateData(dropdownId, divId) {
  var dropDown = d3.select("#" + dropdownId);

  dropDown.on("change", function() {
    selected_dataset = d3.select("#" + dropdownId).property("value");
    d3.selectAll("." + divId)
      .call(updateFill, selected_dataset);
    updateAxis(selected_dataset, divId);

    var xVar = d3.select(".dropdown.left").property("value");
    var yVar = d3.select(".dropdown.right").property("value");
    updateScatterplot(xVar, yVar);

  });
}

function resize() {
  // Resize Maps
  width = parseInt(d3.select('#map').style('width'));
  width = width - margin.left - margin.right;
  height = width * mapRatio;
  mapBase = width * 4;


  projection = d3.geoMercator()
        .scale([mapBase * 12.339])
        .translate([mapBase * 15.528, mapBase * 10]);

  path = d3.geoPath()
           .projection(projection);

  d3.selectAll(".map").attr("d", path);
  d3.selectAll(".map-right").attr("d", path);

  d3.selectAll("legend").attr("height", height *0.5)

  // Resize map legend
  h = height * 0.6;
  w = width;

  scale.range([h*0.8, 0])

  d3.select('.axismap').call(axis);
  d3.select('.axismap-right').call(axis);

  d3.selectAll(".color-scale").attr("height", h*0.8+3);

  // Resize Scatterplot

  x.range([0, w/1.2]);
  y.range([h/1.8, 0]);

  d3.select(".scatterplot")
    .attr("height", h/1.8+10)
    .attr("width", w/2)
    .attr("transform", "translate(" + w/10 +",0)");

  d3.select(".x.axis")
    .attr("transform", "translate(60," + h/1.7 + ")")
    .call(xAxis);

  d3.select(".y.axis").call(yAxis);

  d3.select(".x.label")
    .attr("transform", "translate(" + w/2 + "," + h/1.4 + ")");

  d3.select(".y.label")
    .attr("x", -h/4-20);


  var xVar = d3.select(".dropdown.left").property("value");
  var yVar = d3.select(".dropdown.right").property("value");

  d3.selectAll("circle")
    .attr("cx", function(d) { return x(d[xVar]); })
    .attr("cy", function(d) { return y(d[yVar]); })

  d3.select(".regressionline")
    .attr("x1", function(d) {return x(d[0]); })
    .attr("y1", function(d) {return y(d[1]); })
    .attr("x2", function(d) {return x(d[2]); })
    .attr("y2", function(d) {return y(d[3]); })
    .attr("transform", "translate(" + w/10 +",0)");

}
