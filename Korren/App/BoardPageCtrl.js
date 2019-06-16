angular.module('myApp').controller('BoardPageCtrl', function($scope, $location, Mail, scopelist, Colorlist) {
    var socketupdate = io();
    var socketremove = io();
    socketupdate.on('update', function(update) {
        updatehelpfunc(update)
    })
    socketremove.on('removed', function(removelist) {

        removehelpfunc(removelist);
    })
    if (Mail.getEmail() == '') {
        $location.path('/'); // path not hash
        socketupdate.removeListener('update')
        socketremove.removeListener('removed')
    }
    $scope.lists = [];
    var d = new Date();
    var currYearnMonthnDay = d.getFullYear() + ',' + d.getMonth() + ',' + d.getDate()
    $scope.Colors = ['#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000'];
    getList($scope);
    $scope.movetochatt = function(newList) {
        scopelist.setscopelist(newList);
        $location.path('/chatt');
    }
    $scope.addList = function() {
        var email = Mail.getEmail();
        var stringlist = new Array();
        stringlist.push({
            title: [""]
        })
        ticketiconcolor = new Array();
        ticketiconcolor.push(
            Colorlist.getColorlist()[0])
        var newList = {
            listName: "new list",
            tickets: stringlist,
            users: [Mail.getEmail()],
            userticketcolor: ticketiconcolor,
            Colors: ['#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000'],
            YearnMonthnDay: currYearnMonthnDay
        }
        $scope.lists[$scope.lists.length - 1];
        var result = $.post('http://localhost:3000/Chores', newList).then(function(res) {

            $scope.lists.push({
                listName: res.listName,
                tickets: stringlist,
                users: res.users,
                _id: res._id,
                userticketcolor: res.userticketcolor,
                Colors: ['#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000'],
                YearnMonthnDay: res.YearnMonthnDay
            })
            $scope.$applyAsync();
        })
    }
    $scope.addTicket = function(list) {
        list.tickets.push({
            title: ""
        })
        list.userticketcolor.push(
            Colorlist.getColorlist()[0]
        )
        $.post('http://localhost:3000/Update', list)
    }
    $scope.removeTicket = function(list, removeticket) {
        for (var i = 0; i < $scope.lists.length; i++) {
            if ($scope.lists[i]._id == list._id) {
                list.tickets.splice(list.tickets.indexOf(removeticket), 1);
                list.userticketcolor.splice(list.tickets.indexOf(removeticket), 1)
                if (list.tickets.length < 1) {} else {
                    $.post('http://localhost:3000/Update', list)
                }
                break;
            }
        }
    }
    $scope.removeList = function(list) {
        var i
        for (i = 0; i < $scope.lists.length; i++) {
            if ($scope.lists[i]._id == list._id) {
                $scope.lists.splice(i, 1);
                $.post('http://localhost:3000/Delete', list)
            }
        }
    }
    $scope.updateUsers = function(newList, user2remove) {
        if (newList.users.length > 1) {
            newList.users.splice(newList.users.indexOf(user2remove), 1);
            if (user2remove == Mail.getEmail()) {
                for (i = 0; i < $scope.lists.length; i++) {
                    if ($scope.lists[i]._id == newList._id) {
                        $scope.lists.splice(i, 1);
                    }
                }
            }
            $.post('http://localhost:3000/Update', newList)
        } else {
            $.post('http://localhost:3000/Delete', newList)
        }
    }
    $scope.updateName = function(newList) {
        updatelist = newList;
        $.post('http://localhost:3000/Update', updatelist)
    }
    $scope.addUser = function(newList) {

        if (!newList.users.includes(newList.newPerson)) {

            if (newList.newPerson != undefined && newList.newPerson.length > 5) {
                newList.users.push(newList.newPerson)

                $.post('http://localhost:3000/Update', newList)
            }
        }
    }
    $scope.updateTickets = function(newList) {
        var stringlist = new Array();
        if (newList.tickets[0].title) {
            newList.tickets.forEach(function(entry) {
                stringlist.push(
                    entry.title);
            });
        } else {
            newList.tickets.forEach(function(entry) {
                stringlist.push(entry);
            });
        }
        updatelist = newList;
        $.post('http://localhost:3000/Update', updatelist)
    }
    $scope.changeassigneduser = function(newList, ticketindex) {
        var colorsfromColorlist = Colorlist.getColorlist();
        var currentcolor = newList.userticketcolor[ticketindex];

        var currcolorindex = colorsfromColorlist.indexOf(currentcolor);
        if (currcolorindex < colorsfromColorlist.length - 1) {
            currcolorindex = currcolorindex + 1;
        } else {
            currcolorindex = 0
        }
        newList.userticketcolor[ticketindex] = colorsfromColorlist[currcolorindex]
        $.post('http://localhost:3000/Update', newList)
        return newList.userticketcolor[ticketindex];
    }
    $scope.nextweek = function(List) {
        var nrofcolors = List.Colors.length;
        var ticketiconcolorindex = 0;
        var currentcolor;
        var currcolorindex;
        var colorsfromColorlist = Colorlist.getColorlist();
        for (var i = 0; i < List.tickets.length; i++) {
            currentcolor = List.userticketcolor[i];
            currcolorindex = colorsfromColorlist.indexOf(currentcolor);
            if (currcolorindex < colorsfromColorlist.length - 1) {
                currcolorindex = currcolorindex + 1;
            } else {
                currcolorindex = 0
            }
            List.userticketcolor[i] = colorsfromColorlist[currcolorindex]
        }
        $.post('http://localhost:3000/Update', List)
    }

    function addLists(CList, $scope) {
        var stringlist = [];
        CList.tickets.forEach(function(entry) {
            stringlist.push({
                title: entry
            });
        });
        ticketiconcolor = [];
        CList.userticketcolor.forEach(function(entry) {
            ticketiconcolor.push(
                entry);
        });
        var comparedates = CList.YearnMonthnDay.split(',');
        ClistDate = new Date(comparedates[0], comparedates[1], comparedates[2])
        currdate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        var diff = Math.abs(((ClistDate - currdate) / 86400000)) // 86400000 = 24*60*60*1000

        if (diff > 7) {
            CList.Colors = ['#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000']
            CList.YearnMonthnDay = currYearnMonthnDay
            $scope.nextweek(CList)
        }
        $scope.$apply($scope.lists.push({
            listName: CList.listName,
            tickets: stringlist,
            _id: CList._id,
            users: CList.users,
            userticketcolor: ticketiconcolor,
            Colors: ['#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000'],
            YearnMonthnDay: CList.YearnMonthnDay
        }))
    }

    function getList($scope) {
        if (Mail.getEmail() != '') {
            //console.log("get rooms for: " + Mail.getEmail())
        }
        $.get('http://localhost:3000/Chores?Email=' + Mail.getEmail(), (data) => {
            if (data.length >= 1) {
                data.forEach(function(i) {
                    addLists(i, $scope);
                });
            }
        })
    }

    function removeFunc(List) {
        $.post('http://localhost:3000/Delete', List)
    }

    function updatehelpfunc(update) {

        stringlist = new Array();
        update.tickets.forEach(function(entry) {
            stringlist.push({ title: entry });
        });
        update.Colors = ['#00d8d8', '#ff00cc', '#8400ff', '#f9da09', '#ff8902', '#000000']
        update.tickets = stringlist;
        var tempmeil = Mail.getEmail();
        var _ids = [];
        for (var i = 0; i < $scope.lists.length; i++) {
            _ids.push($scope.lists[i]._id);
        }
        if (!_ids.includes(update._id) && update.users.includes(tempmeil)) {
            $scope.lists.push(update);
        }
        for (var i = 0; i < $scope.lists.length; i++) {
            if (update._id == $scope.lists[i]._id) {
                var keep = false;
                if ($scope.lists[i].users.includes(tempmeil)) {
                    keep = true;
                }
                if (keep == true) {
                    $scope.lists[i] = update;
                } else {
                    $scope.lists.splice(i, 1);
                }
                break;
            } else {
                needtoadd = true;
            }
        }
        $scope.$applyAsync();
    }

    function removehelpfunc(remove) {
        for (var i = 0; i < $scope.lists.length; i++) {
            if (remove._id == $scope.lists[i]._id) {
                $scope.lists.splice(i, 1);
                break;
            }
        }
        $scope.$applyAsync();
    }
})