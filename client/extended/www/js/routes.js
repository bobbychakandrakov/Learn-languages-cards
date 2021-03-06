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

  .state('tabsController.packages', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/packages.html',
        controller: 'packagesCtrl'
      }
    }
  })

  .state('tabsController.addPackages', {
    url: '/add/package',
    views: {
      'tab3': {
        templateUrl: 'templates/add-package.html',
        controller: 'addPackageCtrl'
      }
    }
  })

  .state('tabsController.theme', {
    url: '/theme/:name/:id',
    views: {
      'tab2': {
        templateUrl: 'templates/theme.html',
        controller: 'themeCtrl'
      }
    }
  })

  .state('tabsController.addTheme', {
    url: '/add/theme',
    views: {
      'tab2': {
        templateUrl: 'templates/add-theme.html',
        controller: 'addThemeCtrl'
      }
    }
  })

  .state('tabsController.editTheme', {
    url: '/edit/theme/:id',
    views: {
      'tab2': {
        templateUrl: 'templates/edit-theme.html',
        controller: 'editThemeCtrl'
      }
    }
  })

  .state('tabsController.addWord', {
    url: '/add/word',
    views: {
      'tab1': {
        templateUrl: 'templates/add-word.html',
        controller: 'addWordCtrl'
      }
    }
  })

  .state('tabsController.editWord', {
    url: '/edit/word/:id',
    views: {
      'tab1': {
        templateUrl: 'templates/edit-word.html',
        controller: 'editWordCtrl'
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
