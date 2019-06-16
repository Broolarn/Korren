angular.module('myApp').controller('chattCtrl', function($scope, $location, Mail, scopelist, Colorlist) {
    var socket = io();
    socket.on('message', addMessages)
    if (Mail.getEmail() == '') {
        $location.path('/');
        socket.removeListener('message', addMessages);
    }
    var list = scopelist.getscopelist();
    $scope.list = list;
    $scope.list.Colors = ['#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000']
    $scope.loggedinsuer = Mail.getEmail();
    $(() => {
        $("#send").click(() => {
            console.log($scope.list._id)
            sendMessage({
                name: Mail.getEmail(),
                message: $("#message").val(),
                chattroomid: $scope.list._id
            })
        })
        console.log("in send")
        getMessages()
    })

    function addMessages(message) {
        var index = list.users.indexOf(message.name)
        var namecolor = list.Colors[index];
        var $new = $(`<div class="chattentry" >
            		<h4> ${message.name} </h4>
            		<br>
            		<p>  ${message.message} </p>
            		</div>`).css({ 'color': namecolor });
        $("#messages").append($new)
    }

    function getMessages() {
        $.get('http://localhost:3000/messages?chattroomid=' + $scope.list._id, (data) => {
            data.forEach(addMessages);
        })
    }

    function sendMessage(message) {
        $.post('http://localhost:3000/messages', message)
    }
    $scope.moveback = function() {
        socket.removeListener('message', addMessages);
        $location.path('/');
    }
})