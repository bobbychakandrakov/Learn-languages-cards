angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, WordsFactory, $ionicPopup) {
    // Setting limit to 10 as default
    var limit = 10;
    $scope.loadMore = loadMore;
    $scope.deleteWord = deleteWord;
    WordsFactory.getWords().then(function(words) {
      console.log(words);
      $scope.words = words;
    }, function(err) {
      console.log(err);
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

    function deleteWord(id, word) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Deleting word',
        template: 'Are you sure you want to delete ' + word + '?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          console.log('You are going to delete word with id: ' + id);
        } else {
          console.log('You are not sure');
        }
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
