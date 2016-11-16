angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', '$ionicPopup', '$location', '$sce', '$cordovaMedia', 'BACKEND_API',
  function($scope, $stateParams, WordsFactory, $ionicPopup, $location, $sce, $cordovaMedia, BACKEND_API) {
    $scope.IMG = BACKEND_API.IMG;
    // Setting limit to 10 as default
    var limit = 10;

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl($scope.IMG + src);
    };
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

.controller('themesCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory, BACKEND_API) {

    $scope.IMG = BACKEND_API.IMG;

    var limit = 10;
    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();
    });

    function loadData() {
      ThemeFactory.getThemes(limit).then(function(themes) {
        $scope.themes = themes;
      }, function(err) {
        console.log(err);
      });
    }


  }
])

.controller('addThemeCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'WordsFactory', 'BACKEND_API', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory, WordsFactory, BACKEND_API) {

    $scope.IMG = BACKEND_API.IMG;

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
        $scope.theme.title = '';
        $scope.wordsToAdd = [];
      }, function(err) {
        console.log(err);
      });
    }

  }
])

.controller('themeCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'WordsFactory', '$ionicPopup', '$location', 'BACKEND_API',
  function($scope, $stateParams, ThemeFactory, WordsFactory, $ionicPopup, $location, BACKEND_API) {

    $scope.IMG = BACKEND_API.IMG;

    var id = $stateParams.id;
    $scope.id = id;
    $scope.title = $stateParams.name;
    $scope.deleteTheme = deleteTheme;



    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();
    });

    function loadData() {
      ThemeFactory.getThemeWords($stateParams.id).then(function(words) {
        $scope.words = words;
      }, function(err) {
        console.log(err);
      });
    }

    function deleteTheme() {
      var confirmPopup = $ionicPopup.confirm({
        template: 'Are you sure you want to delete \'' + $scope.title + '\' ?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          ThemeFactory.deleteTheme(id).then(function(theme) {
            $location.path('/page1/page3');
          }, function(err) {
            console.log(err);
          });
        }
      });

    }
  }
])

.controller('editWordCtrl', ['$scope', '$stateParams', 'WordsFactory', '$location', 'BACKEND_API',
  function($scope, $stateParams, WordsFactory, $location, BACKEND_API) {

    $scope.IMG = BACKEND_API.IMG;

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

.controller('editThemeCtrl', ['$scope', '$stateParams', 'WordsFactory', '$location', 'ThemeFactory', '$ionicHistory', 'BACKEND_API',
  function($scope, $stateParams, WordsFactory, $location, ThemeFactory, $ionicHistory, BACKEND_API) {

    $scope.IMG = BACKEND_API.IMG;

    var id = $stateParams.id;
    $scope.wordsToAdd = [];
    $scope.addWord = addWord;
    $scope.removeWord = removeWord;
    $scope.searchWord = searchWord;
    $scope.updateTheme = updateTheme;
    $scope.theme = {
      title: ''
    };
    $scope.search = {
      word: ''
    };

    ThemeFactory.getTheme(id).then(function(theme) {
      $scope.theme.title = theme.name;
      ThemeFactory.getThemeWords(id).then(function(words) {
        $scope.wordsToAdd = words;
      }, function(err) {
        console.log(err);
      });
    }, function(err) {
      console.log(err);
    });

    function addWord(word) {
      $scope.wordsToAdd.push(word);
      $scope.search.word = '';
      $scope.words = [];
    }

    function removeWord(word) {
      var index = $scope.wordsToAdd.indexOf(word);
      $scope.wordsToAdd.splice(index, 1);
    }

    function updateTheme() {
      ThemeFactory.updateTheme($scope.wordsToAdd, $scope.theme.title, id).then(function(theme) {
        $ionicHistory.goBack();
      }, function(err) {
        console.log(err);
      });
    }

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
  }
])

.controller('addWordCtrl', ['$scope', '$stateParams', 'WordsFactory', '$cordovaCapture', '$cordovaMedia', '$ionicPopup', '$cordovaFile', 'BACKEND_API',
  function($scope, $stateParams, WordsFactory, $cordovaCapture, $cordovaMedia, $ionicPopup, $cordovaFile, BACKEND_API) {

    $scope.IMG = BACKEND_API.IMG;

    $scope.saveWord = saveWord;
    $scope.word = {
      secretKey: 'atanasov123',
      eName: '',
      bName: ''
    };

    function saveWord() {
      console.log($scope.word);
      WordsFactory.saveWord($scope.word).then(function() {
        $scope.word.eName = '';
        $scope.word.bName = '';
        $('input[type="file"]').val('');
      }, function(err) {

      });
    }
  }
])
