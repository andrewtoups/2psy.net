define([
    'ko',
    'utils/transitionStep',
    'utils/transitions'
], function(ko, transitionStep, transitions){
    ko.bindingHandlers.transitionStep = transitionStep;

    return function (){
        var self = this;

        self.isActive = ko.observable(false);
        self.isAwake = ko.observable(false);
        vm.currentRoute.subscribe(newValue => {
            if (vm.contentPages.some(page => newValue === page.url)) {
                if (!self.isAwake()) self.isAwake(true);
                else self.isActive(true);
            } else {
                if (self.isActive(false));
            }
        });
        self.isAwake.subscribe((newValue) => { vm.awakeNav(newValue) });
        self.isActive.subscribe((newValue) => { vm.activeNav(newValue) });

        self.nav = [{
            when: {state: self.isAwake, is: true},
            action: 'add',
            class: 'active'
        }];
        self.page = ko.computed(() => {
            let page = vm.splash.pageEl();
            page[0].when = {state: self.isActive, is: true};
            return page;
        });
        self.transitions = {
            if: function() { return !self.isAwake() },
            steps: [self.nav, self.page()]
        };
        transitions(self.transitions);
    };
});