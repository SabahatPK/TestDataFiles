MapChart = function(
  _parentElement,
  _districtData,
  _provinceData,
  _MFData,
  _dimensionSVG
) {
  this.parentElement = _parentElement;
  this.pakDistrictData = _districtData;
  this.pakProvinceData = _provinceData;
  this.MFData = _MFData;
  this.dimensions = _dimensionSVG;
  this.borrByDistrict = {};
  this.initVis();
};

//OUTS - click on province to isolate that data in area charts
//OUTS - allow map to size down with containers.

MapChart.prototype.initVis = function() {
  let vis = this;

  vis.myProjection = d3
    .geoMercator()
    .scale(2500)
    .precision(0.1)
    //outs - need more robust translation setting:
    .translate([vis.dimensions.width / 2.5, vis.dimensions.height / 2])
    .center([67, 30]);

  vis.myPathGenerator = d3.geoPath().projection(vis.myProjection);

  // Define the div for the tooltip
  vis.div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //outs - map needs to be centered on card; via translate() ?
  vis.svg = d3
    .select(vis.parentElement)
    .append("svg")
    .attr("width", vis.dimensions.width)
    .attr("height", vis.dimensions.height);

  //Format district data structure into something more palatable to d3:
  vis.MFData.forEach(d => {
    vis.borrByDistrict[d["District"]] = +d["Active Borrowers"];
  });
  //outs - Need min and max of ALL the rows of districts; but the domain is
  //SO wide that the resulting diff in colors is barely noticeable, if at all.
  vis.allDistBorr = [];
  vis.MFData.forEach(d => {
    vis.allDistBorr.push(+d["Active Borrowers"]);
  });
  vis.extentBorrowerPermanent = d3.extent(vis.allDistBorr);

  vis.extentBorrower = d3.extent(Object.values(vis.borrByDistrict));

  //outs - there aren't enough distinctions b/w the provinces
  vis.color = d3
    .scaleQuantize()
    .domain(vis.extentBorrower)
    .range(d3.schemeBlues[9]);

  vis.svg
    .append("g")
    .selectAll("path")
    .attr("class", "district")
    .data(vis.pakDistrictData.features)
    .enter()
    .append("path")
    .attr("d", vis.myPathGenerator)
    .style("fill", d =>
      vis.borrByDistrict[d.properties.NAME_3]
        ? vis.color(vis.borrByDistrict[d.properties.NAME_3])
        : vis.color(0)
    )
    .on("mouseover", d => {
      vis.div
        .html(
          d.properties.NAME_3 + "," + vis.borrByDistrict[d.properties.NAME_3]
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px")
        .style("opacity", 0.9);
    })
    .on("mouseout", d => vis.div.style("opacity", 0));

  vis.svg
    .append("g")
    .selectAll("path")
    .attr("class", "province")
    .data(vis.pakProvinceData.features)
    .enter()
    .append("path")
    .attr("d", vis.myPathGenerator)
    .style("fill", "none")
    //outs - double check if this is working properly, i.e. triggering
    .on("mouseover", d => {
      console.log(d);
    })
    .on("mouseout", d => console.log("done"))
    .style("stroke", "grey");
  // .style("stroke-width", ".5px");
};

MapChart.prototype.wrangleData = function(begDate, endDate) {
  let vis = this;

  // console.log(endDate);

  //start here
  //Select year to display:
  vis.filteredData = vis.MFData.filter(d => {
    // console.log(d["Date"]);
    // console.log(endDate.getTime());
    d["Date"].getTime() <= endDate.getTime();
  });

  // vis.filteredData = vis.pakDistrictData.filter(
  //   each => each.Date >= begDate && each.Date <= endDate
  // );

  console.log(vis.filteredData);

  // vis.updateVis();
};

MapChart.prototype.updateVis = function() {
  let vis = this;
};
//----------------end of old code--------------

//outs - create dataset of microcredit borrowers, GLP for each district from PMN's MicroWatch reports

// Promise.all(promises).then(function(allData) {
//   // let districtData = allData[0];
//   // let provinceData = allData[1];
//   //HandyTip - refer to these for creating chloropeth map:
//   //https://observablehq.com/d/9a13ec59b29db4fa
//   //http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/
// });
