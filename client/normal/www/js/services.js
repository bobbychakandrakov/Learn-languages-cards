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
  return {
    saveSettings: function(code) {
      $cordovaFile.writeFile('codex.txt', 'this is fucking code', {
        'append': false
      }).then(function(result) {

      }, function(err) {

      });
    },
    editSettings: function(code) {

    },
    deleteSettings: function(code) {

    }
  };
}])

.factory('downloadFactory', ['$http', '$q', function($http, $q) {
  return {
    downloadWord: function(word) {

    },
    downloadTheme: function(theme) {

    }
  };
}])

.service('BlankService', [function() {

}]);
