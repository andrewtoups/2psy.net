var vm;
var counter1 = 0;
var counter2 = 0;
var counter3 = 0;
var counter4 = 0;
var logCounter = function(label, counter){
    counter++;
    let s = counter === 1 ? '' : 's';
    console.log(`${label} has been run ${counter} time${s}.`);
    return counter;
};

DomReady.ready(function(){
    define(['ko', 'components/pager/pager', 'utils/animationStep'], function(ko, Pager){
        vm = new Pager();
        // ko.options.useOnlyNativeEvents = true;
        ko.applyBindings(vm, document.querySelector('html'));
    });
});