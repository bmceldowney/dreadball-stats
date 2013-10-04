angular.module('app', ['directives', 'services']);

angular.module('app').controller('MainCtrl', ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {

    dataService.getData(dataRetrieved);

    function dataRetrieved() {
        /// <param name="result" type="Array" value="new Array(new Game())">The games played</param>
        $scope.teams = dataService.teams;
        $scope.selectedTeam = $scope.teams[0];
        $scope.winLossData = dataService.getMatchData($scope.selectedTeam);
        $scope.coachData = dataService.getCoachData();
        $scope.selectedMatchup = null;

        $scope.filters = filterService.filterNames;

        setTotals();

        $scope.filterChanged = function (filterName) {
            switch (filterName) {
                case 'all':
                    break;

            }
        }

        //$scope.$watch('filters', function (newValue, oldValue) {
        //    if (!newValue) return;

        //    if (newValue) {

        //    }

        //}, true)

        //$('#filterButton').button();
        //$('#filterDialog').dialog({
        //    draggable: false,
        //    dialogClass: "no-title",
        //    width: 100,
        //    autoOpen: false,
        //    position: { my: "right top", at: "right bottom", of: $('#filterButtonLabel') }
        //});

        //$scope.showFilters = function () {
        //    if ($('#filterDialog').dialog('isOpen')) {
        //        $('#filterDialog').dialog('close')
        //    } else {
        //        $('#filterDialog').dialog('open')
        //    }
        //}

        $scope.$watch('selectedTeam', function (newValue) {
            if (!newValue) return;

            $scope.winLossData = dataService.getMatchData(newValue);

            setTotals();
        })

        function setTotals() {
            $scope.winTotal = 0;
            $scope.lossTotal = 0;
            $scope.drawTotal = 0;
            $scope.totalAvgWinScore = 0;
            $scope.totalAvgLossScore = 0;


            $scope.winLossData.forEach(function (item) {
                $scope.winTotal += item.data.won.length;
                $scope.lossTotal += item.data.lost.length;
                $scope.drawTotal += item.data.draw.length;
            });

            $scope.matchTotal = $scope.winTotal + $scope.lossTotal + $scope.drawTotal;

            var matchupsWithWins = $scope.winLossData.filter(function (item) { return item.data.avgWinScore; });
            if (matchupsWithWins.length) {
                $scope.totalAvgWinScore = Math.floor((matchupsWithWins.map(function (item) { return item.data.avgWinScore; })
                    .reduce(function (prev, next) { return Number(prev) + Number(next) }) / matchupsWithWins.length) * 1000) / 1000;
            }

            var matchupsWithLosses = $scope.winLossData.filter(function (item) { return item.data.avgLossScore; });
            if (matchupsWithLosses.length) {
                $scope.totalAvgLossScore = Math.floor((matchupsWithLosses.map(function (item) { return item.data.avgLossScore; })
                    .reduce(function (prev, next) { return Number(prev) + Number(next) }) / matchupsWithLosses.length) * 1000) / 1000;
            }

            $scope.totalRecordOptions = { width: 150 };
            $scope.totalRecordData = { name: 'win record' };
            $scope.totalRecordData.data = [
                { label: 'wins', value: $scope.winTotal },
                { label: 'losses', value: $scope.lossTotal },
                { label: 'draws', value: $scope.drawTotal }
            ]
        }
    }
}]);
