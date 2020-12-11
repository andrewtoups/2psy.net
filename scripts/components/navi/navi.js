define([
    'ko',
    'utils/transitionStep',
    'utils/transitions'
], function(ko, transitionStep, transitions){
    ko.bindingHandlers.transitionStep = transitionStep;

    return function (){
        var self = this;

        self.isActive = ko.observable(false);
        self.isActive.subscribe((newValue) => { vm.activeNav(newValue) });
        self.isAwake = ko.observable(false);

        self.nav = [{
            action: 'add',
            class: 'active'
        }];
        self.page = ko.computed(() => vm.splash.pageEl());
        self.animation = {
            if: function() { return !self.isAwake() },
            steps: [self.nav, self.page()],
            onClick: () => {
                self.isAwake(true);
            },
            complete: () => {
                self.isActive(true);
            }
        };
    };
});