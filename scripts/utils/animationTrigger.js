define(['ko'], function(ko){
    return {
        init: function(element, valueAccessor, allBindings, data, context){
            let thisValueAccessor = function(){
                return function(){
                    let options = ko.unwrap(valueAccessor());
                    let cond = options.hasOwnProperty('if') ? options.if() : true;
                    if (cond) {
                        let steps = options.steps.flat();
                        let complete = options.hasOwnProperty('complete') ? options.complete : false;
                        let eachStep = options.hasOwnProperty('eachStep') ? options.eachStep : false;
                        let onClick = options.hasOwnProperty('onClick') ? options.onClick : false;
                        
                        onClick && onClick(allBindings());
                        counter3 = logCounter('animationTrigger onClick', counter3);
                        
                        let nextTimeout = 0;
                        steps.forEach((step, index, array) => {
                            let cList = Array.from(step.element.classList);
                            if ((!cList.includes(step.class) && step.action === 'add') ||
                            (cList.includes(step.class) && step.action === 'remove')) {
                                nextTimeout += index === 0 ? 0 : array[index-1].timeout;
                                setTimeout(function() {
                                    counter2 = logCounter('animationTrigger timeout', counter2);
                                    step.element.classList[step.action](step.class);
                                    eachStep && eachStep(index, allBindings());
                                    if (index + 1 === steps.length){
                                        setTimeout(function(){
                                            complete && complete(index, allBindings());
                                        }, step.timeout); 
                                    }
                                }, nextTimeout);
                            }
                        });
                    }
                };
            }
            ko.bindingHandlers.click.init(element, thisValueAccessor, allBindings, data, context);  
        }
    };
});