angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, WordsFactory, $ionicPopup) {
    // Setting limit to 10 as default
    var limit = 10;
    // Ionic on page enter event listener
    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();
    });

    $scope.loadMore = loadMore;
    $scope.deleteWord = deleteWord;
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
        console.log(words);
        $scope.words = words;
      }, function(err) {
        console.log(err);
      });
    }

    function loadMore() {
      limit += 10;
      WordsFactory.getWords(limit).then(function(words) {
        console.log(words);
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

.controller('addWordCtrl', ['$scope', '$stateParams', 'WordsFactory',
  function($scope, $stateParams, WordsFactory) {
    $scope.saveWord = saveWord;
    $scope.word = {
      secretKey: 'atanasov123',
      eName: '',
      bName: ''
    };



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
