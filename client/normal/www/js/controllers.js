angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, WordsFactory) {

    $scope.$on("$ionicView.enter", function(event, data) {
      WordsFactory.getWords().then(function(words) {
        $scope.words = words;
      }, function(err) {
        console.log(err);
      });
    });
    $scope.searchWord = searchWord;
    $scope.search = {
      word: ''
    };

    function searchWord() {
      if ($scope.search.word !== '') {
        var out = [];
        for (var i = 0; i < words.length; i++) {
          if (words[i].en.toLowerCase() == $scope.search.word.toLowerCase()) {
            out.push(words[i]);
          }
        }
        $scope.words = out;
      } else {
        $scope.words = words;
      }
    }
  }
])

.controller('themesCtrl', ['$scope', '$stateParams', 'ThemeFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory) {
    $scope.themes = ThemeFactory.getThemes();

  }
])

.controller('themeCtrl', ['$scope', '$stateParams', 'ThemeFactory', function($scope, $stateParams, ThemeFactory) {
  $scope.title = $stateParams.name;
  $scope.words = ThemeFactory.getThemeWords($stateParams.name);
}])
