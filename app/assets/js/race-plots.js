// Race plot
var rWidth = 200,
    rHeight = 200;

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
    var width = parseFloat(d[0].properties[element]) * 2
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

    raceAll.selectAll("text").data(data).enter()
      .append("text")
      .attr("class", "race-lable")
      .attr("x", 10)
      .attr("y", function(d, i) { return i*25; })
      .text(function (d) { return d.race; })
      .attr("text-anchor", "end")
      .attr("font-size", '0.4rem')

    d3.selectAll(".race-lable")
      .attr("transform", "translate(190,12)")
  });
}
