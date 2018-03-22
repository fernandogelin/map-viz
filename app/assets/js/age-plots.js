// function to plot demographics
var bars = d3.select('.age-plot')
             .append('svg')
             .attr('width', 200)
             .attr('height', 250);

var ageBins = ['Xunder_5_years', 'X5_to_9_years', 'X10_to_14_years', 'X15_to_17_years',
               'X18_to_21_years', 'X22_to_24_years', 'X25_to_29_years',
               'X30_to_34_years', 'X35_to_39_years', 'X40_to_44_years',
               'X45_to_49_years', 'X50_to_54_years', 'X55_to_59_years',
               'X60_and_61_years', 'X62_to_64_years',
               'X65_and_66_years', 'X67_to_69_years', 'X70_to_74_years',
               'X75_to_79_years', 'X80_to_84_years', 'X85_years_and_over'];

bars.selectAll('.age-section').data(ageBins).enter()
    .append('rect')
    .attr('class', 'age-section')
    .attr('class', function (d) {return d})
    .attr('height', 10)
    .attr('width', 0)
    .attr('transform', function(d, i) {
      return 'translate(70,' + i*12 + ')'
    })
    .attr('fill', 'grey')

function plotAge(d) {
  ageBins.forEach(function(element) {
    var width = parseFloat(d[0].properties[element]) * 2.5
    var i = ageBins.indexOf(element)

    var elemClass = '.' + element
    d3.select(elemClass)
      .transition().attrTween('width', function() {
        return d3.interpolateRound(this.getAttribute('width'), width)
      });
  })
}

function plotAgeRI() {
  d3.json('data/ri_age.json', function(error, data) {
    if (error) throw error;

    var ageBars = bars.selectAll('g').data(data).enter().append('g');

    ageBars.append('line')
        .attr('x1', function(d) { return parseFloat(d.value); })
        .attr('y1', function(d, i) { return i; })
        .attr('x2', function(d) { return parseFloat(d.value); })
        .attr('y2', function(d, i) { return i+10; })
        .attr('transform', function(d, i) {
          return 'translate(70,' + i*11 + ')';
        })
        .style('stroke-width', 2)
        .style('stroke', 'black');

    ageBars.append('text')
        .attr('x', 50)
        .attr('y', function(d, i) { return i*12; })
        .text(function(d) { return d.text; })
        .attr('text-anchor', 'end')
        .attr('font-size', '0.4rem')

    ageBars.selectAll('text').attr('transform', 'translate(10,9)')
  });
}
