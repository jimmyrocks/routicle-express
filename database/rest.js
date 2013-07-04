exports.addService = function(app, service, Model) {

    app.get('/_' + service + '.:format?', function(req, res) {
        res.send("You selected tuna!!");
    });
    // List All
    app.get('/' + service + '.:format', function(req, res) {
        Model.find(function (err, documents) {
            // Return ALL documents, for fun!
            res.send(documents.map(function(data) {
                // A useful representation of the object
                return data;
            }));
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

    // Read
    app.get('/documents/:id.:format?', function(req, res) {
    });

    // Update
    app.put('/documents/:id.:format?', function(req, res) {
    });

    // Delete
    app.del('/documents/:id.:format?', function(req, res) {
    });

    // Clear All (only for test mode!)
    app.get('/' + service + '_clear', function(req, res) {
        Model.find(function (err, documents) {
            for (var index; index < documents.length; index++) {
                list[index].remove();
                show.save(); // This is a use for my queue tool!
            }
            // Return ALL documents, for fun!
            res.send(documents.map(function(data) {
                // A useful representation of the object
                return data;
            }));
        });
    });
};
