//-----------------Initialize static bits---------------

let margin = { left: 80, right: 20, top: 50, bottom: 100 };

let width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

let g = d3
  .select("#chart-area1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Quarter");

// Y Label
g.append("text")
  .attr("y", -60)
  .attr("x", -(height / 2))
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Agents");

// Add jQuery UI slider
//Start here: review Udemy video on slider() method
$("#date-slider").slider({
  max: 100,
  min: 0,
  step: 1,
  range: false,
  value: 50,
  slide: function(event, ui) {
    console.log(ui.value);
  }
});
//-----------------BEGIN: DATA LOAD------------------------------

d3.csv("data/Book2.csv").then(function(data) {
  console.log(data);

  data.forEach(function(d) {
    //Update all values to be numbers/dates instead of string
    for (let property in d) {
      if (d.hasOwnProperty(property) && property !== "Year") {
        d[property] = parseFloat(d[property].replace(/,/g, ""));
      } else if (d.hasOwnProperty(property) && property == "Year") {
        d[property] = new Date(d[property]);
      }
    }
  });

  //Feed data into stack() method
  var stack = d3
    .stack()
    .keys(["Number of Active BB Agents", "Number of Agents"]);
  var series = stack(data);

  //x-scale:
  let xScaleValues = data.map(each => each.Year);
  let xScale = d3
    .scaleTime()
    .domain(d3.extent(xScaleValues))
    .range([0, width]);

  // y-scale:
  let yScaleValues = data.map(each => each["Number of Agents"]);
  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yScaleValues)])
    .range([height, 0]);

  //color-band scale:
  var z = d3
    .scaleOrdinal()
    .domain(["Number of Active BB Agents", "Number of Agents"])
    .range(["#98abc5", "#8a89a6"]);

  //x-axis:
  let xAxis = d3.axisBottom(xScale);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Y Axis
  var yAxis = d3.axisLeft(yScale);
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // Bars
  //outs qn - why are bars going out of bounds of scale...??
  g.append("g")
    .selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .attr("fill", function(d) {
      return z(d.key);
    })
    .selectAll("rect")
    .data(function(d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return xScale(d.data.Year);
    })
    .attr("y", function(d) {
      return yScale(d[1]);
    })
    .attr("height", function(d) {
      return yScale(d[0]) - yScale(d[1]);
    })
    .attr("width", 25);
});

//-----------------END: DATA LOAD-----------------------------
