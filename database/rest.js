var dataTrain = require("./AsyncTrain");
exports.addService = function(app, service, Model, fieldMatrix, mode) {

    // return the data in a useful format
    var formatData = function(documents, res, req) {
        // Deal with any params after a question mark
        var queryParamsRaw = req._parsedUrl.query ? req._parsedUrl.query.split("&") : [];
        var queryParams = {};
        for (var paramIndex=0; paramIndex < queryParamsRaw.length; paramIndex++) {
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
                res.render('index', { "title": service, "data": data });
            });
        }
    };

    // List All
    app.get('/' + service + '.:format', function(req, res) {
        Model.find(function (err, documents) {
            formatData(documents, res, req);
        });
    });

    // Create
    app.post('/' + service + '.:format?', function(req, res) {
        var document = new Model(req.body);
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
        if (thisMatrix.crud.toUpperCase().indexOf("C")>=0) {
            console.log(service, thisMatrix.externalName);
            app.get('/'+service+'/'+thisMatrix.externalName+'/:field.:format?', function(req, res) {
                Model.find(queryFunction(req.params.field), function (err, documents) {
                    formatData(documents, res, req);
                });
            });
        }

        if (thisMatrix.crud.toUpperCase().indexOf("U")>=0) {
            // Update
            app.put('/'+service+'/'+thisMatrix.externalFieldName+'/:field.:format?', function(req, res) {
            });
        }

        if (thisMatrix.crud.toUpperCase().indexOf("D")>=0) {
            // Delete
            app.del('/'+service+'/'+thisMatrix.externalFieldName+'/:field.:format?', function(req, res) {
            });
        }
    };


    for (var fieldIndex=0; fieldIndex<fieldMatrix.length; fieldIndex++) {
        crudFields(fieldMatrix[fieldIndex]);
    }

    //////////////////////////////////////////////////////////////////////
    // Clear All (only for test mode!)
    if (mode && mode === "test") {
        app.get('/' + service + '_clear', function(req, res) {
            var saveTrain = dataTrain.AsyncTrain();
            Model.find(function (err, documents) {
                var saveComplete =  function() {
                    Model.find(function (err2, documents2) {
                        // Return ALL documents, for fun!
                        res.send(documents2.map(function(data) {
                            // A useful representation of the object
                            return data;
                        }));
                    });
                };
                for (var index=0; index < documents.length; index++) {
                    var currentDocument = documents[index];
                    saveTrain.add(currentDocument, "remove");
                }
                saveTrain.run(saveComplete);
            });
        });
    }
    //////////////////////////////////////////////////////////////////////
};
