define(['ko', 'utils/JSON.get'], function(ko){
    return function (){
        var self = this;

        self.works = ko.observableArray([]);
        JSON.get("data/works.json", function(data){
            if (Array.isArray(data)) self.works(data);
            else console.log("Error loading works.");
        });
    };
});