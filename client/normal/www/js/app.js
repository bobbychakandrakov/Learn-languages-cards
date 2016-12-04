// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.directives', 'app.services', ])

.config(function($ionicConfigProvider) {

})

//Development
// .constant('BACKEND_API', {
//   THEMES: 'http://localhost:3333/api/theme',
//   PACKAGE: 'http://localhost:3333/api/package',
//   WORDS: 'http://localhost:3333/api/word',
//   IMG: 'http://localhost:3333/',
//   PACKAGE: 'http://localhost:3333/api/package/'
// })

//Test Cloud
.constant('BACKEND_API', {
  THEMES: 'https://demo-project-bobbychakandrakov.c9users.io/api/theme',
  PACKAGE: 'https://demo-project-bobbychakandrakov.c9users.io/api/package',
  WORDS: 'https://demo-project-bobbychakandrakov.c9users.io/api/word',
  IMG: 'https://demo-project-bobbychakandrakov.c9users.io/',
  PACKAGE: 'https://demo-project-bobbychakandrakov.c9users.io/api/package/'
})

.run(function($ionicPlatform, settingsFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    // Reading the codes.txt and themes.txt files from application folder

    settingsFactory.readSettings()
      .then(function(result) {

      }, function(err) {

      });
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
