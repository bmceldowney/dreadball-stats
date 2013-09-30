angular.module('directives').directive('pieChart', function () {
    return {
        scope: {
            data: '=gameData',
            options: '=options',

        },
        link: function (scope, element, attr) {
            var isInitialized = false
              , pie
              , arc
              , legends
              , legendColors
              , legendSpans
              , svg
              , path
              , width
              , radius
              , name;

            function init(data) {
                name = scope.data && scope.data.name;
                width = scope.options.width || 100;
                radius = width / 2;
                pie = d3.layout.pie()
                .value(function (d) { return d.value; })
                .sort(null);

                arc = d3.svg.arc()
                .outerRadius(radius - 20);

                if (name) {
                    d3.select(element[0]).append("div")
                        .text(name)
                        .style('text-align', 'center')
                        .style('margin-bottom', '-15px');
                }

                svg = d3.select(element[0]).append("svg")
                       .attr("width", width)
                       .attr("height", width)
                   .append("g")
                       .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");

                path = svg.datum(data).selectAll("path")
                    .data(pie)
                  .enter().append("path")
                    .attr("d", arc)
                    .each(function (d) {
                        this._current = d;
                    }); // store the initial angles

                legends = $(document.createElement('div'));
                data.forEach(function (item) {
                    $(document.createElement('div'))
                        .attr('class', 'legend-color ' + item.label)
                        .appendTo(legends);

                    $(document.createElement('span'))
                        .attr('class', 'legend-span')
                        .text(item.label)
                        .appendTo(legends);

                })

                element.tooltip({
                    items: 'svg',
                    content: legends[0].outerHTML,
                    track: true
                });

                isInitialized = true;
            }

            scope.$watch('data', function (newValue) {
                if (!newValue) return;
                data = newValue.data;

                if (!isInitialized) init(data);

                pie.value(function (d, i) {
                    return data[i].value;
                }); // change the value function
                path = path.data(pie); // compute the new angles
                path.attr('class', function (d, i) { return data[i].label })
                path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
            });

            function type(d) {
                d.apples = +d.apples;
                d.oranges = +d.oranges;
                return d;
            }

            // Store the displayed angles in _current.
            // Then, interpolate from _current to the new angles.
            // During the transition, _current is updated in-place by d3.interpolate.
            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
                };
            }
        }
    }
});

angular.module('directives').directive('segmentedBarChart', function () {
    return {
        scope: {
            data: '=segmentedBarChart',
            selectedMatchup: '=selectedMatchup'
        },
        link: function (scope, element, attr) {
            var fauxData = {
                won: "won".split(''),
                lost: "lost".split(''),
                draw: "draw".split(''),
                total: 'total'.split('')
            }
            var scale;
            var data = [
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData },
                { team: "nulltown rats", data: fauxData }
            ];

            var chart = d3.select(element[0]).append("div")
                .attr("class", "chart");

            var containers = chart.selectAll(".chart")
                .data(data)
                .enter().append("div")
                    .attr("class", "container")
                    .on('click', function (d, i) {
                        scope.selectedMatchup = d;
                        scope.$apply();

                        var elementToSelect = element.children('.chart').children()[i];
                        elementToSelect && elementToSelect.classList.add('selected')
                    });

            containers
                .append("div")
                    .attr("class", "label")
                    .text(function (d, a, i) { return data[i].team; });

            containers
                .append("div")
                    .attr("class", "wonBar")
                    .style("width", barWidth('won'))
                    .style("padding", barPadding('won'))
                    .text(function (d, a, i) {
                        return data[i].data.won.length;
                    });

            containers
                .append("div")
                    .attr("class", "lostBar")
                    .style("width", barWidth('lost'))
                    .style("padding", barPadding('lost'))
                    .text(function (d, a, i) {
                        return data[i].data.lost.length;
                    });

            containers
                .append("div")
                    .attr("class", "drawBar")
                    .style("width", barWidth('draw'))
                    .style("padding", barPadding('draw'))
                    .text(function (d, a, i) {
                        return data[i].data.draw.length;
                    });

            scope.$watch('selectedMatchup', updateSelected);
            scope.$watch('data', update);

            function updateSelected(newValue) {
                var selectedElement = element.children('.chart').children('.selected');
                selectedElement && selectedElement.removeClass('selected')

                if (!newValue) return;
            }

            function update(newValue) {
                if (!newValue) return;

                scope.selectedMatchup = null;
                data = newValue;
                var max = Math.max.apply(Math, data.map(function (item) { return item.data.total.length }));
                scale = d3.scale.linear()
                    .domain([0, max])
                    .range([5, 500]);

                //chart.selectAll(".chart")
                containers = containers.data(data)

                containers.style('display', function (d, a, i) {
                    var display = data[a].data.total.length ? 'block' : 'none';
                    return display;
                });

                containers.selectAll('.label')
                    .transition()
                        .text(function (d, a, i) {
                            return data[i].team;
                        });

                containers.selectAll('.wonBar')
                    .transition()
                    .style("width", barWidth('won'))
                    .style("padding", barPadding('won'))
                    .text(function (d, a, i) {
                        return data[i].data.won.length || '';
                    });

                containers.selectAll('.lostBar')
                    .transition()
                    .style("width", barWidth('lost'))
                    .style("padding", barPadding('lost'))
                    .text(function (d, a, i) {
                        return data[i].data.lost.length || '';
                    });

                containers.selectAll('.drawBar')
                    .transition()
                    .style("width", barWidth('draw'))
                    .style("padding", barPadding('draw'))
                    .text(function (d, a, i) {
                        return data[i].data.draw.length || '';
                    });

            }

            function barPadding(propertyName) {
                return function (d, a, i) {
                    if (!scale || !data[i].data[propertyName].length) return 0;
                    return "3px";
                }
            }

            function barWidth(propertyName) {
                return function (d, a, i) {
                    if (!scale || !data[i].data[propertyName].length) return 0;
                    return scale(data[i].data[propertyName].length) + "px";
                }
            }
        }
    }
})
