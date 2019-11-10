MapChart = function(_parentElement, _featuresData, _meshData) {
  this.parentElement = _parentElement;
  this.pakFeaturesData = _featuresData;
  this.pakMeshData = _meshData;
  this.initVis();
};

//OUTS - click on province to isolate that data in area charts
//OUTS - allow map to size down with containers.

MapChart.prototype.initVis = function() {
  let vis = this;

  (vis.width = 800), (vis.height = 800);

  vis.projection = d3
    .geoMercator()
    .scale(2500)
    .translate([vis.width / 2, vis.height / 2])
    .precision(0.1)
    .center([67, 30]);

  vis.path = d3.geoPath().projection(vis.projection);

  vis.svg = d3
    .select(vis.parentElement)
    .append("svg")
    .attr("width", vis.width)
    .attr("height", vis.height);

  //outs: https://www.youtube.com/watch?v=9ZB1EgaJnBU

  vis.svg
    .append("path")
    .attr("fill", "rgb(255, 208, 44)")
    .datum(vis.pakFeaturesData)
    .attr("d", vis.path)
    .attr("class", "land")
    .attr("opacity", 0.35)
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .on("click", function(geography) {
      console.log(geography.features);
    });

  vis.svg
    .append("path")
    .attr("class", "boundary")
    .datum(vis.pakMeshData)
    .attr("d", vis.path)
    .attr("stroke", "black")
    .attr("stroke-width", "0.5px")
    .attr("fill", "none");
};

MapChart.prototype.wrangleData = function() {
  let vis = this;
};

MapChart.prototype.updateVis = function() {
  let vis = this;
};
