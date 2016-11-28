angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', 'BACKEND_API', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, WordsFactory, BACKEND_API) {
    var limit = 10;

    $scope.IMG = BACKEND_API.IMG;

    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();
    });

    $scope.searchWord = searchWord;
    $scope.loadMore = loadMore;
    $scope.search = {
      word: ''
    };

    function searchWord() {
      if ($scope.search.word != '') {
        WordsFactory.searchWord($scope.search.word).then(function(words) {
          $scope.words = words;
        }, function(err) {
          console.log(err);
        });
      } else {
        loadData();
      }
    }

    function loadData() {
      WordsFactory.getWords().then(function(words) {
        $scope.words = words;
      }, function(err) {
        console.log(err);
      });
    }

    function loadMore() {
      limit += 10;
      WordsFactory.getWords(limit).then(function(words) {
        $scope.words = words;
      }, function(err) {
        console.log(err);
      });
    }
  }
])

.controller('themesCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory, BACKEND_API) {

    $scope.IMG = BACKEND_API.IMG;

    ThemeFactory.getThemes().then(function(themes) {
      $scope.themes = themes;
    }, function(err) {
      console.log(err);
    });

  }
])

.controller('themeCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API',
  function($scope, $stateParams, ThemeFactory, BACKEND_API) {

    var id = $stateParams.id;
    var myAudio;

    $scope.playMaleVoice = playMaleVoice;
    $scope.playFemaleVoice = playFemaleVoice;

    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();
    });

    $scope.IMG = BACKEND_API.IMG;

    function loadData() {
      ThemeFactory.getTheme(id).then(function(theme) {
        $scope.theme = theme;
        console.log(theme);
      }, function(err) {
        console.log(err);
      });
    }

    function playMaleVoice(id) {
      if (myAudio) {
        myAudio.pause();
      }
      myAudio = document.getElementById('male' + id);
      if (myAudio.paused) {
        myAudio.play();
      } else {
        myAudio.pause();
      }
    }

    function playFemaleVoice(id) {
      if (myAudio) {
        myAudio.pause();
      }
      myAudio = document.getElementById('female' + id);
      if (myAudio.paused) {
        myAudio.play();
      } else {
        myAudio.pause();
      }
    }

  }
])
