angular.module('app.services', [])

.factory('ThemeFactory', ['$http', function($http) {
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
    },
    saveWord: function(data) {
      console.log(data);
      return $http({
        method: 'POST',
        url: url + '/api/word',
        data: data
      });
      // return $http.post(url + '/api/word', fd);
    }
  };
}])

.factory('WordsFactory', [function() {

  var words = [{
    en: 'Dog',
    bg: 'Куче',
    image: 'img/dog.jpg'
  }, {
    en: 'Cat',
    bg: 'Котка',
    image: 'img/cat.jpg'
  }, {
    en: 'Guitar',
    bg: 'Китара',
    image: 'img/guitar.jpg'
  }, {
    en: 'Coffee',
    bg: 'Кафе',
    image: 'img/coffee.png'
  }, {
    en: 'Laughing',
    bg: 'Смея се',
    image: 'img/laughting.png'
  }];
  return {
    getWords: function() {
      return words;
    }
  };
}])

.service('BlankService', [function() {

}]);
