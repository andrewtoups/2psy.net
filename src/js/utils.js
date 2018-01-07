var utils = {
  template: function(source, context){
    source = $(source).html();
    var template = Handlebars.compile(source);
    context = {} || context;
    var html = template(context);
    return html;
  },

  loader: {
    isLoading: false,
    show: function(){
      this.isLoading = true;
      // display loading icon
    },
    hide: function(){
      this.isLoading = false;
      // remove loading icon
    }
  },

  wait: function(callback, time, logTimer) {
    time = time || 1;
    logTimer = logTimer || false;
    if (logTimer) { console.log(time); }
    setTimeout(callback, time);
  },

  buildNav: function(navItems) {
    var navList = [];
    for (var i = 0; i < navItems.length; i++) {
      navList.push($(navItems[i]).attr('href'));
    }
    return navList;
  },

  transitionChain: function(parent, child, transitionProperty, callback, time) {
    time = time || 1000; //default to 1 second
    var transitionEventFired = false;
    $(parent).on('transitionend webkitTransitionEnd oTransitionEnd', child, function(event){
      if (event.originalEvent.propertyName === transitionProperty){
        callback();
        transitionEventFired = true;
      }
    })
    // wait a second, if transition hasn't fired, execute code: (IE Workaround)
    utils.wait(function(){
      if (!transitionEventFired) {
        callback();
        transitionEventFired = true;
      }
    }, time);
  }
};
