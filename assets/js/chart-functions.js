function mouseover() {
  d3.select(".start-window").remove()
  var c = "." + this.getAttribute("class").split(" ")[1];
  d3.selectAll(c)
    .style("stroke-width", 4)
    .style("fill-opacity", 1)
  d3.select("circle"+c)
      .style("fill", "red")
      .transition()
      .attr("r", 4);
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
    .style("fill", "steelblue")
    .transition()
    .attr("r", 3)
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
