define([
    'ko',
    'utils/transitionStep',
    'utils/transitions'
], function(ko, transitionStep, transitions){
    ko.bindingHandlers.transitionStep = transitionStep;

    return function (){
        var self = this;

        self.splash = ko.observable(true);
        self.home = ko.observable(false);
        
        self.greeting = [{
            when: {state: self.splash, is: false},
            action: 'add',
            class: 'active'
        }];
        self.body = ko.computed(() => vm.body());
        self.stripes = [{
            action: 'remove',
            class: 'closed'
        }];
        self.content = [{
            when: {state: self.home, is: true},
            action: 'remove',
            class: 'invisible'
        }];
        self.transitions = {
            steps: [self.greeting, self.body(), self.stripes, self.content],
            eachStep: (index) => { self.animationPhase(index + 1) }
        };
        transitions(self.transitions);

        self.loadNavi = function(){
            if (!vm.registry().includes('navi')) vm.loadComponent('navi');
            self.splash(!self.splash());
        };

        ko.when(() => self.home(), function(){
            vm.currentRoute('/home');
            self.dispose();
        });

        self.pageEl = ko.observableArray([{
            action: 'add',
            class: 'article'
        }]);

        self.animationPhase = ko.observable(1);

        self.showSplash = ko.computed(function(){
            return self.animationPhase() <= 2;
        });
        self.loadHome = ko.computed(function(){
            return self.animationPhase() > 1;
        });

        vm.currentRoute.subscribe(newValue => {
            if (newValue === '/home') {
                self.home(true);
            }
        });

        self.dispose = function(){
            self.showSplash.dispose();
            self.loadHome.dispose();
        }
    };
});