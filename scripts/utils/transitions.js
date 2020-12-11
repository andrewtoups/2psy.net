define(['ko'], function(ko){
    let transitions = function(options){
        this.chainTransitions = () => {
            let indexArr = [];
            let timeoutArr = [];
            
            let chain = function(step, index, array){
                if (options.rev) console.log(`${step.action} ${step.class} ${step.action === "add" ? "to" : "from"}: `, step.element, ` and wait for ${timeoutArr[index]}`);
                if (indexArr.length < array.length) indexArr[index] = index;
                let cList = Array.from(step.element.classList);
                
                if ((!cList.includes(step.class) && step.action === 'add') ||
                (cList.includes(step.class) && step.action === 'remove')) {
                    if (index === 0) {
                        step.element.classList[step.action](step.class);
                        options.eachStep && options.eachStep(indexArr[index]);
                    } else {
    
                        setTimeout(function() {
                            step.element.classList[step.action](step.class);
                            options.eachStep && options.eachStep(indexArr[index]);
                            
                            if (index + 1 === indexArr.length){
                                setTimeout(function(){
                                    if (!options.rev && options.lastStep.when.state() !== options.lastStep.when.is) {
                                        options.lastStep.when.state(options.lastStep.when.is);
                                    } else if (options.rev && options.firstStep.when.state() === options.firstStep.when.is) {
                                        options.firstStep.when.state(!options.firstStep.when.is);
                                    }
                                }, timeoutArr[index]);
                            }
                        }, timeoutArr[index - 1]);
                    }
                    
                }
            };
            
            if (!options.rev) {
                options.steps.forEach((step, index) => {
                    indexArr[index] = index;
                    timeoutArr[index] = index < 1 ? step.timeout :
                                        index + 1 < options.steps.length ? step.timeout + timeoutArr[index - 1] :
                                        step.timeout;
                });

                options.steps.forEach(chain);
            } else {
                options.revSteps.forEach((step, index) => {
                    indexArr[index] = index;
                    timeoutArr[index] = index < 1 ? step.timeout :
                                        index + 1 < options.steps.length ? step.timeout + timeoutArr[index - 1] :
                                        step.timeout;
                });

                indexArr.reverse();
                options.revSteps.forEach(chain);
            }
        };

        this.stateWrapper = (whenObj) => {
            return (newState) => {
                if (typeof newState === 'undefined') {
                    return whenObj.state() === whenObj.is;
                } else if (typeof newState === 'boolean') {
                    whenObj.state(whenObj.is);
                }
            }
        };

        options.rev = false;

        options.steps = options.steps.flat();
        options.readySteps = ko.observableArray([]);
        options.ready = ko.computed(() => options.readySteps().length === options.steps.length);

        options.steps.forEach(step => {
            if (!step.hasOwnProperty('ready')) step.ready = ko.observable(false);
            else if (step.ready()) options.readySteps.push(step.ready());
        });
        if (!options.hasOwnProperty('if')) options.if = () => true;

        options.steps.forEach(step => {
            step.ready.subscribe(newValue => {
               if (newValue) options.readySteps.push(newValue);
            });
        });
        
        options.ready.subscribe(newValue => {
            if (newValue && options.if()) {
                options.firstStep = options.steps[0];
                options.lastStep = options.steps[options.steps.length - 1];
                
                if (options.firstStep.hasOwnProperty('when')) {
                    options.firstStep.state = this.stateWrapper(options.firstStep.when); 
                }
                
                if (options.lastStep.hasOwnProperty('when')) {
                    options.lastStep.state = this.stateWrapper(options.lastStep.when);
                }
        
                options.revSteps = [];
                options.steps.forEach((step, index) => {
                    options.revSteps[index] = {
                        class: step.class,
                        action: step.action === 'add' ? 'remove' : 'add',
                        timeout: step.timeout,
                        element: step.element
                    };
                    if (step.hasOwnProperty('when')) {
                        options.revSteps[index].when = {
                            state: step.when.state,
                            is: step.when.is
                        }
                    }
                });
                options.revSteps.reverse();
        
                options.firstStep.when.state.subscribe(newValue => {
                    if ((newValue === options.firstStep.when.is) &&
                    (options.lastStep.when.state() !== options.lastStep.when.is)) {
                        if (options.rev) options.rev = false;
                        this.chainTransitions(options);
                    }
                });
        
                options.lastStep.when.state.subscribe(newValue => {
                    if ((newValue !== options.lastStep.when.is) &&
                    (options.firstStep.when.state() === options.firstStep.when.is)) {
                        if (!options.rev) options.rev = true;
                        this.chainTransitions(options);
                    }
                });
            }
        });
    }
    return transitions;
});