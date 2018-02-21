
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
              .attr("height", h/1.3)
              .attr("width", w)
              .attr("transform", "translate(" + -w/22 +",0)");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(60," + h/1.7 + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(60,10)")
        .call(yAxis);

    svg.append("text")
       .attr("class", "x label")
       .attr("transform", "translate(" + w/1.8 + "," + h/1.4 + ")")
       .style("text-anchor", "middle")
       .text(d3.select("#" + xVar).text());

    svg.append("text")
       .attr("class", "y label")
       .attr("x", -h/4)
       .attr("y", 20)
       .attr("transform", "rotate(-90)")
       .style("text-anchor", "middle")
       .text(d3.select("#" + yVar).text());


    svg.selectAll("circle").data(data).enter()
       .append("circle")
       .attr("cx", function(d) { return parseFloat(x(d[xVar]));})
       .attr("cy", function(d) { return parseFloat(y(d[yVar]));})
       .attr("r", 4)
       .attr("transform", "translate(60,10)")
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
           .attr("x1", function(d) {return x(d[0])+15; })
           .attr("y1", function(d) {return y(d[1])-8; })
           .attr("x2", function(d) {return x(d[2]); })
           .attr("y2", function(d) {return y(d[3]); })
           .attr("stroke", "gray")
           .attr("stroke-width", 2)
           .attr("transform", "translate(60,10)");

     svg.append("text")
         .text("r= " + decimalFormat(coefficients[3]))
         .attr("class", "text-label")
         .attr("x", w-20)
         .attr("y", 20)
         .attr("fill", "gray")
         .attr("transform", "translate(-50,10)");

  });
}

function updateScatterplot(xVar, yVar) {
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
        .attr("transform", "translate(60," + h/1.7 + ")")
        .transition()
        .duration(1000)
        .call(xAxis)

    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis)

    svg.select(".x.label")
       .attr("transform", "translate(" + w/1.8 + "," + h/1.4 + ")")
       .text(d3.select("#" + xVar).text());

    svg.select(".y.label")
       .attr("x", -h/3)
       .attr("y", 20)
       .attr("transform", "rotate(-90)")
       .text(d3.select("#" + yVar).text());

    svg.selectAll("circle")
       .transition()
       .ease(d3.easeQuadInOut)
       .duration(function() {return Math.random() * 1500 + 500 ;})
       .attr("cx", function(d) {
         if (isNaN(parseFloat(d[xVar]))) { return 0;
         } else {
           return parseFloat(x(d[xVar]));
         }
       })
       .attr("cy", function(d) {
         if (isNaN(parseFloat(d[yVar]))) { return 0;
         } else {
           return parseFloat(y(d[yVar]));
         }
       })
       .style("fill-opacity", function(d) {
         if ( isNaN(d[xVar]) || isNaN(d[yVar]) ) { return 0;
         } else {
           return 0.5
         }
       })
       .attr("r", function(d) {
         if ( isNaN(d[xVar]) || isNaN(d[yVar]) ) { return 0;
         } else {
           return 4
         }
       })
       ;

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
         .attr("x1", function(d) {return x(x1)+15; })
         .attr("y1", function(d) {return y(y1)-8; })
         .attr("x2", function(d) {return x(x2); })
         .attr("y2", function(d) {return y(y2); });

  var text = d3.select(".text-label").text();

   d3.select(".text-label")
      .transition()
      .duration(2000)
      .tween("text", function() {
         var i = d3.interpolate(text, decimalFormat(pearson));
         return function(t) {
           d3.select(".text-label").text("r= " + decimalFormat(i(t)));
       };
     });


  });
}
