var width = 1000,
  height = 1000;

var projection = d3
  .geoMercator()
  .scale(1500)
  .translate([width / 2, height / 2])
  .precision(0.1)
  .center([65.46442018870623, 24.543590835433854]);

var path = d3.geoPath().projection(projection);

var graticule = d3.geoGraticule();

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json(
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/pakistan/pakistan-provinces.json"
).then(function(world) {
  console.log(world);
  console.log(topojson.feature(world, world.objects.PAK_adm1));
  console.log(topojson.mesh(world, world.objects.PAK_adm1));
  // console.log(graticule);

  svg
    .append("path")
    .attr("fill", "green")
    .datum(topojson.feature(world, world.objects.PAK_adm1))
    .attr("class", "land")
    .attr("d", path);

  svg
    .append("path")
    .datum(
      topojson.mesh(world, world.objects.PAK_adm1, function(a, b) {
        // console.log(a, b);

        return a !== b;
      })
    )
    .attr("class", "boundary")
    .attr("d", path)
    .attr("stroke", "white");

  svg
    .append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");
