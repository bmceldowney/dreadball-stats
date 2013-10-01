angular.module('services', []);

angular.module('services').service('filterService', function () {
    var retval = {};
    var categories = 'all official season1 season2 season3 house'.split(' ');
    var filters = [];

    retval.setFilter = function (filterName) {

    }

    retval.filterNames = categories;

    return retval;
});

angular.module('services').service('dataService', function ($http) {
    var retval = {};
    var teams = 'veermyn orxgoblins corporation robot zzor female judwan forgefathers asterians nameless teratons zees'.split(' ').sort();
    var data;
    var emptyMatchup = {
        lost: [],
        won: [],
        draw: [],
        total: []
    }

    retval.getData = function (cb) {
        $http.get('games').success(function (results) {
            data = results;
            cb();
        }).error(function (results) {

        });
    }

    retval.teams = teams;

    retval.getMatchData = function (team) {
        var retval = [];
        teams.forEach(function (item) {
            var wlData = {};
            wlData.team = item;

            if (item === team) {
                wlData.data = Object.create(emptyMatchup);
            } else {
                wlData.data = getWinLossData(team, item, data);
            }

            retval.push(wlData);
        });

        return retval;
    }

    retval.getCoachData = function () {
        var coaches = Object.create(null);
        var coachGames = data.filter(function (item) { return item.homecoach || item.viscoach })
        coachGames.forEach(function (item) {
            var coach;
            if (item.homecoach) {
                addCoachData('home', item);
            }

            if (item.viscoach) {
                addCoachData('vis', item);
            }

            function addCoachData(team, matchData) {
                coach = item[team + 'coach']
                if (!coaches[coach]) {
                    coaches[coach] = {};
                    coaches[coach].matches = [];
                }

                coaches[coach].matches.push(matchData)
            }
        });

        return coaches;
    }

    function getWinLossData(team, vsTeam, data) {
        var teamGames = data.filter(function (item) { return (item.hometeam === team || item.visitorsteam === team) && item.valid && item.rulesversion !== 'house' });
        var vsTeamGames = teamGames.filter(function (item) { return (item.hometeam === vsTeam && item.visitorsteam === team) || (item.visitorsteam === vsTeam && item.hometeam === team) });
        return buildTotalChart(team, vsTeam, vsTeamGames);
    }

    function buildTotalChart(team, vsTeam, games) {
        var retval = Object.create(emptyMatchup);
        var headerText = team + " v. " + vsTeam;
        var totalWinScore;
        var totalLossScore;

        retval.name = headerText;

        if (!games) return retval;

        retval.total = games;
        retval.won = games.filter(function (item) { return item.teamwon === team });
        retval.lost = games.filter(function (item) { return item.teamlost === team });
        retval.draw = games.filter(function (item) { return item.teamlost === 'draw' });
        retval.home = games.filter(function (item) { return item.hometeam === team });
        retval.away = games.filter(function (item) { return item.visitorsteam === team });
        retval.avgWinScore = 0;
        retval.avgLossScore = 0;

        if (retval.won.length) {
            totalWinScore = extractScore(retval.won);
            retval.avgWinScore = Math.floor((totalWinScore / retval.won.length) * 1000) / 1000;
        }

        if (retval.lost.length) {
            totalLossScore = extractScore(retval.lost);
            retval.avgLossScore = Math.floor((totalLossScore / retval.lost.length) * 1000) / 1000;
        }

        function extractScore(array) {
            return array.map(function (item) { return item.finalscore })
               .reduce(function (prev, next) { return Number(prev) + Number(next) })
        }

        return retval;
    }

    return retval;
});
