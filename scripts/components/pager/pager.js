define(['ko', 'utils/transitionStep'], function(ko, transitionStep){
    return function(){
        var self = this;
        ko.bindingHandlers.transitionStep = transitionStep;

        self.body = ko.observableArray([{
            action: 'add',
            class: 'home',
            timeout: 0
        }, {
            action: 'remove',
            class: 'splash',
            timeout: 0
        }]);
        self.admin = ko.observable(true);
        self.debug = ko.observable(false);
        self.debug.subscribe(newValue => {
            if (newValue) self.loadComponent('debugOverlay');
            else self.unregister('debugOverlay');
        });

        self.cPath = "components";
        self.loadComponent = function(name){
            var jsPath = `${self.cPath}/${name}/${name}`;
            var htmlPath = `text!${self.cPath}/${name}/${name}.html`;
            require([jsPath, htmlPath], function(viewModel, template){
                var vm = {
                    viewModel: function() {
                        self[name] = new viewModel;
                        return self[name];
                    },
                    template: template
                };
                ko.components.register(name, vm);
                self.currentComponent(name);
                self.registry.push(name);
            });
        };
        self.unregister = function(name){
            self.registry.remove(name);
            ko.components.unregister(name);
        };
        
        self.pages = [
            {
                title: "Welcome",
                component: "splash",
                url: "/",
                inNav: false
            }, {
                title: "Home",
                component: false,
                url: "/home",
                inNav: false
            }, {
                title: "Me",
                component: "me",
                url: "/me",
                inNav: true
            }, {
                title: "Music",
                component: "music",
                url: "/music",
                inNav: true
            }, {
                title: "Work",
                component: "work",
                url: "/work",
                inNav: true
            }
        ];
        self.contentPages = self.pages.filter(page => page.inNav);

        self.registry = ko.observableArray(['vm']);
        self.currentRoute = ko.observable(window.location.pathname);
        self.currentRoute.subscribe(function(newValue){
            var p = self.pages.find(page => page.url.includes(newValue));
            window.history.pushState({'index': self.pages.indexOf(p)}, p.title, p.url );
        });

        self.currentPage = ko.computed(function(){
            var currentPage = self.pages.find(page => self.currentRoute() === page.url) ? self.pages.find(page => self.currentRoute() === page.url) : self.pages.find(page => '/' === page.url)
            var name = currentPage.component;
            if (name) {
                if (!self.registry().includes(name)){
                    self.loadComponent(name);
                } else {
                    self.currentComponent(name);
                }
            }
            return currentPage;
        });

        self.currentComponent = ko.observable();

        self.contentReady = ko.computed(function(){
            return self.contentPages.includes(self.currentPage()) &&
                   self.registry().includes(self.currentPage().component) &&
                   self.awakeNav();
        });
        self.awakeNav = ko.observable(false);
        self.activeNav = ko.observable(false);

        self.ready = ko.computed(function(){
            return self.registry().includes('splash'); 
        });

        self.checkRegistry = function(name){
            console.log(ko.components.isRegistered(name));
        };
        self.checkContext = function(context){
            console.log(ko.dataFor(context));
        };
    }
});