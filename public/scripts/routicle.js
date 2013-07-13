var crudMatrix = function() {

    // Useful JavaScript Functions
    var objectLoop = function(objects, callback) {
        for (var object in objects) {
            if (objects.hasOwnProperty(object)) {
                callback(object, objects[object]);
            }
        }
    };

    var htmlElement = function(type, content, attributes) {
        var newElement = document.createElement(type);
        objectLoop(attributes, function(attribute, value) {
            newElement.setAttribute(attribute, value);
        });

        if (content) {newElement.innerHTML = content;}

        return newElement;
    };

    // Render the data that comes back as an HTML table
    var renderTable = function(tableData) {
        var htmlTable = htmlElement("table");

        // Determine the headers
        var headers = [];
        tableData.map(function(result){
            objectLoop(result, function(field, value) {
                var added = false;
                headers.map(function(header) {
                    if (header === field){
                        added = true;
                    }
                });
                if (!added) {
                    headers.push(field);
                }

            });
        });

        // Draw the table
        // Headers
        var headerRow = htmlElement("tr");
        headers.sort().map(function(header){
            headerRow.appendChild(htmlElement("th", header));
        });
        var tableHead = htmlElement("thead");
        tableHead.appendChild(headerRow);
        // Data
        var tableBody = htmlElement("tbody");
        tableData.map(function(result) {
            var row = htmlElement("tr");
            headers.map(function(header) {
                row.appendChild(htmlElement("td", result[header]));
            });
            tableBody.appendChild(row);
        });

        htmlTable.appendChild(tableHead);
        htmlTable.appendChild(tableBody);

        return htmlTable;
    };

    return {
        renderTable: renderTable
    };
}();

