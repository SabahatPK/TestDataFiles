let stackAreaChart1;

let promises = [
  d3.json(
    "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/pakistan/pakistan-provinces.json"
  ),

  d3.csv("data/AgentAccountData.csv"),
  d3.csv("data/GenderByProvince.csv")
];

let parseTime = d3.timeParse("%Y");
let formatTime = d3.timeFormat("%B %d, %Y");

let sliderBegDate = new Date("1/1/2012");
let sliderEndDate = new Date("12/31/2017");

$("#dateLabel1").text("From " + formatTime(new Date("1/1/2012")));
$("#dateLabel2").text(" to " + formatTime(new Date("12/31/2017")));

// Add jQuery UI slider
$("#slider").slider({
  range: true,
  min: new Date("2012").getTime(),
  max: new Date("2019").getTime(),
  step: new Date("4/1/2010").getTime() - new Date("1/1/2010").getTime(),
  values: [new Date("2012").getTime(), new Date("2019").getTime()],
  slide: function(event, ui) {
    sliderBegDate = new Date(ui.values[0]);
    sliderEndDate = new Date(ui.values[1]);
    $("#dateLabel1").text("From " + formatTime(new Date(ui.values[0])));
    $("#dateLabel2").text(" to " + formatTime(new Date(ui.values[1])));
    updateCharts();
  }
});

//Button to reset slider back to default dates
$("#reset").click(function() {
  $("#slider").slider("values", [
    new Date("2012").getTime(),
    new Date("2019").getTime()
  ]);

  let resetSliderDates = $("#slider").slider("values");

  sliderBegDate = new Date(resetSliderDates[0]);
  sliderEndDate = new Date(resetSliderDates[1]);

  $("#dateLabel1").text("From " + formatTime(new Date(resetSliderDates[0])));
  $("#dateLabel2").text(" to " + formatTime(new Date(resetSliderDates[1])));

  updateCharts();
});

//outs - where does it make sense to add in regional comparisons, income gp comparisons
//outs - change colors to be grey scale? #design

//outs - Test this by adding delay diliberately; also needs to be on empty page; so slider has to be loaded after data?
while (promises.length.length === 0) {
  $("#loading").html("Data loading...");
}

Promise.all(promises).then(function(allData) {
  let geoData = allData[0];
  let agentData = allData[1];
  let genderData = allData[2];

  let pkFeaturesData = topojson.feature(geoData, geoData.objects.PAK_adm1);
  let pkMeshData = topojson.mesh(geoData, geoData.objects.PAK_adm1, function(
    a,
    b
  ) {
    return a !== b;
  });

  // Prepare and clean agent, account data
  //OUTS - there has to be a way to cycle through each dataset via allData
  //rather than repeat code on each individual dataset? Skip geoJSON dataset
  agentData.forEach(function(d) {
    //Update all values to be numbers/dates instead of string
    for (let property in d) {
      if (d.hasOwnProperty(property) && property !== "Date") {
        d[property] = parseFloat(d[property].replace(/,/g, ""));
      } else if (d.hasOwnProperty(property) && property == "Date") {
        d[property] = new Date(d[property]);
      }
    }
  });

  genderData.forEach(function(d) {
    //Update all values to be numbers/dates instead of string
    for (let property in d) {
      if (
        d.hasOwnProperty(property) &&
        property !== "Date" &&
        property !== "Province"
      ) {
        d[property] = parseFloat(d[property].replace(/,/g, ""));
      } else if (d.hasOwnProperty(property) && property == "Date") {
        d[property] = new Date(d[property]);
      }
    }
  });

  //Prep and clean gender data
  var nestedGenderData = d3
    .nest()
    .key(function(d) {
      return d.Province;
    })
    .entries(genderData);

  let onlyAzadKashmir = genderData.filter(
    each => each.Province === "Azad Kashmir"
  );

  let onlyBalochistan = genderData.filter(
    each => each.Province === "Balochistan"
  );

  let onlyGilgitBaltistan = genderData.filter(
    each => each.Province === "Gilgit Baltistan"
  );

  let onlyPunjabIncludingISB = genderData.filter(
    each => each.Province === "Punjab (Including ISB)"
  );

  let onlyKhyberPakhtunkhwa = genderData.filter(
    each => each.Province === "Khyber Pakhtunkhwa"
  );

  let onlySindh = genderData.filter(each => each.Province === "Sindh");

  let keys = ["Active Accounts", "All Accounts"];
  let keys1 = ["Active Agents", "All Agents"];
  let keys2 = ["Female", "Male"];

  let smallDimensions = {
    height: 250,
    width: 200,
    marginLeft: 60,
    marginRight: 20,
    marginTop: 25,
    marginBottom: 50
  };
  let largeDimensions = {
    height: 450,
    width: 400,
    marginLeft: 80,
    marginRight: 40,
    marginTop: 50,
    marginBottom: 100
  };

  stackAreaChart1 = new StackedArea(
    "#chart-area1",
    agentData,
    keys,
    largeDimensions
  );
  stackAreaChart2 = new StackedArea(
    "#chart-area2",
    agentData,
    keys1,
    largeDimensions
  );
  stackAreaChart3 = new StackedArea(
    "#chart-area5",
    onlyAzadKashmir,
    keys2,
    smallDimensions
  );
  stackAreaChart4 = new StackedArea(
    "#chart-area6",
    onlyBalochistan,
    keys2,
    smallDimensions
  );
  stackAreaChart5 = new StackedArea(
    "#chart-area4",
    onlyGilgitBaltistan,
    keys2,
    smallDimensions
  );
  stackAreaChart6 = new StackedArea(
    "#chart-area7",
    onlyPunjabIncludingISB,
    keys2,
    smallDimensions
  );
  stackAreaChart7 = new StackedArea(
    "#chart-area3",
    onlyKhyberPakhtunkhwa,
    keys2,
    smallDimensions
  );
  stackAreaChart8 = new StackedArea(
    "#chart-area8",
    onlySindh,
    keys2,
    smallDimensions
  );

  pakMap = new MapChart("#chart-area9", pkFeaturesData, pkMeshData);
});

function updateCharts() {
  stackAreaChart1.wrangleData(sliderBegDate, sliderEndDate);
  stackAreaChart2.wrangleData(sliderBegDate, sliderEndDate);
  stackAreaChart3.wrangleData(sliderBegDate, sliderEndDate);
  stackAreaChart4.wrangleData(sliderBegDate, sliderEndDate);
  stackAreaChart5.wrangleData(sliderBegDate, sliderEndDate);
  stackAreaChart6.wrangleData(sliderBegDate, sliderEndDate);
  stackAreaChart7.wrangleData(sliderBegDate, sliderEndDate);
  stackAreaChart8.wrangleData(sliderBegDate, sliderEndDate);
}

//"Go to top" button:
mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  scrollFunction();
};
function scrollFunction() {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.documentElement.scrollTop = 0;
}

//Create stand-alone legend for gender graphs
let color1 = d3.scaleOrdinal(d3.schemePaired).domain(["Female", "Male"]);

let standAloneLegend = d3
  .select(".allGenderGraphs")
  .append("svg")
  .attr("width", 100)
  .attr("height", 100)
  .attr("transform", "translate(" + 100 + "," + -900 + ")")
  .append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + 0 + "," + 25 + ")");

["Female", "Male"].forEach(function(eachKey, index) {
  let legendRow = standAloneLegend
    .append("g")
    .attr("transform", "translate(" + 0 + "," + index * 20 + ")");

  legendRow
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", color1(eachKey));

  legendRow
    .append("text")
    .attr("x", 50)
    .attr("y", 10)
    .style("font-size", "10px")
    .attr("text-anchor", "end")
    .style("text-transform", "capitalize")
    .text(eachKey);
});
