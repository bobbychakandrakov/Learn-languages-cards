angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', '$ionicPopup', '$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, WordsFactory, $ionicPopup, $location) {
    // Setting limit to 10 as default
    var limit = 10;
    // Ionic on page enter event listener
    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();
    });

    $scope.loadMore = loadMore;
    $scope.deleteWord = deleteWord;
    $scope.searchWord = searchWord;
    $scope.editWord = editWord;
    $scope.search = {
      word: ''
    };

    function editWord(id) {
      $location.path('/page1/edit/word/' + id);
    }

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

    function deleteWord(id, word) {
      var confirmPopup = $ionicPopup.confirm({
        template: 'Are you sure you want to delete \'' + word.eName + '\' ?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          WordsFactory.deleteWord(id).then(function(res) {
            var index = $scope.words.indexOf(word);
            $scope.words.splice(index, 1);
          }, function(err) {
            console.log(err);
          });
        }
      });
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

.controller('themesCtrl', ['$scope', '$stateParams', 'ThemeFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory) {
    $scope.themes = ThemeFactory.getThemes();

  }
])

.controller('addThemeCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'WordsFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory, WordsFactory) {

    $scope.wordsToAdd = [];
    $scope.addTheme = addTheme;
    $scope.searchWord = searchWord;
    $scope.addWord = addWord;
    $scope.removeWord = removeWord;
    $scope.search = {
      word: ''
    };
    $scope.theme = {
      title: ''
    };

    function searchWord() {
      if ($scope.search.word != '') {
        WordsFactory.searchWord($scope.search.word).then(function(words) {
          if ($scope.wordsToAdd.length !== 0) {
            for (var i = 0; i < $scope.wordsToAdd.length; i++) {
              for (var j = 0; j < words.length; j++) {
                if ($scope.wordsToAdd[i]._id === words[j]._id) {
                  words[j].dontShow = true;
                  break;
                }
              }
            }
          }
          $scope.words = words;
        }, function(err) {
          console.log(err);
        });
      } else {
        $scope.words = [];
      }

    }

    function addWord(word) {
      $scope.wordsToAdd.push(word);
      $scope.search.word = '';
      $scope.words = [];
    }

    function removeWord(word) {
      var index = $scope.wordsToAdd.indexOf(word);
      $scope.wordsToAdd.splice(index, 1);
    }

    function addTheme() {
      ThemeFactory.saveTheme($scope.wordsToAdd, $scope.theme.title).then(function(theme) {
        console.log(theme);
      }, function(err) {
        console.log(err);
      });
    }

  }
])

.controller('themeCtrl', ['$scope', '$stateParams', 'ThemeFactory',
  function($scope, $stateParams, ThemeFactory) {
    $scope.title = $stateParams.name;
    $scope.words = ThemeFactory.getThemeWords($stateParams.name);
  }
])

.controller('editWordCtrl', ['$scope', '$stateParams', 'WordsFactory', '$location',
  function($scope, $stateParams, WordsFactory, $location) {
    // Getting id from route
    var id = $stateParams.id;
    $scope.editWord = editWord;
    WordsFactory.getWord(id).then(function(word) {
      $scope.word = word;
    }, function(err) {
      console.log(err);
    });

    function editWord() {
      WordsFactory.updateWord(id, $scope.word).then(function(word) {
        console.log(word);
        $location.path('/page1');
      }, function(err) {
        console.log(err);
      });
    }
  }
])

.controller('addWordCtrl', ['$scope', '$stateParams', 'WordsFactory', '$cordovaCapture',
  function($scope, $stateParams, WordsFactory, $cordovaCapture) {
    $scope.saveWord = saveWord;
    $scope.addAudio = addAudio;
    $scope.word = {
      secretKey: 'atanasov123',
      eName: '',
      bName: ''
    };

    function addAudio() {
      $cordovaCapture.captureAudio().then(function(audioData) {

      }, function(err) {

      });
    }

    function saveWord() {
      WordsFactory.saveWord($scope.word).then(function() {
        $scope.word.eName = '';
        $scope.word.bName = '';
        $('input[type="file"]').val('');
      }, function(err) {

      });
    }
  }
])
