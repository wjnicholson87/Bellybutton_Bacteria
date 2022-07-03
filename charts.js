function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);
    var array = data.metadata.filter(sampleobject => sampleobject.id == sample);  
    var meta = array[0];
    var freq = meta.wfreq
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = firstSample.otu_ids;
    var labels = firstSample.otu_labels;
    var values  = firstSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = firstSample.otu_ids[9];

    // 8. Create the trace for the bar chart. 
    var barData = [ 
      {
        x:values.slice(0, 10).reverse(),
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        type:"bar",
        orientation: "h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
 
    // Deliverable 2: Create the Bubble Chart
    var bubbleData = [
      {
        x: ids, 
        y: values, 
        text: labels, 
        mode: "markers",
        marker: {
          color: ids,
          size: values 
        }
      }
    ];

    //Create the layout for the bubble chart.
    var bubbleLayout = {
      xaxis: { title: "OTU ID" },
      margin: { t: 0 },
      hovermode: "closest",
      };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3: Build Gauge
    var gaugeData = [ {
      domain: { x: [0, 1], y: [0, 1] },
      value: freq,
      title: {text: "<br>Belly Button Washing Frequency</br> <br>Srubs Per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          { range: [0, 1], color: 'rgb(248, 243, 236)' },
          { range: [1, 2], color: 'rgb(245, 242, 220)' },
          { range: [2, 3], color: 'rgb(235, 230, 202)' },
          { range: [3, 4], color: 'rgb(228, 232, 180)' },
          { range: [4, 5], color: 'rgb(215, 230, 170)' },
          { range: [5, 6], color: 'rgb(190, 220, 150)' },
          { range: [6, 7], color: 'rgb(150, 170, 145)' },
          { range: [7, 8], color: 'rgb(128, 162, 142)' },
          { range: [8, 9], color: 'rgb(133, 174, 141)' },
        ]
      }
    }
    ];
    
    //Create the layout for the gauge chart.
    var gaugeLayout = { width: 400, height: 250, margin: { t: 0, b: 0} };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};