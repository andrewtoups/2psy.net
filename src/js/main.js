$(document).ready(function(){
  initPage();
});

function initPage(){
  var navs;
  var mainNavItems;
  var audios;

  $('.greeting').one('click', function() {
    
    $('header h1').find('.greeting').addClass('active');
    utils.transitionChain('.splash', '.greeting.active', 'opacity', function(){
      $('header').empty().addClass('virginia-stripes closed');
      launchMain();
    });

  });
}

function launchMain(){
  //create elements
  var aside = utils.template('#home-aside');
  var nav = utils.template('#home-nav');
  var contentArea = utils.template('#home-content-area');
  //change page class to home and add layout elements:
  $('body').removeClass('splash').addClass('home');
  aside = $(aside).insertAfter('header').addClass('closed');
  contentArea = $(contentArea).insertAfter('aside').addClass('invisible');
  $(nav).appendTo('.content-area');
  navs = $('nav a');
  mainNavItems = utils.buildNav(navs);
  //wait for next frame to trigger stripe animation:
  utils.wait(function(){
    aside.removeClass('closed');
    $('header').removeClass('closed');
  }, 20);
  utils.transitionChain('.home', 'virginia-stripes', 'box-shadow', function(){
    contentArea.removeClass('invisible');
    $('#page').addClass('live');
  });
}

function openContentArea(article){
  $('.content-area nav').addClass('active');
  utils.transitionChain('#page', 'nav.active', 'margin-top', function(){
      $('#page').addClass('article');
      $(article).appendTo('.content-area');
  });
}

$('#page').on('click', 'nav a', function(){
  var linkName = $(this).attr('href');
  // if href matches nav dictionary:
  if (mainNavItems.indexOf(linkName) > -1) {
    for (var i = 0; i < navs.length; i++) {
      $(navs[i]).removeClass('active');
    }
    $(this).addClass('active');
    var article = utils.template(linkName);
    //if there is already content on page:
    if ($('#page').hasClass('article')) {
      $('#page .scroll-mask').remove();
      $(article).appendTo('.content-area');
    }
    else
      { openContentArea(article); }
    // if (linkName === '#music') {
    //   $('#page').on('transitionend webkitTransitionEnd oTransitionEnd', 'nav.active', function(event){
    //     if (event.originalEvent.propertyName === 'margin-top') {
    //       console.log($('audio'));
    //       console.log($('audio:first'));
    //       $('audio:first')[0].play();
    //     }
    //   })
    // }
  }

});

function launchMusicPlayer(audioElement) {

}
