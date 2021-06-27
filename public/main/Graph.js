class Graph {
    constructor() {
        this.canvas = document.getElementById("graph").getContext("2d")
        this.graph = new Chart(this.canvas, {
            type: "line",
            data: {
                datasets: [{
                    label: "ONS Value",
                    data: [],
                    borderColor: [
                        "#ff0000",
                    ],
                    borderWidth: 1
                }, {
                    label: "Comparison Value",
                    data: [],
                    borderColor: [
                        "#00ff37",
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                lineTension: 0.4,
                aspectRatio: 2
            }
        })
    }
    getGraph() {
        return this.graph
    }
    getCanvas() {
        return this.canvas
    }
}