define([
    'ko',
    'utils/animationStep',
    'utils/animationTrigger'
], function(ko, animationStep, animationTrigger){
    ko.bindingHandlers.animationStep = animationStep;
    ko.bindingHandlers.animationTrigger = animationTrigger;

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