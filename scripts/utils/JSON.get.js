define([], function(){
    JSON.get = function(path, callback) {

        let req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open('GET', path, true);
        req.onreadystatechange = function() {
            if (req.readyState === 4 && req.status === 200) {
                try {
                    let data = JSON.parse(req.responseText);
                    if (typeof data === 'object') callback(data);
                } catch(err) {
                    console.log(`Error: ${err}`);
                }
            }
        }
        req.send(null);
    };
});