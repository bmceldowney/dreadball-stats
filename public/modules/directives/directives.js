angular.module('directives', ['services']);

angular.module('directives').directive('filterSelector', ['filterService', function (filterService) {
    return {
        templateUrl: 'templates/filterSelector.html',
        scope: {
            filters: '=filters',
            filterChanged: '&filterChanged'
        },
        link: function (scope, element, attr) {
            element.attr('id', 'filterButtons').css('font-size', '.8em');

            scope.$watch('filters', function (newValue) {
                if (!newValue) return;

                newValue.forEach(function (item) {
                    var input = $(document.createElement('input'));
                    input.attr('id', item)
                        .attr('type', 'checkbox')
                         //.attr('name', 'radio')
                        .on('click', function (e) {
                            filterService.setFilter(this.id);
                        });

                    var label = $(document.createElement('label'))

                    label.attr('for', item)
                        .text(item);

                    element.append(input);
                    element.append(label);
                });

                $('#filterButtons').buttonset();
            })
        }
    };
}]);

angular.module('directives').directive('matchupDetails', function () {
    return {
        templateUrl: 'templates/matchupDetails.html',
        scope: {
            details: '=matchupDetails'
        },
        link: function (scope, element, attr) {
            scope.$watch('details', function (newValue) {
                if (!newValue) return;

                scope.homeAwayOptions = { width: 100 };
                scope.homeAwayData = { name: 'match location' };
                scope.homeAwayData.data = [
                {
                    label: 'home',
                    value: newValue.data.home.length
                }, {
                    label: 'away',
                    value: newValue.data.away.length
                }]

                scope.winLossOptions = { width: 100 };
                scope.winLossData = { name: 'win record' };
                scope.winLossData.data = [{
                    label: 'wins',
                    value: scope.details.data.won.length
                }, {
                    label: 'losses',
                    value: scope.details.data.lost.length
                }, {
                    label: 'draws',
                    value: scope.details.data.draw.length
                },
                ]

                scope.winPercentage = Math.floor((scope.details.data.won.length / scope.details.data.total.length) * 1000) / 10 + '%';
                scope.losePercentage = Math.ceil((scope.details.data.lost.length / scope.details.data.total.length) * 1000) / 10 + '%';
                scope.drawPercentage = Math.floor((scope.details.data.draw.length / scope.details.data.total.length) * 1000) / 10 + '%';
            });
        }
    }
});

angular.module('directives').directive('teamSelector', function () {
    return {
        scope: {
            teams: '=teamSelector',
            selectedTeam: '=selectedTeam'
        },
        link: function (scope, element, attr) {
            element.attr('id', 'radio').css('font-size', '.8em');

            scope.$watch('teams', function (newValue) {
                if (!newValue) return;

                newValue.forEach(function (item) {
                    var input = $(document.createElement('input'));
                    input.attr('id', item)
                          .attr('type', 'radio')
                          .attr('name', 'radio')
                        .on('click', function (e) {
                            scope.selectedTeam = this.id;
                            scope.$apply();
                        });

                    var label = $(document.createElement('label'))

                    label.attr('for', item)
                        .text(item);

                    element.append(input);
                    element.append(label);
                });

                $('#radio').buttonset();

                scope.$watch('selectedTeam', function (newValue) {
                    if (!newValue) return;

                    $('#' + newValue).attr('checked', 'checked').button('refresh');
                });
            })
        }
    };
})
