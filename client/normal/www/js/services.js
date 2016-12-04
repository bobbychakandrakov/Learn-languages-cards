angular.module('app.services', [])

.factory('ThemeFactory', ['$http', '$q', 'BACKEND_API', function($http, $q, BACKEND_API) {

  const url = BACKEND_API.THEMES;
  const packageUrl = BACKEND_API.PACKAGE;

  return {
    getThemes: function(limit) {
      limit = limit || 10;
      var deffered = $q.defer();
      $http.get(url + '/limit/' + limit).then(function(themes) {
        deffered.resolve(themes.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    getTheme: function(id) {
      var themeToSend = {};
      var deffered = $q.defer();
      $http.get(url + '/' + id).then(function(theme) {
        themeToSend.data = theme.data;
        $http.get(url + '/word/' + id).then(function(words) {
          themeToSend.words = words.data;
          deffered.resolve(themeToSend);
        }, function(err) {
          deffered.reject(err);
        });
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    getThemeWords: function(id) {
      var deffered = $q.defer();
      $http.get(url + '/word/' + id).then(function(theme) {
        deffered.resolve(theme.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    redeemTheme: function(code) {
      var deffered = $q.defer();
      $http.get(packageUrl + 'theme/' + code).then(function(package) {
        deffered.resolve(package.data.themes);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    }
  };
}])

.factory('WordsFactory', ['$http', '$q', 'BACKEND_API', function($http, $q, BACKEND_API) {

  const url = BACKEND_API.WORDS;
  return {
    getWords: function(limit) {
      limit = limit || 10;
      var deffered = $q.defer();
      $http.get(url + '/limit/' + limit).then(function(words) {
        deffered.resolve(words.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    getWord: function(id) {
      var deffered = $q.defer();
      $http.get(url + '/' + id).then(function(word) {
        deffered.resolve(word.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    searchWord: function(word) {
      var deffered = $q.defer();
      $http.get(url + '/search/' + word).then(function(words) {
        deffered.resolve(words.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    }
  };
}])

.factory('settingsFactory', ['$http', '$q', '$cordovaFile', function($http, $q, $cordovaFile) {


  var codes = '';
  var themes = [];

  return {
    readSettings: function() {
      var deffered = $q.defer();
      // Checking if directroty exists
      $cordovaFile.checkDir(cordova.file.externalRootDirectory + '/LearnLanguageCards')
        .then(function(success) {
          $cordovaFile.checkFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt')
            .then(function(success) {
              $cordovaFile.readAsText(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt')
                .then(function(data) {
                  deffered.resolve();
                }, function(err) {
                  deffered.reject(err);
                });
            }, function(err) {
              $cordovaFile.createFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codex.txt', true)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  deffered.reject(err);
                });
            });
        }, function(err) {
          $cordovaFile.createDir(cordova.file.externalRootDirectory, 'LearnLanguageCards', false)
            .then(function(success) {
              $cordovaFile.createFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', true)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  deffered.reject(err);
                });
            }, function(err) {
              deffered.reject(err);
            });
        });
      return deffered.promise;
    },
    saveSettings: function(code) {
      var deffered = $q.defer();

      $cordovaFile.checkDir(cordova.file.externalRootDirectory + '/LearnLanguageCards')
        .then(function(success) {
          $cordovaFile.checkFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt')
            .then(function(success) {
              $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', code)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  deffered.reject(err);
                });
            }, function(err) {
              $cordovaFile.createFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', true)
                .then(function(success) {
                  $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', code)
                    .then(function(success) {
                      deffered.resolve(success);
                    }, function(err) {
                      deffered.reject(err);
                    });
                }, function(err) {
                  deffered.resolve(err);
                });
            });
        }, function(err) {
          $cordovaFile.createDir(cordova.file.externalRootDirectory, 'LearnLanguageCards', false)
            .then(function(success) {
              $cordovaFile.checkFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt')
                .then(function(success) {
                  $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', code)
                    .then(function(success) {
                      deffered.resolve(success);
                    }, function(err) {
                      deffered.reject(err);
                    });
                }, function(err) {
                  $cordovaFile.createFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', true)
                    .then(function(success) {
                      $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', code)
                        .then(function(success) {
                          deffered.resolve(success);
                        }, function(err) {
                          deffered.reject(err);
                        });
                    }, function(err) {
                      deffered.resolve(err);
                    });
                });
            }, function(error) {
              deffered.reject(error);
            });
        });

      return deffered.promise;
    },
    editSettings: function(code) {
      var content = JSON.stringify(code);
      $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt', content)
        .then(function(success) {
          deffered.resolve(success);
        }, function(err) {
          deffered.reject(err);
        });
    },
    deleteSettings: function(code) {

    },
    getSettings: function() {
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.externalRootDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          deffered.resolve(data);
        }, function(err) {
          deffered.reject(err);
        });
      return deffered.promise;
    }
  };
}])

.factory('downloadFactory', ['$http', '$q', '$cordovaFileTransfer', 'BACKEND_API', function($http, $q, $cordovaFileTransfer, BACKEND_API) {
  const url = BACKEND_API.IMG;
  return {
    downloadWord: function(word) {

    },
    downloadTheme: function(theme) {
      document.addEventListener('deviceready', function() {
        var deffered = $q.defer();
        $cordovaFileTransfer.download('https://demo-project-bobbychakandrakov.c9users.io/uploads/image-1480413741787.jpeg', cordova.file.externalRootDirectory + 'testImage.jpeg', {}, true)
          .then(function(success) {
            deffered.resolve(success);
          }, function(err) {
            deffered.reject(err);
          });
        return deffered.promise;
      }, false);
    }
  };
}])

.service('BlankService', [function() {

}]);
