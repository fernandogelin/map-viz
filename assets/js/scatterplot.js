var Chart = (function(window,d3) {
  var xVar = d3.select(".dropdown.left").property("value");
  var yVar = d3.select(".dropdown.right").property("value");

  var svg, data, x, y, xAxis, yAxis, margin = {}, width, height, heightTop, decimalFormat, x1, x2, y1, y2, coefficients, xSeries, ySeries, regressionData, pearson;

  d3.csv('data/ri_dat.csv', render);

  function render(csv) {
    var breakPoint = 768;
    data = csv;

    data = data.filter(function(d){
              return (!isNaN(d[xVar]) && !isNaN(d[yVar]));
          });

    data.forEach(function (d) {
      d[xVar] = +d[xVar];
      d[yVar] = +d[yVar];
    });

    decimalFormat = d3.format("0.2f");
    //initialize scales
    x = d3.scaleLinear()
        .range([0, width]);
    y = d3.scaleLinear()
        .range([height, 0]);

    //initialixe axis
    xAxis = d3.axisBottom()
        .scale(x);
    yAxis = d3.axisLeft()
        .scale(y);

    //initialize svg
    svg = d3.select(".scatterplot").append("svg");

    //get dimensions based on window size
    updateDimensions(window.innerWidth);

    x.range([0, width]);
    y.range([height, 0]);

    x.domain(d3.extent(data, function (d) { return d[xVar]; })).nice();
    y.domain(d3.extent(data, function (d) { return d[yVar]; })).nice();

    svg
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);


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
          .attr("stroke-width", 2);

    svg.append("text")
        .text("r=" + decimalFormat(coefficients[3]))
        .attr("class", "text-label")
        .attr("x", function(d) {return x(x2) - 60;})
        .attr("y", function(d) {return y(y2) - 200;})
        .attr("fill", "gray");

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Average math SAT score");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Average BMI");

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d[xVar]); })
        .attr("cy", function (d) {return y(d[yVar]); })
        .style("fill", "steelblue")
        .style("fill-opacity", 0.5);

    d3.selectAll(".y, circle, .regressionline, .text-label")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.selectAll(".x")
      .attr('transform', 'translate(' + margin.left + ',' + heightTop +')');

  }

  function updateDimensions(winWidth) {
    margin.top = 20;
    margin.right = 20;
    margin.left = 40;
    margin.bottom = 30;

    width = winWidth/2 - margin.left - margin.right;
    height = .7 * width;
    heightTop = height + margin.top;
  }

  function leastSquares(a, b) {
    var sumSeries =  function (sum, val) {return sum + val; };
    var xhat = a.reduce(sumSeries) / a.length;
    var yhat = b.reduce(sumSeries) / b.length;
    var sumSquaresXX = a.map( function (d) { return Math.pow(d - xhat, 2);})
      .reduce(sumSeries);
    var sumSquaresYY = b.map( function (d) { return Math.pow(d - yhat, 2);})
      .reduce(sumSeries);
    var XY = a.map(function (d,i) { return (d - xhat) * (b[i] - yhat);})
      .reduce(sumSeries);

    var slope = XY / sumSquaresXX;
    var intercept = yhat - (xhat * slope);
    var rSquare = Math.pow(XY, 2) / (sumSquaresXX * sumSquaresYY);
    var pearsonR = XY / (Math.sqrt(sumSquaresXX) * Math.sqrt(sumSquaresYY))

    return [slope, intercept, rSquare, pearsonR];
  }

  return {
    render : render
  }
})(window,d3);

window.addEventListener('resize', Chart.render);
