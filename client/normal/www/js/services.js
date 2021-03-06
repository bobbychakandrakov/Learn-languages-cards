angular.module('app.services', [])

.factory('ThemeFactory', [function() {

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

.service('BlankService', [function() {

}]);
