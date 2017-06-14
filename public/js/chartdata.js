var ctx;
var chart;

window.onload = function() {
    ctx = document.getElementById('chartcanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: function() { 
                var labels = [];
                for (var i = 0; i < sentimentData.length; i++) {
                    labels.push(i);
                }
                return labels;
            }(),
            datasets: [{
                label: 'Tweet sentiment',
                backgroundColor: `rgb(${sentimentTextColor},${sentimentTextColor},${sentimentTextColor})`,
                borderColor: `rgb(${sentimentTextColor},${sentimentTextColor},${sentimentTextColor})`,
                borderWidth: 2,
                data: sentimentData,
                fill: false,
                pointRadius: 0,
            }],
        },
        options: {
            legend: {
                display: false,
                labels: {
                    display: false,
                },
            },
            elements: {
                line: {
                    tension: 0,
                },
            },
            scales: {
                xAxes: [{
                    display: false,
                }],
                yAxes: [{
                    beginAtZero: true,
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        fontColor: `rgb(${sentimentTextColor},${sentimentTextColor},${sentimentTextColor})`,
                        min: maxTick,
                        max: -maxTick,
                    },
                }],
            },
        },
    });
}

