
function scatterplot(xVar, yVar) {
  d3.csv("data/ri_dat.csv", function(error, data) {
    if (error) throw error;
    data = data.filter(function(d){
             return (!isNaN(d[xVar]) && !isNaN(d[yVar]));
         });

    data.forEach(function (d) {
      d[xVar] = +d[xVar];
      d[yVar] = +d[yVar];
    });

    decimalFormat = d3.format("0.2f");
    var h = height/1.7, w = width;

    x = d3.scaleLinear()
        .range([0, w]);
    y = d3.scaleLinear()
        .range([h, 0]);

    //initialixe axis
    xAxis = d3.axisBottom()
        .scale(x);
    yAxis = d3.axisLeft()
        .scale(y);

    x.range([0, w/1.2]);
    y.range([h/1.8, 0]);

    x.domain(d3.extent(data, function (d) { return d[xVar]; })).nice();
    y.domain(d3.extent(data, function (d) { return d[yVar]; })).nice();

    var svg = d3.select(".scatterplot").append("svg")
              .attr("height", h+10)
              .attr("width", w)
              .attr("transform", "translate(" + w/20 +",0)");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(30," + h/1.7 + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(30,10)")
        .call(yAxis);

    svg.selectAll("circle").data(data).enter()
       .append("circle")
       .attr("cx", function(d) { return parseFloat(x(d[xVar]));})
       .attr("cy", function(d) { return parseFloat(y(d[yVar]));})
       .attr("r", 3)
       .attr("transform", "translate(30,10)")
       .attr("class", function(d) { return "point b" + d['bg_id']})
       .style("fill", "steelblue")
       .style("fill-opacity", 0.5)
       .on("mouseover", mouseover)
       .on("mouseout", mouseout)

     xSeries = d3.values(data.map(function (d) { return d[xVar]; }));
     ySeries = d3.values(data.map(function (d) { return d[yVar]; }));
     coefficients = leastSquares(xSeries, ySeries);

     x1 = _.min(xSeries);
     y1 = coefficients[0] * x1 + coefficients[1];
     x2 = _.max(xSeries);
     y2 = coefficients[0] * x2 + coefficients[1];
     pearson = coefficients[3]

     regressionData = [[x1, y1, x2, y2]];

     svg.selectAll(".regressionline")
           .data(regressionData)
         .enter()
           .append("line")
           .attr("class", "regressionline")
           .attr("x1", function(d) {return x(d[0]); })
           .attr("y1", function(d) {return y(d[1]); })
           .attr("x2", function(d) {return x(d[2]); })
           .attr("y2", function(d) {return y(d[3]); })
           .attr("stroke", "gray")
           .attr("stroke-width", 2)
           .attr("transform", "translate(30,10)");

     svg.append("text")
         .text(decimalFormat(coefficients[3]))
         .attr("class", "text-label")
         .attr("x", w/2)
         .attr("y", 0)
         .attr("fill", "gray")
         .attr("transform", "translate(-50,10)");

  });
}

function updateScatterplot(xVar, yVar) {
  d3.csv("data/ri_dat.csv", function(error, data) {
    if (error) throw error;
    nullArray = [];
    dataNull = data.filter(function(d){
              return (isNaN(d[xVar]) | isNaN(d[yVar]));
      });

    d3.selectAll("circle")
      .style("fill-opacity", 0.5);

    dataNull.forEach(function(d) {
      nullClass = "b" + d['bg_id']
      nullArray.push(nullClass);
      d3.selectAll("circle." + nullClass)
        .transition()
        .style("fill-opacity", 0);
    })

    data = data.filter(function(d){
              return (!isNaN(d[xVar]) && !isNaN(d[yVar]));
      });

    data.forEach(function (d) {
      d[xVar] = +d[xVar];
      d[yVar] = +d[yVar];
    });

    decimalFormat = d3.format("0.2f");

    h = height * 0.6;
    w = width;

    x = d3.scaleLinear()
        .range([0, w]);
    y = d3.scaleLinear()
        .range([h, 0]);

    //initialixe axis
    xAxis = d3.axisBottom()
        .scale(x);
    yAxis = d3.axisLeft()
        .scale(y);

    x.range([0, w/1.2]);
    y.range([h/1.8, 0]);

    x.domain(d3.extent(data, function (d) { return d[xVar]; })).nice();
    y.domain(d3.extent(data, function (d) { return d[yVar]; })).nice();

    var svg = d3.select(".scatterplot")

    svg.select(".x.axis")
        .attr("transform", "translate(30," + h/1.7 + ")")
        .transition()
        .duration(1000)
        .call(xAxis)

    svg.select(".y.axis")
        .attr("transform", "translate(30,10)")
        .transition()
        .duration(1000)
        .call(yAxis)

    svg.selectAll("circle")
       .data(data)
       .transition()
       .duration(1500)
       .attr("cx", function(d) { return parseFloat(x(d[xVar]));})
       .attr("cy", function(d) { return parseFloat(y(d[yVar]));})

   xSeries = d3.values(data.map(function (d) { return d[xVar]; }));
   ySeries = d3.values(data.map(function (d) { return d[yVar]; }));
   coefficients = leastSquares(xSeries, ySeries);

   x1 = _.min(xSeries);
   y1 = coefficients[0] * x1 + coefficients[1];
   x2 = _.max(xSeries);
   y2 = coefficients[0] * x2 + coefficients[1];
   pearson = coefficients[3]

   svg.select(".regressionline")
         .transition()
         .duration(2000)
         .attr("x1", function(d) {return x(x1); })
         .attr("y1", function(d) {return y(y1); })
         .attr("x2", function(d) {return x(x2); })
         .attr("y2", function(d) {return y(y2); });


   svg.select(".text-label")
     .tween("text", function() {
       return d3.interpolate(this.textContext, decimalFormat(coefficients[3]))
     })


  });
}
