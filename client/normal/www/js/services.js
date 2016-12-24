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
  var objs = {
    savedThemes: [],
    words: [],
    themes: []
  };

  return {
    readSettings: function() {
      var deffered = $q.defer();
      // Checking if directroty exists
      $cordovaFile.checkDir(cordova.file.documentsDirectory + '/LearnLanguageCards')
        .then(function(success) {
          $cordovaFile.checkFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
            .then(function(success) {
              $cordovaFile.checkDir(cordova.file.documentsDirectory + '/LearnLanguageCards/uploads')
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  $cordovaFile.createDir(cordova.file.documentsDirectory + '/LearnLanguageCards', 'uploads')
                    .then(function(success) {
                      deffered.resolve(success);
                    }, function(err) {
                      deffered.reject(err);
                    });
                });
            }, function(err) {
              $cordovaFile.createFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codex.txt', true)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  deffered.reject(err);
                });
            });
        }, function(err) {
          $cordovaFile.createDir(cordova.file.documentsDirectory, 'LearnLanguageCards', false)
            .then(function(success) {
              $cordovaFile.createFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', true)
                .then(function(success) {
                  $cordovaFile.createDir(cordova.file.documentsDirectory + '/LearnLanguageCards', 'uploads')
                    .then(function(success) {
                      deffered.resolve(success);
                    }, function(err) {
                      deffered.reject(err);
                    });
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

      $cordovaFile.checkDir(cordova.file.documentsDirectory + '/LearnLanguageCards')
        .then(function(success) {
          $cordovaFile.checkFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
            .then(function(success) {
              $cordovaFile.writeExistingFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', code)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  deffered.reject(err);
                });
            }, function(err) {
              $cordovaFile.createFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', true)
                .then(function(success) {
                  $cordovaFile.writeExistingFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', code)
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
          $cordovaFile.createDir(cordova.file.documentsDirectory, 'LearnLanguageCards', false)
            .then(function(success) {
              $cordovaFile.checkFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
                .then(function(success) {
                  $cordovaFile.writeExistingFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', code)
                    .then(function(success) {
                      deffered.resolve(success);
                    }, function(err) {
                      deffered.reject(err);
                    });
                }, function(err) {
                  $cordovaFile.createFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', true)
                    .then(function(success) {
                      $cordovaFile.writeExistingFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', code)
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
    editSettings: function(theme) {
      objs.savedThemes.push(theme);
      var content = JSON.stringify(objs);
      $cordovaFile.checkFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(success) {
          $cordovaFile.writeExistingFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', content)
            .then(function(success) {
              deffered.resolve(success);
            }, function(err) {
              deffered.reject(err);
            });
        }, function(err) {
          $cordovaFile.createFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
            .then(function(success) {
              $cordovaFile.writeExistingFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', content)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  deffered.reject(err);
                });
            }, function(err) {
              deffered.reject(err);
            });
        });
    },
    deleteSettings: function(code) {

    },
    getSettings: function() {
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          deffered.resolve(data);
        }, function(err) {
          deffered.reject(err);
        });
      return deffered.promise;
    },
    loadThemes: function() {
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          data = JSON.parse(data);
          objs.savedThemes = data.savedThemes;
          objs.themes = data.themes;
          deffered.resolve(objs.themes.length);
        }, function(err) {
          deffered.reject();
        });
      return deffered.promise;
    },
    loadWords: function() {
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          data = JSON.parse(data);
          objs.words = [].concat(objs.words, data.words);
          deffered.resolve();
        }, function(err) {
          deffered.reject();
        });
      return deffered.promise;
    },
    getSavedThemes: function() {
      return objs.themes;
    },
    getSavedWords: function() {
      return objs.words;
    },
    searchTheme: function(theme) {
      for (var i = 0; i < objs.themes.length; i++) {
        if (objs.themes[i]._id === theme._id) {
          return objs.themes[i];
        }
      }
      return -1;
    },
    saveThemeCache: function(theme) {
      var deffered = $q.defer();
      objs.themes = theme;
      var content = JSON.stringify(objs);
      $cordovaFile.writeFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', content, true)
        .then(function(success) {
          deffered.resolve(success);
        }, function(err) {
          deffered.reject(err);
        });
      return deffered.promise;
    },
    getThemes: function() {
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          data = JSON.parse(data);
          deffered.resolve(data.themes);
        }, function(error) {
          deffered.reject(error);
        });
      return deffered.promise;
    },
    saveDownloadedTheme: function(theme) {
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          data = JSON.parse(data);
          objs.savedThemes = data.savedThemes;
          objs.themes = data.themes;
          objs.savedThemes.push(theme);
          var content = JSON.stringify(objs);
          $cordovaFile.writeFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', content, true)
            .then(function(success) {
              deffered.resolve(success);
            }, function(error) {
              deffered.reject(error);
            });
        }, function(err) {
          deffered.reject();
        });


      return deffered.promise;
    },
    checkDownload: function(id) {
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          data = JSON.parse(data);
          objs.savedThemes = data.savedThemes;
          objs.themes = data.themes;
          for (var i = 0; i < objs.savedThemes.length; i++) {
            if (objs.savedThemes[i].data._id == id) {
              deffered.resolve(objs.savedThemes[i]);
            }
          }
          deffered.reject();
        }, function(err) {
          deffered.reject();
        });
      return deffered.promise;
    },
    getDownloadedTheme: function(id) {
      // var deffered = $q.defer();
      // var isFound = false;
      // for (var i = 0; i < objs.savedThemes.length; i++) {
      //   if (objs.savedThemes[i]._id == id) {
      //     deffered.resolve(objs.savedThemes[i].data);
      //     isFound = true;
      //     break;
      //   }
      // }
      // if (!isFound) {
      //   deffered.reject();
      // }
      // return deffered.promise;
      for (var i = 0; i < objs.savedThemes.length; i++) {
        if (objs.savedThemes[i].data._id == id) {
          return objs.savedThemes[i].data;
        }
      }
    }
  };
}])

.factory('downloadFactory', ['$http', '$q', '$cordovaFileTransfer', 'BACKEND_API', function($http, $q, $cordovaFileTransfer, BACKEND_API) {
  const url = BACKEND_API.IMG;
  return {
    downloadWord: function(word) {
      // Making it to folder LearnLanguageCards/uploads for better performance
      document.addEventListener('deviceready', function() {
        var deffered = $q.defer();
        $cordovaFileTransfer.download(url + word, cordova.file.documentsDirectory + 'LearnLanguageCards/' + word, {}, true)
          .then(function(success) {
            deffered.resolve(success);
          }, function(err) {
            deffered.reject(err);
          });
        return deffered.promise;
      }, false);
    },
    downloadTheme: function(theme) {
      // Making it to folder LearnLanguageCards/uploads for better performance
      document.addEventListener('deviceready', function() {
        var deffered = $q.defer();
        $cordovaFileTransfer.download(url + 'uploads/image-1480413741787.jpeg', cordova.file.documentsDirectory + 'LearnLanguageCards/uploads/image-1480413741787.jpeg', {}, true)
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

.factory('platformService', ['$q', function($q) {
  var platform = '';
  var fileStructure;
  return {
    setCurrentPlatform: function() {
      console.log('Setting ...');
      if (ionic.Platform.isIPad()) {
        platform = 'IPad';
        fileStructure = cordova.file.documentsDirectory;
      } else if (ionic.Platform.isIOS()) {
        platform = 'IOS';
        fileStructure = cordova.file.documentsDirectory;
      } else if (ionic.Platform.isAndroid()) {
        platform = 'Android';
        fileStructure = cordova.file.documentsDirectory;
      } else if (ionic.Platform.isWindowsPhone()) {
        platform = 'Windows';
        fileStructure = cordova.file.documentsDirectory;
      } else {
        platform = 'undefined';
      }
    },
    getCurrentPlatform: function() {
      return platform;
    },
    getFileStructure: function() {
      return fileStructure;
    }
  };
}])


// For Android : cordova.file.documentsDirectory
// For IOS: cordova.file.documentsDirectory

.factory('folderService', ['$q', '$cordovaFile', 'platformService', function($q, $cordovaFile, platformService) {
  // Storing themes and words in one main object
  var mainObj = {
    themes: [],
    words: []
  };
  return {
    settupAplicationFolder: function() {
      // Switch hardcoded folder path with folder variable
      // var folder = platformService.getFileStructure();
      var deffered = $q.defer();
      $cordovaFile.checkDir(cordova.file.documentsDirectory + '/LearnLanguageCards')
        .then(function(success) {
          $cordovaFile.createDir(cordova.file.documentsDirectory, 'LearnLanguageCards', false)
            .then(function(success) {
              $cordovaFile.createDir(cordova.file.documentsDirectory + '/LearnLanguageCards', 'uploads', false)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  // Folder structure not meet requirements
                  deffered.reject(err);
                  console.log(err);
                });
            }, function(err) {
              // Error creating application folder
              deffered.reject(err);
              console.log(err);
            });
        }, function(err) {
          // Create application folder
          $cordovaFile.createDir(cordova.file.documentsDirectory, 'LearnLanguageCards', false)
            .then(function(success) {
              $cordovaFile.createDir(cordova.file.documentsDirectory + '/LearnLanguageCards', 'uploads', false)
                .then(function(success) {
                  deffered.resolve(success);
                }, function(err) {
                  // Folder structure not meet requirements
                  deffered.reject(err);
                  console.log(err);
                });
            }, function(err) {
              // Folder structure not meet requirements
              deffered.reject(err);
              console.log(err);
            });
        });

      return deffered.promise;
    },
    writeConfiguratinFile: function(data) {
      var deffered = $q.defer();
      for (var i = 0; i < data.length; i++) {
        mainObj.themes.push(data[i]);
      }
      var transformedData = JSON.stringify(mainObj);
      $cordovaFile.checkFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(success) {
          $cordovaFile.writeFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', transformedData, true)
            .then(function(success) {
              deffered.resolve(success);
            }, function(err) {
              deffered.reject(err);
            });
        }, function(err) {
          // Create configuration file
          $cordovaFile.createFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', true)
            .then(function(success) {
              $cordovaFile.writeFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', transformedData, true)
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
    toggleDownloadMode: function(id) {
      var deffered = $q.defer();
      for (var i = 0; i < mainObj.themes.length; i++) {
        if (mainObj.themes[i]._id == id) {
          mainObj.themes[i].toggled = true;
          break;
        }
      }
      var transformedData = JSON.stringify(mainObj);
      $cordovaFile.checkFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(success) {
          $cordovaFile.writeFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', transformedData, true)
            .then(function(success) {
              deffered.resolve(success);
            }, function(err) {
              deffered.reject(err);
            });
        }, function(err) {
          // Create configuration file
          $cordovaFile.createFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', true)
            .then(function(success) {
              $cordovaFile.writeFile(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt', transformedData, true)
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
    getSavedTheme: function(id) {
      var deffered = $q.defer();
      for (var i = 0; i < mainObj.themes.length; i++) {
        if (mainObj.themes[i]._id == id) {
          deffered.resolve(mainObj.themes[i]);
          return deffered.promise;
        }
      }
      deffered.reject('Theme not found!');
      return deffered.promise;
    }
  };
}])


.factory('dataManager', ['$q', '$cordovaFile', function($q, $cordovaFile) {

  return {
    readConfigurationFile: function() {
      // Return parsed data from string to JSON
      var deffered = $q.defer();
      $cordovaFile.readAsText(cordova.file.documentsDirectory + '/LearnLanguageCards', 'codes.txt')
        .then(function(data) {
          // Formatting data to JSON object
          console.log('Data from file:');
          console.log(data);
          deffered.resolve(data);
        }, function(err) {
          console.log('Error while reading file:');
          deffered.reject(err);
        });
      return deffered.promise;
    },
    setDownloadedThemes: function() {
      // Read and append data
    },
    setDownloadedWords: function() {
      // Read and append data
    },
    getDownloadedThemes: function() {
      // Return only themes data from file
    },
    getDownloadedWords: function() {
      // Return only words data from file
    },
    deleteConfigurationData: function() {
      // Erasing data from text file but not deleting the file
    }
  };
}])


.service('BlankService', [function() {

}]);
