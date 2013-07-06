exports.addService = function(app, table, mode) {
    // return the data in a useful format
    var formatData = function(documents, req, res) {
        // Deal with any params after a question mark
        var queryParamsRaw = req._parsedUrl.query ? req._parsedUrl.query.split("&") : [];
        var queryParams = {};
        queryParamsRaw.map(function(params) {
            var param = params.split(/=(.*)/, 2);
            if (param.length === 2) {
                queryParams[param[0].toLowerCase()] = param[1];
            }
        });

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

            // Filter the output based on user settings
            var filter = null;
            if (table.displayFields && table.displayFields[mode]) {
                filter = [];
                table.displayFields[mode].map(function(displayField) {
                    filter.push(displayField);
                });
            }

            // Pretty print output if required
            var indent = null;
            if (queryParams.pretty) {
                indent = 4;
            }

            // Write out the JSON to the user
            res.writeHead(200, {'Content-Type' : 'application/json' });
            res.write(toJsonp(JSON.stringify(documents.map(function(output) {
                return output;
            }), filter , indent)));
            res.end();
        } else {
            // Return as HTML
            res.render('index', { "title": table.model.modelName, "data": documents });
        }
    };

    // List All
    if (table.crud[mode]["r"]) {
        app.get('/' + table.model.modelName + '.:format', function(req, res) {
            table.model.find(function (err, documents) {
                formatData(documents, req, res);
            });
        });
    }

    // Create
    if (table.crud[mode]["c"]) {
        app.post('/' + table.model.modelName + '.:format?', function(req, res) {
            var document = new table.model(req.body);
            document.save(function() {
                table.model.findById(document._id, function (err, documents) {
                    formatData([documents], req, res);
                });
            });
        });
    }

    var crudFields = function(thisField) {
        // Create a function for the query
        var queryFunction = function(field) {
            var returnValue = {};
            var query = {};
            query[thisField.operator] = [field];
            returnValue[thisField.dbField] = query;
            return returnValue;
        };

        // Read Function
        var getCurrentData = function (req, res) {
            table.model.find(queryFunction(req.params.field), function (err, documents) {
                formatData(documents, req, res);
            });
        };

        // Read
         if (table.crud[mode]["r"] && thisField.crud["r"]) {
            app.get('/'+table.model.modelName+'/'+thisField.externalName+'/:field.:format?', getCurrentData);
        }

        // Update
        // TODO: Add the ability to move the original entry to a logging table
        if (table.crud[mode]["u"] && thisField.crud["u"]) {
            app.put('/'+table.model.modelName+'/'+thisField.externalName+'/:field.:format?', function(req, res) {
                table.model.find(queryFunction(req.params.field), function (err, documents) {
                    if (documents && documents.length > 0) {
                        var callbackCount = 0;
                        documents.map(function(doc) {
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
                        });
                    } else {
                        formatData(documents, req, res);
                    }
                });
            });
        }

        // Delete
        // TODO: Should this return the data that was deleted? or return an
        // empty array?
        // TODO: Add the ability to move the original entry to a logging table
        if (table.crud[mode]["d"] && thisField.crud["d"]) {
            app.del('/'+table.model.modelName+'/'+thisField.externalName+'/:field.:format?', function(req, res) {
                table.model.find(queryFunction(req.params.field), function (err, documents) {
                    if(documents && documents.length) {
                        var callbackCount = 0;
                        documents.map(function(doc) {
                            doc.remove(function (err) {
                                doc.save(function (save_err) {
                                    callbackCount++;
                                    if (callbackCount === documents.length) {
                                        getCurrentData(req, res);
                                    }
                                });
                            });
                        });
                    } else {
                        format(documents, req, res);
                    }
                });
            });
        }
    };

    // Create the REST/CRUD fields
    var fieldMatrix = table.queryFields;
    table.queryFields.map(function(queryField) {
        crudFields(queryField);
    });
};
