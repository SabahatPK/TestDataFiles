let cleanData = [];
let sliderBeginDate = new Date("12/1/2015");
let sliderEndDate = new Date("12/31/2018");

let formatDisplayDate = d3.timeFormat("%B %d, %Y");

$("#dateLabel1").text(formatDisplayDate(sliderBeginDate));
$("#dateLabel2").text(formatDisplayDate(sliderEndDate));

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

//x-scale:
let xScale = d3.scaleTime().range([0, width]);

//y-scale:
let yScale = d3.scaleLinear().range([height, 0]);

//color-band scale:
var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6"]);

//x-axis:
let xAxis = d3.axisBottom(xScale);
let xAxisCall = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

// Y Axis
var yAxis = d3.axisLeft(yScale);
let yAxisCall = g.append("g").attr("class", "y axis");

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

var t = function() {
  return d3.transition().duration(1000);
};

// Add jQuery UI slider
let sliderScale = d3
  .scaleTime()
  .domain([new Date("1/1/2015"), new Date("12/31/2018")])
  .range([0, 100]);

let threeMonthInterval =
  sliderScale(new Date("4/1/2017")) - sliderScale(new Date("1/1/2017"));

$("#date-slider").slider({
  max: 100,
  min: 0,
  step: threeMonthInterval,
  range: true,
  values: [0, 100],
  slide: function(event, ui) {
    sliderBeginDate = sliderScale.invert(ui.values[0]);
    sliderEndDate = sliderScale.invert(ui.values[1]);
    $("#dateLabel1").text(formatDisplayDate(sliderBeginDate));
    $("#dateLabel2").text(formatDisplayDate(sliderEndDate));
    updateBarChart();
  }
});

//---------------BEGIN DATA LOAD-----------------

d3.csv("data/Book2.csv").then(function(data) {
  cleanData = data;
  console.log(cleanData);

  // Prepare and clean data
  cleanData.forEach(function(d) {
    //Update all values to be numbers/dates instead of string
    for (let property in d) {
      if (d.hasOwnProperty(property) && property !== "Year") {
        d[property] = parseFloat(d[property].replace(/,/g, ""));
      } else if (d.hasOwnProperty(property) && property == "Year") {
        d[property] = new Date(d[property]);
      }
    }
  });

  // Run the visualization for the first time
  updateBarChart();
});

//---------------END DATA LOAD-----------------

function updateBarChart() {
  let timeCleanData = cleanData.filter(function(d) {
    return d.Year >= sliderBeginDate && d.Year <= sliderEndDate;
  });

  var series = d3
    .stack()
    .keys(["Number of Active BB Agents", "Number of Agents"])(timeCleanData);

  //x-scale:
  let xScaleValues = timeCleanData.map(each => each.Year);
  xScale.domain(
    d3.extent(xScaleValues, function(d) {
      return d;
    })
  );
  // xScale.domain(d3.extent(xScaleValues));
  //outs qn - will this fix bar overflow? https://stackoverflow.com/questions/39903065/d3-bar-chart-overflow

  // y-scale:
  let yScaleValues = timeCleanData.map(
    each => each["Number of Agents"] + each["Number of Active BB Agents"]
  );
  yScale.domain([0, d3.max(yScaleValues)]);

  //color-band scale:
  z.domain(["Number of Active BB Agents", "Number of Agents"]);

  //x-axis:
  let xAxis = d3.axisBottom(xScale);
  xAxisCall.call(xAxis);

  // Y Axis
  var yAxis = d3.axisLeft(yScale);
  yAxisCall.call(yAxis);

  // Bars
  //outs qn - why are bars going out of bounds of x-scale...??
  //data join
  let colorBand = g.selectAll("g.layer").data(series);

  //exit
  colorBand.exit().remove();

  //update
  //outs qn - should I keep classed() in update()
  //ans: seemed to be OK without it
  colorBand.classed("layer", true).attr("fill", function(d) {
    return z(d.key);
  });

  //enter
  colorBand
    .enter()
    .append("g")
    .classed("layer", true)
    .attr("fill", function(d) {
      return z(d.key);
    });

  //data join:
  let bars = g
    .selectAll("g.layer") //outs qn - is this the line that is tying series to data()
    .selectAll("rect")
    .data(function(d) {
      return d;
    });

  //exit:
  bars.exit().remove();

  //update:
  bars
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

  //enter:
  bars
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
}
