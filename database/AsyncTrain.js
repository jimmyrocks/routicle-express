exports.AsyncTrain = function() {
    var dataTrain = {
        requests: 0,
        completed: 0,
        state: 0 //0 = new, 1 = running, 2 = complete
    };

    var states = ["new", "running", "complete"];

    var requests = [];

    var checkComplete = function(finalCallback) {
        if (dataTrain.completed === dataTrain.requests) {
            dataTrain.state++;
            finalCallback(requests);
        };
    };


    var run = function(finalCallback) {
        if (dataTrain.state === 0) {
            dataTrain.state++;
            if (requests.length > 0) {
                for (var requestIndex = 0; requestIndex < requests.length; requestIndex++) {
                    var request = requests[requestIndex];

                    var trainCallback = function(response) {
                        dataTrain.completed++;
                        request.response = response;
                        if (request.callback) {
                            request.callback(response)
                        };
                        checkComplete(finalCallback);
                    };

                    request.baseObject[request.asyncFunction](trainCallback);
                }
            } else {
                checkComplete(finalCallback);
            }
        } else {
            throw ("The train is " + states[dataTrain.state] + " and cannot be run.");
        }
    };

    var add = function(baseObject, asyncFunction, callback) {
        if (dataTrain.state === 0) {
            requests.push({"baseObject": baseObject, "asyncFunction": asyncFunction, "callback": callback});
            dataTrain.requests++;
        } else {
            throw ("The train is " + states[dataTrain.state] + " and can not have data added");
        }
    };

    return {
        "add": add,
        "run": run,
        "state": states[dataTrain.state]
    };
};


