exports.addService = function(app, table, mode) {
    // create a more usable CRUD matrix
    var crudMatrix = {};
    for (var value in table.crud[mode].split('')) {
        var thisCrud = table.crud[mode].split('')[value];
        if (thisCrud) {
            crudMatrix[thisCrud.toLowerCase()] = true;
        };
    }

    // return the data in a useful format
    var formatData = function(documents, req, res) {
        // Deal with any params after a question mark
        var queryParamsRaw = req._parsedUrl.query ? req._parsedUrl.query.split("&") : [];
        var queryParams = {};
        for (var paramIndex in queryParamsRaw) {
            var param = queryParamsRaw[paramIndex].split(/=(.*)/, 2);
            if (param.length === 2) {
                queryParams[param[0].toLowerCase()] = param[1];
            }
        }

        // Deal with undefined documents
        documents = documents ? documents : [];

        if (req.params && req.params.format === "json" || req.params.format === "jsonp") {

            // Convert output to jsonp if required
            var toJsonp = function(json) {
                if (queryParams.callback) {
                    return queryParams.callback + "(" + json + ");";
                } else {
                    return json;
                }
            };

            // Pretty print output if required
            var indent = null;
            if (queryParams.pretty) {
                indent = 4;
            }

            // Write out the JSON to the user
            res.writeHead(200, {'Content-Type' : 'application/json' });
            res.write(toJsonp(JSON.stringify(documents.map(function(output) {
                return output;
            }), null , indent)));
            res.end();
        } else {
            // Return as HTML
            res.render('index', { "title": table.model.modelName, "data": documents });
        }
    };

    // List All
    if (crudMatrix["r"]) {
        app.get('/' + table.model.modelName + '.:format', function(req, res) {
            table.model.find(function (err, documents) {
                formatData(documents, req, res);
            });
        });
    }

    // Create
    if (crudMatrix["c"]) {
        app.post('/' + table.model.modelName + '.:format?', function(req, res) {
            var document = new table.model(req.body);
            document.save(function() {
                table.model.findById(document._id, function (err, documents) {
                    formatData([documents], req, res);
                });
            });
        });
    }

    var crudFields = function(thisMatrix) {
        // Create a function for the query
        var queryFunction = function(field) {
            var returnValue = {};
            var query = {};
            query[thisMatrix.operator] = [field];
            returnValue[thisMatrix.dbField] = query;
            return returnValue;
        };

        // Read Function
        var getCurrentData = function (req, res) {
            table.model.find(queryFunction(req.params.field), function (err, documents) {
                console.log("qq", documents);
                console.log("err", err);
                formatData(documents, req, res);
            });
        };

        // Read
         if (crudMatrix["r"]) {
            app.get('/'+table.model.modelName+'/'+thisMatrix.externalName+'/:field.:format?', getCurrentData);
        }

        // Update
        if (crudMatrix["u"]) {
            app.put('/'+table.model.modelName+'/'+thisMatrix.externalName+'/:field.:format?', function(req, res) {
                table.model.find(queryFunction(req.params.field), function (err, documents) {
                    if (documents && documents.length > 0) {
                        var callbackCount = 0;
                        for (var docIndex in documents) {
                            var doc = documents[docIndex];
                            for (var field in req.body) {
                                if (req.body[field]) {
                                    doc[field] = req.body[field];
                                    doc.save(function(err) {
                                        callbackCount++;
                                        if (callbackCount === documents.length) {
                                            getCurrentData(req, res);
                                        };
                                    });
                                };
                            }
                        }
                    } else {
                        formatData(documents, req, res);
                    }
                });
            });
        }

        // Delete
        if (crudMatrix["d"]) {
            app.del('/'+table.model.modelName+'/'+thisMatrix.externalName+'/:field.:format?', function(req, res) {
                table.model.find(queryFunction(req.params.field), function (err, documents) {
                    if(documents && documents.length) {
                        var callbackCount = 0;
                        for (var docIndex in documents) {
                            var doc = documents[docIndex];
                            doc.remove(function (err) {
                                doc.save(function (save_err) {
                                    callbackCount++;
                                    if (callbackCount === documents.length) {
                                        getCurrentData(req, res);
                                    }
                                });
                            });
                        }
                    } else {
                        format(documents, req, res);
                    }
                });
            });
        }
    };

    // Create the CRUD fields
    var fieldMatrix = table.queryFields;
    for (var fieldIndex in fieldMatrix) {
        crudFields(fieldMatrix[fieldIndex]);
    }
};
