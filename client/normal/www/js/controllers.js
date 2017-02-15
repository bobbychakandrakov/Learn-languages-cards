angular.module('app.controllers', [])

.controller('wordsCtrl', ['$scope', '$stateParams', 'WordsFactory', 'BACKEND_API', '$sce', '$ionicActionSheet', '$ionicPopup',
  function($scope, $stateParams, WordsFactory, BACKEND_API, $sce, $ionicActionSheet, $ionicPopup) {
    var limit = 10;
    var isPlaying = false;

    $scope.IMG = BACKEND_API.IMG;
    var myAudio;
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl($scope.IMG + src);
    };
    $scope.playMaleVoice = playMaleVoice;
    $scope.playFemaleVoice = playFemaleVoice;
    $scope.showActionSheet = showActionSheet;


    function showActionSheet(word) {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Add to theme'
        }],
        titleText: 'Add to my theme',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
          hideSheet();
        },
        buttonClicked: function(index) {
          $scope.data = {};
          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<ul><li>Theme1</li><li>Theme2</li><li>Theme3</li></ul>',
            title: 'Select theme',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [{
              text: 'Cancel'
            }, {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {

              }
            }]
          });

          myPopup.then(function(res) {
            if (res) {
              console.log('ok')
            }
            console.log('Tapped!', res);
          });
          return true;
        }
      });
    }


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

.controller('themesCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', '$ionicPopup', 'settingsFactory', 'downloadFactory', 'folderService',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, ThemeFactory, BACKEND_API, $ionicPopup, settingsFactory, downloadFactory, folderService) {

    $scope.IMG = BACKEND_API.IMG;
    $scope.redeemTheme = redeemTheme;
    $scope.themes = [];

    $scope.$on("$ionicView.enter", function(event, data) {
      // settingsFactory.getSavedThemes()
      //   .then(function(data) {
      //     data = JSON.parse(data);
      //     for (var i = 0; i < data.themes.length; i++) {
      //       $scope.themes.push(data.themes[i].data);
      //     }
      //     //$scope.themes = data.themes.data;
      //   }, function(err) {
      //     $scope.themes = [];
      //   });

    });

    settingsFactory.getThemes()
      .then(function(themes) {
        $scope.themes = themes;
      }, function(error) {
        console.log(error);
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
            var add = true;
            for (var i = 0; i < data.length; i++) {
              // Check if themes are in the array already
              for (var j = 0; j < $scope.themes.length; j++) {
                if ($scope.themes[j]._id == data[i]._id) {
                  add = false;
                  break;
                }
              }
              if (add) {
                $scope.themes.push(data[i]);
              }
              add = false;
            }
            settingsFactory.saveThemeCache($scope.themes)
              .then(function(success) {
                // Handle success message
              }, function(error) {
                alert(error);
              });
            // folderService.writeConfiguratinFile(data)
            //   .then(function(success) {
            //     console.log('Data added! :)');
            //   }, function(err) {
            //     console.log('Error trying to write data:');
            //     console.log(err);
            //   });
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

.controller('themeCtrl', ['$scope', '$stateParams', 'ThemeFactory', 'BACKEND_API', 'settingsFactory', 'downloadFactory', '$cordovaToast', '$cordovaSpinnerDialog', 'dataManager', 'folderService', '$q',
  function($scope, $stateParams, ThemeFactory, BACKEND_API, settingsFactory, downloadFactory, $cordovaToast, $cordovaSpinnerDialog, dataManager, folderService, $q) {

    var id = $stateParams.id;
    var myAudio;

    $scope.playMaleVoice = playMaleVoice;
    $scope.playFemaleVoice = playFemaleVoice;
    $scope.toggleDownload = toggleDownload;
    $scope.isSaving = {
      checked: false
    };
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl($scope.IMG + src);
    };

    $scope.$on("$ionicView.enter", function(event, data) {
      loadData();

    });
    $scope.theme = {};
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
        $q.all(promises)
          .then(function(data) {
            // body...
            alert('Donwloaded');
          }, function(error) {
            // body...
            alert(error);
          });

      } else {
        // Delete code from codes.txt file
        //settingsFactory.deleteSettings();
      }
      // folderService.toggleDownloadMode(id)
      //   .then(function(success) {
      //     dataManager.readConfigurationFile()
      //       .then(function(data) {
      //         // body...
      //       }, function(err) {
      //         // body...
      //       });
      //   }, function(err) {
      //     console.log('Error toggle mode');
      //     dataManager.readConfigurationFile()
      //       .then(function(data) {
      //         // body...
      //       }, function(err) {
      //         // body...
      //       });
      //   });
      $scope.theme.toggled = true;
      settingsFactory.saveDownloadedTheme($scope.theme)
        .then(function(success) {
          // body...
          alert('Theme saved!');
        }, function(error) {
          // body...
          alert('Error while saving theme!');
        });

    }

    function loadData() {
      // folderService.getSavedTheme(id)
      //   .then(function(theme) {
      //     $scope.theme = theme;
      //     if ($scope.theme.toggled === true) {
      //       $scope.isSaving.checked = true;
      //     }
      //
      //   }, function(err) {
      //     console.log(err);
      //     ThemeFactory.getTheme(id).then(function(theme) {
      //       $scope.theme = theme;
      //       settingsFactory.editSettings(theme)
      //         .then(function(success) {
      //
      //         }, function(err) {
      //
      //         });
      //     }, function(err) {
      //       console.log(err);
      //     });
      //   });

      // var isSaved = settingsFactory.checkDownload(id);
      // if (isSaved == true) {
      //   //$scope.IMG = "file:///storage/emulated/0/LearnLanguageCards/";
      //   // settingsFactory.getDownloadedTheme(id)
      //   //   .then(function(theme) {
      //   //     // body...
      //   //     $scope.theme = theme;
      //   //     $scope.theme.toggled = true;
      //   //   }, function(error) {
      //   //     // body...
      //   //     alert('Something is wrong!');
      //   //   });
      //   $scope.theme = settingsFactory.getDownloadedTheme(id);
      //   alert($scope.theme.words[0].eName);
      //
      // } else {
      //   alert('From internet!');
      //   ThemeFactory.getTheme(id).then(function(theme) {
      //     $scope.theme = theme;
      //   }, function(err) {
      //     console.log(err);
      //   });
      // }

      settingsFactory.checkDownload(id)
        .then(function(theme) {
          // body...
          $scope.IMG = cordova.file.documentsDirectory + '/LearnLanguageCards/';
          $scope.theme = theme;
          $scope.isSaving.checked = true;
          $scope.trustSrc = function(src) {
            return $scope.IMG + src;
          };
        }, function(error) {
          // body...
          ThemeFactory.getTheme(id).then(function(theme) {
            $scope.theme = theme;
          }, function(err) {
            console.log(err);
          });
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

.controller('myThemesCtrl', ['$scope', '$stateParams', '$ionicPopup', function($scope, $stateParams, $ionicPopup) {

  $scope.themes = [];
  $scope.addTheme = addTheme;
  $scope.removeTheme = removeTheme;
  $scope.viewTheme = viewTheme;


  function guid() {
    return Math.floor((Math.random() * 10000) + 1);
  }

  function viewTheme() {
    console.log($scope.themes);
  }

  function addTheme() {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.themeName">',
      title: 'Add theme',
      subTitle: 'Please enter theme name',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.themeName) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.themeName;
          }
        }
      }]
    });

    myPopup.then(function(res) {
      var item = {
        _id: guid(),
        name: res
      };
      $scope.themes.push(item);
      // Logic to save theme in application data folder file
    });
  }

  function removeTheme(theme) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Removing theme',
      template: 'Are you sure you want to remove this theme?'
    });

    confirmPopup.then(function(res) {
      if (res) {
        var index = $scope.themes.indexOf(theme);
        if (index > -1) {
          $scope.themes.splice(index, 1);
          // Logic to remove from application data folder
        }
      }
    });
  }
}])
