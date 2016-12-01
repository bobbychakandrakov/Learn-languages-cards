angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', 'BACKEND_API', '$sce', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, WordsFactory, BACKEND_API, $sce) {
    var limit = 10;
    var isPlaying = false;

    $scope.IMG = BACKEND_API.IMG;
    var myAudio;
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl($scope.IMG + src);
    };
    $scope.playMaleVoice = playMaleVoice;
    $scope.playFemaleVoice = playFemaleVoice;

    function playMaleVoice(id) {
      if (isPlaying) {
        myAudio.pause();
        isPlaying = !isPlaying;
      } else {
        myAudio = document.getElementById('male' + id);
        if (myAudio.paused) {
          myAudio.play();
          isPlaying = true;
        } else {
          myAudio.pause();
          isPlaying = false;
        }
      }

    }

    function playFemaleVoice(id) {
      if (isPlaying) {
        myAudio.pause();
        isPlaying = !isPlaying;

      } else {
        myAudio = document.getElementById('female' + id);
        if (myAudio.paused) {
          myAudio.play();
          isPlaying = true;
        } else {
          myAudio.pause();
          isPlaying = false;
        }
      }

    }

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

.controller('themesCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory, BACKEND_API, $ionicPopup) {

    $scope.IMG = BACKEND_API.IMG;
    $scope.redeemTheme = redeemTheme;

    ThemeFactory.getThemes().then(function(themes) {
      $scope.themes = [];
    }, function(err) {
      console.log(err);
    });

    function redeemTheme() {
      showPopup();
    }

    function showPopup() {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.code">',
        title: 'Enter redeem code',
        subTitle: 'Please, enter a correct redeem code',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Redeem</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.code) {
              e.preventDefault();
            } else {
              return $scope.data.code;
            }
          }
        }]
      });

      myPopup.then(function(res) {
        // Check redeem code and add theme
        if (res) {
          ThemeFactory.redeemTheme(res).then(function(data) {
            for (var i = 0; i < data.length; i++) {
              $scope.themes.push(data[i]);
            }
          }, function(err) {
            var alertPopup = $ionicPopup.alert({
              title: 'Ooops!',
              template: 'Wrong code. Please, make sure you enter the code correctly!'
            });

            alertPopup.then(function(res) {
              showPopup();
            });
          });
        }
      });
    }

  }
])

.controller('themeCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', 'settingsFactory',
  function($scope, $stateParams, ThemeFactory, BACKEND_API, settingsFactory) {

    var id = $stateParams.id;
    var myAudio;

    $scope.playMaleVoice = playMaleVoice;
    $scope.playFemaleVoice = playFemaleVoice;
    $scope.toggleDownload = toggleDownload;
    $scope.isSaving = {
      checked: false
    };

    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();
    });

    $scope.IMG = BACKEND_API.IMG;

    function toggleDownload() {
      if ($scope.isSaving.checked) {
        // Save code in codex.txt file
        settingsFactory.saveSettings('dwada').then(function(result) {

        }, function(err) {

        });
      } else {
        // Delete code from codes.txt file
        //settingsFactory.deleteSettings();
      }
    }

    function loadData() {
      ThemeFactory.getTheme(id).then(function(theme) {
        $scope.theme = theme;
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
