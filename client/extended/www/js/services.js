angular.module('app.services', [])

.factory('ThemeFactory', ['$http', '$q', function($http, $q) {
  const url = 'http://192.168.213.2:3333';
  var themes = {
    'School': [{
      en: 'Chair',
      bg: 'Стол',
      image: 'img/chair.jpg'
    }, {
      en: 'Desk',
      bg: 'Бюро',
      image: 'img/desk.jpg'
    }, {
      en: 'Pen',
      bg: 'Химикал',
      image: 'img/pen.jpg'
    }, {
      en: 'Pencil',
      bg: 'Молив',
      image: 'img/pencil.jpg'
    }],
    'Animals': [{
      en: 'Cat',
      bg: 'Котка',
      image: 'img/cat.jpg'
    }, {
      en: 'Dog',
      bg: 'Куче',
      image: 'img/dog.jpg'
    }, {
      en: 'Rabbit',
      bg: 'Заек',
      image: 'img/rabbit.jpg'
    }]
  };
  var themeNames = ['School', 'Animals'];
  return {
    getThemeWords: function(name) {
      return themes[name];
    },
    getThemes: function() {
      return themeNames;
    }
  };
}])

.factory('WordsFactory', ['$http', '$q', function($http, $q) {
  const url = 'http://192.168.213.2:3333/api/word';
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
          'image': data.image,
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
      $http.put(url + '/' + id, word).then(function(word) {
        deffed.resolve(word);
      }, function(err) {
        deffed.reject(err);
      });
      return deffed.promise;
    }

  };
}])

.service('BlankService', [function() {

}]);
