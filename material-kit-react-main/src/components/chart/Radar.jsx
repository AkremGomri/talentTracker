/* eslint-disable */

import React from 'react';
import ReactApexChart from "react-apexcharts";

function getChartColorsArray(colors) {
    colors = JSON.parse(colors);
    return colors.map(function (value) {
        var newValue = value.replace(" ", "");
        if (newValue.indexOf(",") === -1) {
            var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
            if (color.indexOf("#") !== -1)
                color = color.replace(" ", "");
            if (color) return color;
            else return newValue;
        } else {
            var val = value.split(',');
            if (val.length === 2) {
                var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
  }

const SimpleRadar = ({dataColors, categories, names, data}) => {
    var chartRadarBasicColors = getChartColorsArray(dataColors);
    const series = data.map((data, index) => {
        return {
            name: names[index],
            data: data
    }});
    var options = {
        
        chart: {
            height: 350,
            type: 'radar',
            toolbar: {
                show: false
            }
        },
        colors: ["#3d9ff5"],
        xaxis: {
            categories: categories
        }
    };
  return (
    <ReactApexChart
            series={series}
            options={options}
            type="radar"
            height={365}
        />
  )
}

const MultipleRadar = ({dataColors, names, data}) => {
    var chartRadarMultiColors = getChartColorsArray(dataColors);

    const series = data.map((data, index) => {
        return {
            name: names[index],
            data: data
    }});
//     const series= [{
//         name: 'Series 1',
//         data: [80, 50, 30, 40, 100, 20],
//     },
//     {
//         name: 'Series 2',
//         data: [20, 30, 40, 80, 20, 80],
//     },
//     {
//         name: 'Series 3',
//         data: [44, 76, 78, 13, 43, 10],
//     }
// ]
    var options = {        
        chart: {
            height: 350,
            type: 'radar',
            dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1
            },
            toolbar: {
                show: false
            },
        },
        stroke: {
            width: 2
        },
        fill: {
            opacity: 0.2
        },
        markers: {
            size: 0
        },
        colors: chartRadarMultiColors,
        xaxis: {
            categories: ['2014', '2015', '2016', '2017', '2018', '2019']
        }
    };
  return (
    <ReactApexChart
            series={series}
            options={options}
            type="radar"
            height={365}
        />
  )
}

const PolygonRadar = ({dataColors}) => {
    var chartRadarPolyradarColors = getChartColorsArray(dataColors);
    const series = [{
        name: 'Series 1',
        data: [20, 100, 40, 30, 50, 80, 33],
    }]
    var options = {
        chart: {
            height: 350,
            type: 'radar',
            toolbar: {
                show: false
            },
        },
        dataLabels: {
            enabled: true
        },
        plotOptions: {
            radar: {
                size: 140,
    
            }
        },
        title: {
            text: 'Radar with Polygon Fill',
            style: {
                fontWeight: 500,
            },
        },
        colors: chartRadarPolyradarColors,
        markers: {
            size: 4,
            colors: ['#fff'],
            strokeColor: '#f34e4e',
            strokeWidth: 2,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val
                }
            }
        },
        xaxis: {
            categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        yaxis: {
            tickAmount: 7,
            labels: {
                formatter: function (val, i) {
                    if (i % 2 === 0) {
                        return val
                    } else {
                        return ''
                    }
                }
            }
        }
    };
  return (
    <ReactApexChart
            series={series}
            options={options}
            type="radar"
            height={365}
        />
  )
}

export {SimpleRadar,MultipleRadar,PolygonRadar}