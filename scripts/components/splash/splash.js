define([
    'ko',
    'utils/animationStep',
    'utils/animationTrigger'
], function(ko, animationStep, animationTrigger){
    ko.bindingHandlers.animationStep = animationStep;
    ko.bindingHandlers.animationTrigger = animationTrigger;

    return function (){
        var self = this;

        counter4 = logCounter("initializing of splash component", counter4);

        self.greeting = [{
            action: 'add',
            class: 'active'
        }];
        self.body = ko.computed(() => vm.body());
        self.stripes = [{
            action: 'remove',
            class: 'closed'
        }];
        self.content = [{
            action: 'remove',
            class: 'invisible'
        }];
        self.animations = {
            steps: [self.greeting, self.body(), self.stripes, self.content],
            onClick: () => { vm.loadComponent('navi'); },
            eachStep: (index) => { self.animationPhase(index + 1) },
            complete: () => { 
                self.animationComplete(true);
                vm.currentRoute('/home');
                self.dispose();
            }
        };

        self.pageEl = ko.observableArray([{
            action: 'add',
            class: 'article'
        }]);

        self.animationPhase = ko.observable(0);
        self.animationComplete = ko.observable(false);

        self.splash = ko.computed(function(){
            return self.animationPhase() < 2;
        }); 
        self.loadHome = ko.computed(function(){
            return self.animationPhase() >= 1;
        });

        self.dispose = function(){
            self.splash.dispose();
            self.loadHome.dispose();
        }
    };
});