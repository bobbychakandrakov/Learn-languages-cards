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

.controller('themesCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', '$ionicPopup', 'settingsFactory', 'downloadFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory, BACKEND_API, $ionicPopup, settingsFactory, downloadFactory) {

    $scope.IMG = BACKEND_API.IMG;
    $scope.redeemTheme = redeemTheme;
    $scope.themes = [];

    $scope.$on("$ionicView.enter", function(event, data) {
      settingsFactory.getSavedThemes()
        .then(function(data) {
          data = JSON.parse(data);
          for (var i = 0; i < data.themes.length; i++) {
            $scope.themes.push(data.themes[i].data);
          }
          //$scope.themes = data.themes.data;
        }, function(err) {
          $scope.themes = [];
        });
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
            // var pushToArr = false;
            // for (var i = 0; i < data.length; i++) {
            //   for (var j = 0; j < $scope.themes.length; j++) {
            //     if (data[i]._id === $scope.themes[j]) {
            //       pushToArr = true;
            //     }
            //   }
            //   if (pushToArr) {
            //     $scope.themes.push(data[i]);
            //   }
            //   pushToArr = false;
            // }
            // console.log();
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

.controller('themeCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', 'settingsFactory', 'downloadFactory', '$cordovaToast', '$cordovaSpinnerDialog',
  function($scope, $stateParams, ThemeFactory, BACKEND_API, settingsFactory, downloadFactory, $cordovaToast, $cordovaSpinnerDialog) {

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
    var promises = [];

    function toggleDownload() {
      if ($scope.isSaving.checked) {
        for (var i = 0; i < $scope.theme.words.length; i++) {
          promises.push(downloadFactory.downloadWord($scope.theme.words[i].imagePath));
          if (!angular.isUndefined($scope.theme.words[i].maleVoice)) {
            promises.push(downloadFactory.downloadWord($scope.theme.words[i].maleVoice.url));
          }
          if (!angular.isUndefined($scope.theme.words[i].femaleVoice)) {
            promises.push(downloadFactory.downloadWord($scope.theme.words[i].femaleVoice.url));
          }
        }

      } else {
        // Delete code from codes.txt file
        //settingsFactory.deleteSettings();
      }
    }

    function loadData() {
      ThemeFactory.getTheme(id).then(function(theme) {
        $scope.theme = theme;
        settingsFactory.editSettings(theme)
          .then(function(success) {

          }, function(err) {

          });
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
