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
