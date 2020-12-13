define(['ko', 'utils/JSON.get'], function(ko){
    return function (){
        var self = this;

        self.albums = ko.observableArray();
        JSON.get('data/music.json', function(data){
            if (Array.isArray(data) && data.length){
                self.albums(data);
                console.log(self.albums());
            } else {
                console.log("Error loading music data.");
            }
        });
    };
});