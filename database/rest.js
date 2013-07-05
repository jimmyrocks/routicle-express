var dataTrain = require("./AsyncTrain");
exports.addService = function(app, table, mode) {
    // create a more usable CRUD matrix
    var crudMatrix = {};
    for (var value in table.crud) {
        if (value) {
            crudMatrix[value.toLowerCase()] = true;
        };
    }

    // return the data in a useful format
    var formatData = function(documents, res, req) {
        // Deal with any params after a question mark
        var queryParamsRaw = req._parsedUrl.query ? req._parsedUrl.query.split("&") : [];
        var queryParams = {};
        for (var paramIndex in queryParamsRaw) {
            var param = queryParamsRaw[paramIndex].split("=");
            if (param.length === 2) {
                queryParams[param[0].toLowerCase()] = param[1];
            }
        }

        if (req.params && req.params.format === "json" || req.params.format === "jsonp") {
            /*res.send(documents.map(function(data) {
                return data;
            }));*/
            var toJsonp = function(json) {
                if (queryParams.callback) {
                    return queryParams.callback + "(" + json + ");";
                } else {
                    return json;
                }
            };

            var indent = null;
            if (queryParams.pretty) {
                indent = 4;
            }
            res.writeHead(200, {'Content-Type' : 'application/json' });
            res.write(toJsonp(JSON.stringify(documents.map(function(output) {
                return output;
            }), null , indent)));
            res.end();
        } else {
            // Return as HTML
            documents.map(function(data) {
                res.render('index', { "title": table.model.modelName, "data": data });
            });
        }
    };

    // List All
    app.get('/' + table.model.modelName + '.:format', function(req, res) {
        table.model.find(function (err, documents) {
            formatData(documents, res, req);
        });
    });

    // Create
    app.post('/' + table.model.modelName + '.:format?', function(req, res) {
        var document = new table.model(req.body);
        console.log("req.body", document);
        console.log("doc", document);
        document.save(function() {
            res.send(document.__doc);
        });
    });

    var crudFields = function(thisMatrix) {
        // Create a function for the query
        var queryFunction = function(field) {
            var returnValue = {};
            var query = {};
            query[thisMatrix.operator] = [field];
            returnValue[thisMatrix.dbField] = query;
            console.log(returnValue);
            return returnValue;
        };

        // Read
        if (crudMatrix["r"]) {
            console.log(table.model.modelName, thisMatrix.externalName);
            app.get('/'+table.model.modelName+'/'+thisMatrix.externalName+'/:field.:format?', function(req, res) {
                table.model.find(queryFunction(req.params.field), function (err, documents) {
                    formatData(documents, res, req);
                });
            });
        }

        if (crudMatrix["u"]) {
            // Update
            app.put('/'+table.model.modelName+'/'+thisMatrix.externalFieldName+'/:field.:format?', function(req, res) {
            });
        }

        if (crudMatrix["d"]) {
            // Delete
            app.del('/'+table.model.modelName+'/'+thisMatrix.externalFieldName+'/:field.:format?', function(req, res) {
            });
        }
    };

    // Create the CRUD fields
    var fieldMatrix = table.queryFields;
    for (var fieldIndex in fieldMatrix) {
        crudFields(fieldMatrix[fieldIndex]);
    }

    //////////////////////////////////////////////////////////////////////
    // Clear All (only for test mode!)
    if (mode && mode === "test") {
        app.get('/' + table.model.modelName + '_clear', function(req, res) {
            var saveTrain = dataTrain.AsyncTrain();
            table.model.find(function (err, documents) {
                var saveComplete =  function() {
                    table.model.find(function (err2, documents2) {
                        // Return ALL documents, for fun!
                        res.send(documents2.map(function(data) {
                            // A useful representation of the object
                            return data;
                        }));
                    });
                };
                for (var index in documents) {
                    var currentDocument = documents[index];
                    saveTrain.add(currentDocument, "remove");
                }
                saveTrain.run(saveComplete);
            });
        });
    }
    //////////////////////////////////////////////////////////////////////
};
