/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.73761033783748, "KoPercent": 8.262389662162523};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9171251633561601, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5999153108981502, 500, 1500, "HTTP Request PUT character/4"], "isController": false}, {"data": [0.9955878027257574, 500, 1500, "HTTP Request Get characters"], "isController": false}, {"data": [0.9966815687777744, 500, 1500, "HTTP Request GET character/1"], "isController": false}, {"data": [0.9967283262759081, 500, 1500, "HTTP Request DELETE character/4"], "isController": false}, {"data": [0.9967015970510494, 500, 1500, "HTTP Request POST character"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1121782, 92686, 8.262389662162523, 24.14844952049564, 0, 6163, 6.0, 137.0, 160.0, 237.9900000000016, 934.0741875639073, 385.53837526104206, 184.54097958600275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request PUT character/4", 224350, 89757, 40.00757744595498, 5.621729440606086, 0, 4223, 4.0, 18.0, 23.0, 46.0, 186.81666402977743, 176.10677056227152, 42.811578335647546], "isController": false}, {"data": ["HTTP Request Get characters", 224378, 736, 0.32801789836793266, 92.24493042989951, 0, 6163, 119.0, 217.0, 261.0, 531.9900000000016, 186.83282318419657, 65.61267160547514, 31.460992391165874], "isController": false}, {"data": ["HTTP Request GET character/1", 224353, 733, 0.326717271442771, 8.574576671584401, 0, 4223, 5.0, 32.0, 37.0, 59.0, 186.81558421660495, 48.102878332409055, 31.64034104109055], "isController": false}, {"data": ["HTTP Request DELETE character/4", 224350, 729, 0.32493871183418765, 6.548616001782952, 0, 1638, 7.0, 25.0, 34.0, 50.0, 186.81619734318804, 46.64165458774907, 35.64159687775051], "isController": false}, {"data": ["HTTP Request POST character", 224351, 731, 0.3258287237409238, 7.744177650199831, 0, 1638, 6.0, 28.0, 35.0, 51.0, 186.81594111181425, 49.08520817633564, 42.991281553933646], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 89032, 96.05765703558251, 7.936657924623501], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 3654, 3.9423429644174957, 0.32573173753902274], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1121782, 92686, "500/Internal Server Error", 89032, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 3654, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request PUT character/4", 224350, 89757, "500/Internal Server Error", 89032, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 725, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request Get characters", 224378, 736, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 736, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request GET character/1", 224353, 733, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 733, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request DELETE character/4", 224350, 729, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 729, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request POST character", 224351, 731, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 731, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
