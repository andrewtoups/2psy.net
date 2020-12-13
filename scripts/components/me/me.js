define(['ko', 'utils/JSON.get'], function(ko){
    return function (){
        var self = this;
        
        self.contactLinks = ko.observableArray([]);
        JSON.get('data/contactLinks.json', function(data){
            if (Array.isArray(data)) self.contactLinks(data);
            else console.log("Error loading contact links.")
        });
    };
});