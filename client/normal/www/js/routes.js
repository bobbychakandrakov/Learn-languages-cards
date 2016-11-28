angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('tabsController.words', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/words.html',
        controller: 'wordsCtrl'
      }
    }
  })

  .state('tabsController.themes', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/themes.html',
        controller: 'themesCtrl'
      }
    }
  })

  .state('tabsController.theme', {
    url: '/theme/:id',
    views: {
      'tab2': {
        templateUrl: 'templates/theme.html',
        controller: 'themeCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract: true
  })

  $urlRouterProvider.otherwise('/page1/page2')



});
