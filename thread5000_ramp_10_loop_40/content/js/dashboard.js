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

    var data = {"OkPercent": 95.642636945696, "KoPercent": 4.357363054304008};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.945101375385345, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9502667773298553, 500, 1500, "HTTP Request PUT character/4"], "isController": false}, {"data": [0.9339844676310173, 500, 1500, "HTTP Request Get characters"], "isController": false}, {"data": [0.9405857244486602, 500, 1500, "HTTP Request GET character/1"], "isController": false}, {"data": [0.9543781124021816, 500, 1500, "HTTP Request DELETE character/4"], "isController": false}, {"data": [0.9462917951150107, 500, 1500, "HTTP Request POST character"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 843400, 36750, 4.357363054304008, 1367.7914311121865, 0, 102037, 35.0, 99.0, 114.0, 158.8100000000304, 1861.855365141317, 11867.223323251917, 353.2406696306368], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request PUT character/4", 168680, 5784, 3.428977946407399, 1118.1237609675002, 0, 100960, 102.0, 152.0, 208.0, 520.9800000000032, 372.39080282141003, 124.53013796940714, 82.71280100283687], "isController": false}, {"data": ["HTTP Request Get characters", 168680, 9162, 5.431586435854873, 1871.7670085368343, 1, 102037, 102.0, 153.0, 211.0, 591.9800000000032, 372.37518322942975, 11353.33864967154, 59.493974090420416], "isController": false}, {"data": ["HTTP Request GET character/1", 168680, 8353, 4.951980080626037, 1618.4944391747554, 0, 100959, 102.0, 151.0, 210.0, 521.9900000000016, 372.38422599139466, 135.49274391078495, 60.14279979849792], "isController": false}, {"data": ["HTTP Request DELETE character/4", 168680, 5778, 3.4254209153426607, 817.3021697889525, 0, 100960, 102.0, 152.0, 211.0, 531.9900000000016, 372.39655773824506, 119.89463780651296, 68.83742187465504], "isController": false}, {"data": ["HTTP Request POST character", 168680, 7673, 4.548849893289068, 1413.2697770927373, 0, 100960, 102.0, 154.0, 213.95000000000073, 497.0, 372.3875143773636, 134.11797961753453, 82.06917038265864], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19692, 53.583673469387755, 2.3348351908940006], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 914, 2.4870748299319727, 0.10837087977235], "isController": false}, {"data": ["500/Internal Server Error", 65, 0.17687074829931973, 0.0077069006402655914], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 2626, 7.145578231292517, 0.3113587858667299], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Operation timed out", 13441, 36.57414965986395, 1.5936684847047664], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 12, 0.0326530612244898, 0.0014228124258951862], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 843400, 36750, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19692, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Operation timed out", 13441, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 2626, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 914, "500/Internal Server Error", 65], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request PUT character/4", 168680, 5784, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3460, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Operation timed out", 1545, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 510, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 200, "500/Internal Server Error", 65], "isController": false}, {"data": ["HTTP Request Get characters", 168680, 9162, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Operation timed out", 4202, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4180, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 577, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 201, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 2], "isController": false}, {"data": ["HTTP Request GET character/1", 168680, 8353, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4036, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Operation timed out", 3588, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 533, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 191, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 5], "isController": false}, {"data": ["HTTP Request DELETE character/4", 168680, 5778, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4211, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Operation timed out", 995, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 424, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 148, "", ""], "isController": false}, {"data": ["HTTP Request POST character", 168680, 7673, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3805, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Operation timed out", 3111, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 582, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 174, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
