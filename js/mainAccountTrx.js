let margin = { left: 80, right: 20, top: 50, bottom: 100 };

let width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

let svg = d3
  .select("#chart-area3")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

let g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.csv("data/Book2.csv").then(function(data) {
  cleanData = data;

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

  console.log(cleanData);

  let stack1 = d3.stack().keys(["Active Accounts", "Number of Accounts"]);

  let series1 = stack1(cleanData);

  let xScale1 = d3
    .scaleTime()
    .domain([new Date("2015/12/01"), new Date("2018/12/01")])
    .range([0, width]);

  let yScale1 = d3
    .scaleLinear()
    .domain([0, 65000000])
    .range([height, 0]);

  let color1 = d3
    .scaleOrdinal(d3.schemeAccent)
    .domain(["Active Accounts", "Number of Accounts"]);

  let xAxis1 = d3.axisBottom().scale(xScale1);
  let yAxis1 = d3.axisLeft().scale(yScale1);

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis1);

  g.append("g")
    .attr("class", "y axis")
    .call(yAxis1);

  let area1 = d3
    .area()
    .x(function(d) {
      return xScale1(new Date(d.data.Year));
    })
    .y0(function(d) {
      return yScale1(d[0]);
    })
    .y1(function(d) {
      return yScale1(d[1]);
    });

  let browser = g
    .selectAll(".browser")
    .data(series1)
    .enter()
    .append("g")
    .attr("class", function(d) {
      return "browser " + d.key;
    })
    .attr("fill-opacity", 0.5);

  browser
    .append("path")
    .attr("class", "area")
    .attr("d", area1)
    .style("fill", function(d) {
      return color1(d.key);
    });
});
