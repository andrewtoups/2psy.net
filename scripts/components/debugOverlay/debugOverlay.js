define(['ko'], function(ko){
    return function(){
        let self = this;
        
        self.vms = ko.pureComputed(function(){
            return vm.registry();
        });
        self.viewModel = ko.observable(vm[self.vms()[0]]);
        vm.currentComponent.subscribe(newValue => {
            self.viewModel(newValue);
        });
        self.vmObj = ko.computed(() => self.viewModel() === "vm" ? vm : vm[self.viewModel()]);
        self.data = ko.computed( () => {
            if (typeof self.vmObj() === 'object') {
                return Object.keys(self.vmObj()).map((k) => {
                    return {
                        obs: k,
                        val: self.vmObj()[k]
                    };
                });
            } else {
                return [];
            }
        });
        self.tables = [{
            type: 'Observables',
            filter: v => ko.isObservable(v.val),
            tables: [{
                type: "Value",
                filter: v => typeof v.val() !== 'boolean' && typeof v.val() !== 'object' && typeof v.val() !== 'function' && typeof v.val() !== 'array'
            }, {
                type: 'State',
                filter: v => typeof v.val() === 'boolean'
            }, {
                type: 'List',
                filter: v => typeof v.val() === 'array'
            }, {
                type: 'Method',
                filter: v => typeof v.val() === 'function'
            }]
        }, {
            type: 'StaticData',
            filter: v => !ko.isObservable(v.val),
            tables: [{
                type: 'Variable',
                filter: v => typeof v.val !== 'array' && typeof v.val !== 'object' && typeof v.val !== 'function'
            }, {
                type: 'Array',
                filter: v => typeof v.val === 'array'
            }, {
                type: 'Object',
                filter: v => typeof v.val === 'object'
            }]
        }];
        self.tables.forEach(table => {
            var type = table.type;
            self[type] = ko.computed(() => self.data().filter(o => table.filter(o)));
            table.tables.forEach(child => {
                self[child.type] = ko.computed(() => self[type]() ? self[type]().filter(o => child.filter(o)) : null);
            });
        })
        // self.observables = ko.computed(() => self.data().filter(o => ko.isObservable(o.val)));
        // self.staticData = ko.computed(() => self.data().filter(o => !ko.isObservable(o.val)));

        // self.states = ko.computed( () => self.observables().filter(o => typeof o.val() === 'boolean' ));
        // self.lists = ko.computed(() => self.observables().filter(o => typeof o.val() === 'array'));
        
    };
});