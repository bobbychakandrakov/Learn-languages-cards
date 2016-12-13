angular.module('app.services', [])

.factory('ThemeFactory', ['$http', '$q', 'BACKEND_API', function($http, $q, BACKEND_API) {
  //const url = 'http://192.168.213.2:3333/api/theme';
  const url = BACKEND_API.THEMES;
  //const url = 'http://192.168.0.105:3333/api/theme';

  return {
    saveTheme: function(words, name) {
      var data = {};
      data.words = '';
      data.name = name;
      data.secretKey = 'atanasov123';
      data.words += words[0]._id;
      for (var i = 1; i < words.length; i++) {
        data.words += ',' + words[i]._id;
      }
      var deffered = $q.defer();
      $http.post(url, data).then(function(theme) {
        deffered.resolve(theme);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    updateTheme: function(words, name, id) {
      var data = {};
      data.words = '';
      data.name = name;
      data.secretKey = 'atanasov123';
      data.words += words[0]._id;
      for (var i = 1; i < words.length; i++) {
        data.words += ',' + words[i]._id;
      }
      var deffered = $q.defer();
      $http.put(url + '/word/' + id, data).then(function(theme) {
        deffered.resolve(theme);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
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
    getThemeWords: function(id) {
      var deffered = $q.defer();
      $http.get(url + '/word/' + id).then(function(theme) {
        deffered.resolve(theme.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    deleteTheme: function(id) {
      var deffered = $q.defer();
      $http.delete(url + '/' + id).then(function(theme) {
        deffered.resolve(theme);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    getTheme: function(id) {
      var deffered = $q.defer();
      $http.get(url + '/' + id).then(function(theme) {
        deffered.resolve(theme.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    searchTheme: function(name) {
      var deffered = $q.defer();
      $http.get(url).then(function(themes) {
          deffered.resolve(themes.data);
        },
        function(err) {
          deffered.reject(err);
        });
      return deffered.promise;
    }
  };
}])

.factory('WordsFactory', ['$http', '$q', 'BACKEND_API', function($http, $q, BACKEND_API) {
  //const url = 'http://192.168.213.2:3333/api/word';
  const url = BACKEND_API.WORDS;
  //const url = 'http://192.168.0.105:3333/api/word';
  return {
    getWords: function(limit) {
      limit = limit || 10;
      var deffed = $q.defer();
      $http.get(url + '/limit/' + limit).then(function(words) {
        deffed.resolve(words.data);
      }, function(err) {
        deffed.reject(err);
      });
      return deffed.promise;
      return words;
    },
    saveWord: function(data) {
      // Using form data jquery
      var deffed = $q.defer();
      $.ajaxFormData(url, {
        method: 'POST',
        data: {
          'eName': data.eName,
          'bName': data.bName,
          'secretKey': 'atanasov123',
          'image': data.image,
          'maleVoice': data.maleVoice,
          'femaleVoice': data.femaleVoice
        },
        success: function() {
          deffed.resolve();
        },
        error: function() {
          deffed.reject();
        }
      });
      return deffed.promise;
    },
    deleteWord: function(id) {
      var deffed = $q.defer();
      $http.delete(url + '/' + id).then(function(res) {
        deffed.resolve(res);
      }, function(err) {
        deffed.reject(err);
      });
      return deffed.promise;
    },
    getWord: function(id) {
      var deffed = $q.defer();
      $http.get(url + '/' + id).then(function(word) {
        deffed.resolve(word.data);
      }, function(err) {
        deffed.reject(err);
      });
      return deffed.promise;
    },
    updateWord: function(id, word) {
      var deffed = $q.defer();
      $.ajaxFormData(url + '/image/' + id, {
        method: 'PUT',
        data: {
          'eName': word.eName,
          'bName': word.bName,
          'files': word.image,
          'secretKey': 'atanasov123'
        },
        success: function() {
          deffed.resolve();
        },
        error: function() {
          deffed.reject();
        }
      });
      return deffed.promise;
    },
    searchWord: function(word) {
      var deffed = $q.defer();
      $http.get(url + '/search/' + word).then(function(words) {
        deffed.resolve(words.data);
      }, function(err) {
        deffed.reject(err);
      });
      return deffed.promise;
    }

  };
}])

.factory('PackageFactory', ['$http', '$q', 'BACKEND_API', function($http, $q, BACKEND_API) {
  const url = BACKEND_API.PACKAGE;
  return {
    createPackage: function(data) {
      var deffered = $q.defer();
      $http.post(url, data).then(function(package) {
        deffered.resolve(package);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    getAll: function() {
      var deffered = $q.defer();
      $http.get(url + 's').then(function(packages) {
        deffered.resolve(packages.data);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    deletePackage: function(id) {
      var deffered = $q.defer();
      $http.delete(url + '/' + id).then(function(package) {
        deffered.resolve(package);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    updatePackage: function(id, data) {
      var deffered = $q.defer();
      $http.put(url + '/' + id, data).then(function(package) {
        deffered.resolve(package);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
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
        fileStructure = cordova.file.dataDirectory;
      } else if (ionic.Platform.isIOS()) {
        platform = 'IOS';
        fileStructure = cordova.file.dataDirectory;
      } else if (ionic.Platform.isAndroid()) {
        platform = 'Android';
        fileStructure = cordova.file.externalRootDirectory;
      } else if (ionic.Platform.isWindowsPhone()) {
        platform = 'Windows';
        fileStructure = cordova.file.dataDirectory;
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

.service('BlankService', [function() {

}]);
