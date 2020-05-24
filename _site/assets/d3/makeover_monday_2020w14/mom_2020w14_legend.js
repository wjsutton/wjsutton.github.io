// setting dimensions of legend div
const width = 640 /2
const height = 20

// appending svg to legend div
const legend = d3.select("#legend")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

// appending svg to source div		
//const source = d3.select("#source")
//        .append("svg")
//        .attr("width", width)
//        .attr("height", height)

// Adding legend manually
legend.append("rect").attr("height",20).attr("width",20).attr("x",270 /2).attr("y",0).style("fill", "#445E93")
legend.append("rect").attr("height",20).attr("width",20).attr("x",370 /2).attr("y",0).style("fill", "#7EB2DD")
legend.append("text").attr("x", 160 /2).attr("y", 12).text("Paid work").style("font-size", "13px").attr("alignment-baseline","middle").attr("fill", "black")
legend.append("text").attr("x", 412 /2).attr("y", 12).text("Unpaid work").style("font-size", "13px").attr("alignment-baseline","middle").attr("fill", "black")

// Adding text at either end of div for author and source
//source.append("text").attr("x", 535/2).attr("y", 12).text("Source: UN Stats").style("font-size", "13px").attr("alignment-baseline","middle").attr("fill", "black")
//source.append("text").attr("x", 0).attr("y", 12).text("Author: Will Sutton").style("font-size", "13px").attr("alignment-baseline","middle").attr("fill", "black")
