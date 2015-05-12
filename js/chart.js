 // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
    var chart;
    var data;
    var verticalBar;

    var apiCall = "https://chriswhong.cartodb.com/api/v2/sql?format=json&q=SELECT date_trunc('day', created_date) AS \"day\" , count(*) AS \"complaints\" FROM austinmusiccomplaints GROUP BY 1 ORDER BY 1";
    var cartodbData = [];

    cartodbData = [{
                area: true,
                values: [],
                key: "complaints",
                color: "red",
                strokeWidth: 4,
                classed: 'dashed'
            }]



    $.getJSON(apiCall,function(data){

    	data = data.rows;
    	data.forEach(function(row){
    	
    		var value = {
    			x: new Date(row.day),
    			y: row.complaints
			};
		
    		cartodbData[0].values.push(value);

    	})

   

    	nv.addGraph(function() {
        chart = nv.models.lineChart()
            .options({
                transitionDuration: 300,
                useInteractiveGuideline: true
            })
        ;

        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
            .axisLabel("")
            .tickFormat(function(d) {
          		return d3.time.format('%m-%d-%Y')(new Date(d))
      		})
            //staggerLabels(true)
        ;

        

        chart.yAxis
            .axisLabel('y')
            //.tickFormat(d3.format(',.2f'))
        ;

        chart.margin({
            top: 10,
            right: 30,
            bottom: 25,
            left: 35
        });


   
        d3.select('#chart').append('svg')
            .datum(cartodbData)
            .call(chart);

       
        //initialize a vertical bar on the chart that will indicate current time

         verticalBar = d3.select('svg')
          .append("line")
          .attr("x1", chart.margin().left)
          .attr("y1", chart.margin().top-5)
          .attr("x2", chart.margin().left)
          .attr("y2", 130)
          .style("stroke-width", 2)
          .style("stroke", "gray")
          .style("fill", "none");

        nv.utils.windowResize(chart.update);

        return chart;
    });
    })

    
