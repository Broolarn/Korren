var myModule = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngMdIcons']);

//email
myModule.factory('Mail', function() {
    var mail = {
        Email: ''
    };
    return {
        getEmail: function() {
            return mail.Email;
        },
        setEmail: function(Email) {
            mail.Email = Email;
        }
    };
});
//Colorlist
myModule.factory('Colorlist', function() {
    //"global var"
    var Colorlist = {
        colors: ['#efefef', '#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000']
    };
    return {
        getColorlist: function() {
            return Colorlist.colors;
        },
    };
});
//pickedlistdata
myModule.factory('scopelist', function() {
    var scopelist = {
        listName: '',
        tickets: new Array(),
        users: new Array(),
        _id: ''
    };
    return {
        getscopelist: function() {
            return scopelist;
        },
        setscopelist: function(newList) {
            scopelist.listName = newList.listName;
            scopelist.tickets = newList.tickets;
            scopelist.users = newList.users;
            scopelist._id = newList._id;
        }
    };
})
myModule.config(function($routeProvider) {
    console.log('configuring')
    $routeProvider
        // links the html to the index file
        .when('/', {
            templateUrl: '/App/login.html',
            controller: 'LoginCtrl'
        }).when('/board', {
            templateUrl: '/App/board_page.html',
            controller: 'BoardPageCtrl',
        }).when('/chatt', {
            templateUrl: '/App/chatt.html',
            controller: 'chattCtrl',
        }).otherwise({
            redirectTo: '/'
        });
})