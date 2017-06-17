// File: homeruns.js

// Main - Load content on page load.
$(document).ready(function() {
  hrBallTrace();
  loadHRDistanceBarChart();
  loadPlayerAllRoundsScore();
  loadRoundStats(3);
  loadRoundStats(2);
  loadRoundStats(1);
});

// Ball Paths ==================================================================
function hrBallTrace() {
  var homerun1 =[
    [375, 350],
    [380, 150],
    [375, 135]
  ];

  var homerun2 = [
    [375, 350],
    [300, 175],
    [150, 123]
  ];

  var homerun3 = [
    [375, 350],
    [250, 175],
    [75, 130]
  ];

  var homerun4 = [
    [375, 350],
    [250, 175],
    [100, 135]
  ];

  var homerun5 = [
    [375, 350],
    [300, 150],
    [200, 130]
  ];

  var line = d3.svg.line()
      .tension(0)
      .interpolate("cardinal");

  var svg = d3.select("#field").append("svg")
      .attr("width", 750)
      .attr("height", 430);

  var img = svg.selectAll("image").data([0]);

  img.enter()
      .append("svg:image")
      .attr("xlink:href", "img/red-ballpark.jpg")
      .attr("width", 750)
      .attr("height", 430);

  var path1 = svg.append("path")
      .data([homerun1])
      .attr("d", line)
      .style("stroke", "red")
      .call(pathTransition);

  var path2 = svg.append("path")
      .data([homerun2])
      .attr("d", line)
      .style("stroke", "blue")
      .call(pathTransition);

  var path3 = svg.append("path")
      .data([homerun3])
      .attr("d", line)
      .style("stroke", "orange")
      .call(pathTransition);

  var path4 = svg.append("path")
      .data([homerun4])
      .attr("d", line)
      .style("stroke", "green")
      .call(pathTransition);

  var path5 = svg.append("path")
      .data([homerun5])
      .attr("d", line)
      .style("stroke", "purple")
      .call(pathTransition);

  var circle1 = svg.append("circle")
      .attr("r", 8)
      .style("fill", "red")
      .attr("transform", "translate(" + homerun1[0] + ")");

  var circle2 = svg.append("circle")
      .attr("r", 8)
      .style("fill", "blue")
      .attr("transform", "translate(" + homerun2[0] + ")");

  var circle3 = svg.append("circle")
      .attr("r", 8)
      .style("fill", "orange")
      .attr("transform", "translate(" + homerun3[0] + ")");

  var circle4 = svg.append("circle")
      .attr("r", 8)
      .style("fill", "green")
      .attr("transform", "translate(" + homerun4[0] + ")");

  var circle5 = svg.append("circle")
      .attr("r", 8)
      .style("fill", "purple")
      .attr("transform", "translate(" + homerun5[0] + ")");

  circleTransition(circle1, path1);
  circleTransition(circle2, path2);
  circleTransition(circle3, path3);
  circleTransition(circle4, path4);
  circleTransition(circle5, path5);
}

function circleTransition(circle, path) {
  circle.transition()
      .duration(5000)
      .attrTween("transform", translateAlong(path.node()));
}

function pathTransition(path) {
  path.transition()
      .duration(5000)
      .attrTween("stroke-dasharray", tweenDash);
}

function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); };
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

// Farthest Distance Chart =========================================================

function loadHRDistanceBarChart() {
  var data = [
    {value:  450, color: "red"},
    {value:  449, color: "blue"},
    {value: 444, color: "orange"},
    {value: 443, color: "green"},
    {value: 440, color: "purple"},
  ];

  var width = 600,
      barHeight = 25;

  var x = d3.scale.linear()
      .range([0, width]);

  var chart = d3.select(".chart")
      .attr("width", width);

  x.domain([0, d3.max(data, function(d) { return d.value; })]);
  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", barHeight - 1)
      .style("fill", function(d) { return d.color; });

  bar.append("text")
      .attr("x", function(d) { return x(d.value) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .style("font-size", "14px")
      .text(function(d) { return d.value; });
}

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

// All Round Stats =============================================================

function loadPlayerAllRoundsScore() {
  $.getJSON("json/homeruns.json", function(data) {
    $.each(data.frazier, function(index, value) {
      $('table#allRounds tbody').append("<tr>" +
                                        "<td>" + value.total + "</td>" +
                                        "<td>" + value.distance + "</td>" +
                                        "</tr>");
    });
  });
}

function loadRoundStats(roundNum) {
  $.getJSON("json/round" + roundNum + ".json", function(data) {
    var elem = "table#round" + roundNum;
    $.each(data.round, function(index, value) {
      $(elem + ' tbody').append("<tr>" +
                                "<td><span class='player-image'><img src='" + value.img + "'></span><span class='player-name'>" + value.name + "</span></td>" +
                                "<td>" + value.HR + "</td>" +
                                "<td>" + value.long + "</td>" +
                                "<td>" + value.avg + "</td>");
    });
  });
}
