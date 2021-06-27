function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }

graph = new Graph()
graph.getGraph().data.datasets[0].data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
graph.getGraph().update()

function make_option(value) {
    let o = document.createElement("option")
    o.innerText = `${value}%`
    o.style.fontSize = "15px"
    return o
}

function make_default_option(value) {
    let o = document.createElement("option")
    o.selected = "selected"
    o.innerText = `${value}%`
    o.style.fontSize = "15px"
    return o
}

const [ons_values, compare_values] = [document.getElementById("onsperc-input"), document.getElementById("comperc-input")]
const default_percentage = 7.04
for (let i = 1 ; i <= 20 ; i ++) {
    if (i === Math.ceil(default_percentage)) {
        ons_values.appendChild(make_default_option(default_percentage))
        compare_values.appendChild(make_default_option(default_percentage))
    }
    ons_values.appendChild(make_option(i))
    compare_values.appendChild(make_option(i))
}
var label_list = []
for (let i = 0 ; i <= 30 ; i ++) {
    label_list.push(i + " Y")
}
graph.getGraph().data.labels = label_list

function get_value_fromids(id) {
    let new_id = []
    id.forEach((x) => {new_id.push(document.getElementById(x).value)})
    return new_id
}

function update_info() {
    const amount = document.getElementById("premium-input").value
    if (amount !== "") {
        document.getElementById("amount-info").innerText = `Selected value: ${numberWithCommas(amount * 1)}, Annual value: ${numberWithCommas(amount * 12)}`
    }
}

function compound(premium, percentage, rate) {
    let data =[]
    if (rate < 0) { return false }
    for (let i = 0 ; i <= rate ; i ++) {
        data.push(premium * ((1 + percentage) ** i))
    }
    return data
}

var cached_amount, cached_ons_value, cached_comp_value

function calculate() {
    const [amount, ons_value, comp_value] = get_value_fromids(["premium-input", "onsperc-input", "comperc-input"])
    if (amount !== cached_amount || ons_value !== cached_ons_value || comp_value !== cached_comp_value) {
        update_graph()

        update_table()

        cached_amount = amount
        cached_ons_value = ons_value
        cached_comp_value = comp_value
    }
}

function update_graph() {
    const [amount, ons_value, comp_value] = get_value_fromids(["premium-input", "onsperc-input", "comperc-input"])
    graph.getGraph().data.datasets[0].data = compound(amount * 12, ons_value.replace("%", "") / 100, 30)
    graph.getGraph().data.datasets[1].data = compound(amount * 12, comp_value.replace("%", "") / 100, 30)
    graph.getGraph().update()
}
update_graph()

const table = document.getElementById("data-table")

function make_head(data) {
    let row = document.createElement("tr")
    for (let d = 0 ; d < data.length ; d ++) {
        let cell = document.createElement("th")
        cell.innerHTML = data[d]
        cell.className = "head"
        row.appendChild(cell)
    }
    return row
}

function make_cell(data, background_color="#ffffff") {
    let cell = document.createElement("td")
    cell.innerHTML = data
    cell.className = "cell"
    cell.style.backgroundColor = background_color
    cell.on
    return cell
}

function calculate_table(amount, ons_value, comp_value, year) {
    let years = []
    for (let y = 0 ; y <= year ; y ++) {
        years.push(make_cell(`${y} #`, "#acc4c7"))
    }
    let mes = compound(amount, comp_value, year).map((d) => {return make_cell(`&pound${numberWithCommas(d.toFixed(2))}`)})
    let oec = compound(amount * 12, ons_value, year).map((d) => {return make_cell(`&pound${numberWithCommas(Math.round(d))}`, "#acc4c7")})
    let coec = compound(amount * 12, comp_value, year)
    let cuec = []
    let cumulative = 0
    coec.forEach((price) => {
        cumulative += parseFloat(price)
        cuec.push(make_cell((`&pound${numberWithCommas(Math.round(cumulative))}`), "#acc4c7"))
    })
    coec = coec.map((d) => {return make_cell(`&pound${numberWithCommas(Math.round(d))}`)})
    let table_data = []
    for (let row = 0 ; row <= year ; row ++) {
        let r = document.createElement("tr")
        r.appendChild(years[row])
        r.appendChild(mes[row])
        r.appendChild(oec[row])
        r.appendChild(coec[row])
        r.appendChild(cuec[row])
        r.onmouseenter = () => {
            for (let child = 0 ; child < r.children.length ; child ++) {
                r.children[child].style.backgroundColor = "#ff5454"
            }
        }
        r.onmouseleave = () => {
            let alternating = true
            for (let child = 0 ; child < r.children.length ; child ++) {
                if (alternating) {
                    r.children[child].style.backgroundColor = "#acc4c7"
                    alternating = false
                } else {
                    r.children[child].style.backgroundColor = "#ffffff"
                    alternating = true
                }
            }
        }
        table_data.push(r)
    }
    return table_data
}

function update_table() {
    document.getElementById("data-table").remove()
    var table = document.createElement("table")
    table.id = "data-table"
    document.getElementById("container").appendChild(table)
    const [amount, ons_value, comp_value] = get_value_fromids(["premium-input", "onsperc-input", "comperc-input"])
    var table_array = []
    table.appendChild(make_head(["Year", "Monthly Energy Spend", "ONS Energy Cost", "Comparison Energy Cost", "Cumulative Energy Cost"]))
    calculate_table(amount, ons_value.replace("%", "") / 100, comp_value.replace("%", "") / 100, 30)
        .forEach((row) => {table.appendChild(row)})
}

update_info()
update_table()