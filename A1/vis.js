// Set Dimensions
const xSize = 500;
const ySize = 300;
const margin = 40;
const barWidth = 40;
const marginX = 2;

//Select and create a variable for the SVG
let svg = d3.select("#popviz")

d3.csv("usa_populations_top10_2018.csv") //load the data
    .then(data => { //wait for that the data is loaded
      data.forEach(d => { //convert the strings to numbers
        d["2018_Population"] = +d["2018_Population"]; 
        d["2018_Population"] /= 1000000; //showing population in millions in order not to have too big numbers with many zeros
      });
      data.sort(function(a, b){return b['2018_Population'] - a['2018_Population']}); // sorting descending
      console.log(data) //output the converted data in the console

//scaling bars height
const dataMax = d3.max(data,
    d => d["2018_Population"] 
    );
const maxBarHeight = ySize - margin*3.5;
const barScale = d3.scaleLinear()
    .domain([0, dataMax])		
    .range([0, maxBarHeight]);	

//adding bars, setting position, coloring
svg.selectAll("rect")
    .data(data)
    .enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", d => barScale(d["2018_Population"]))
        .attr("x", (d,i) => margin + i*(barWidth+marginX))
        .attr("y", d => margin + maxBarHeight - barScale(d["2018_Population"]))
        .style("fill", d => {
            return "rgb(1, 42, 88)";
        });

//adding X axis label: States
const n = data.length
const xAxisLength = n*(barWidth+marginX)
svg.append("text")             
    .attr("transform",
        "translate(" + (xAxisLength/2) + " ," + (maxBarHeight + margin*2) + ")")
    .text("States")

//adding and rotating Y axis label: Population
svg.append("text")
    .attr("y", margin*0.4)
    .attr("x", 0 - (ySize/1.5))
    .attr("transform", "rotate(-90)")
    .text("Population (millions)");
 
//adding Y axis    
const axisGroup = svg.append("g")
    .attr("transform", 
         "translate(" + margin + ", " + margin +")");

const yAxis = d3.axisLeft()
    .scale(barScale.domain([dataMax, 0])) //turning Y axis upside down
    .ticks(6);

axisGroup.call(yAxis);
 
 //adding bar labels     
const scale = d3.scaleBand()
         .domain(data.map(function(d) { return d.Abbreviation; }))
         .range([0, n*(barWidth+marginX)-marginX])

 //adding X axis
 svg.append("g")
    .attr("transform", "translate("+margin+",200)") 
    .call(d3.axisBottom(scale))
    })
.catch(error => console.log(error));