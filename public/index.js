let countries = [];
let summary;
let date;
let country;

let settings = {
    "url": "https://api.covid19api.com/summary",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    summary = response;
    date = summary.date;

    globalCases = summary.Global.TotalConfirmed;
    globalDeaths = summary.Global.TotalDeaths;
    date = summary.Date;
    document.querySelector("#date").innerHTML = "Last updated on " + new Date(date);
    document.querySelector("#global-cases").innerHTML += globalCases.toLocaleString();
    document.querySelector("#global-deaths").innerHTML += globalDeaths.toLocaleString();

    for (let i = 0; i < summary.Countries.length; i++) {
        countries.push([summary.Countries[i].Country, i, summary.Countries[i].Slug]);
    }
    countries.sort();
    for (let i = 0; i < countries.length; i++) {
        document.querySelector("#dropdown").innerHTML += `<option name="${countries[i][2]}" value="${countries[i][1]}">${countries[i][0]}</option>`;
    }
    getCountryData();
    countryGraphMaker();
    graphData = [];
    for (let i = 0; i < summary.Countries.length; i++) {
        graphData.push([summary.Countries[i].Country, summary.Countries[i].TotalConfirmed]);
    }
    JSC.Chart("chartDiv1", {
        type: 'column',
        series: [
            {
                points: graphData
            }
        ]
    });
});

document.querySelector("#country-submit").addEventListener("click", function () {
    getCountryData();
    countryGraphMaker();
})

function countryGraphMaker() {
    country = document.querySelector("#dropdown").value;
    countrySlug = summary.Countries[country].Slug;
    var settings = {
        "url": "https://api.covid19api.com/country/" + countrySlug + "/status/confirmed",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        graphData = [];
        for (let i = 0; i < response.length; i++) {
            graphData.push([new Date(response[i].Date), response[i].Cases]);
        }
        JSC.Chart("chartDiv2", {
            type: 'column',
            xAxis: {
                label_text: 'Time'
            },
            yAxis: {
                label_text: 'Cases'
            },
            series: [
                {
                    points: graphData
                }
            ]
        });
    });
}

function getCountryData() {
    country = document.querySelector("#dropdown").value;
    countryCases = summary.Countries[country].TotalConfirmed;
    countryDeaths = summary.Countries[country].TotalDeaths;
    document.querySelector("#country-title").innerHTML = summary.Countries[country].Country;
    document.querySelector("#country-cases").innerHTML = "Confirmed Cases in " + summary.Countries[country].Country + ": " + countryCases.toLocaleString();
    document.querySelector("#country-deaths").innerHTML = "Confirmed Deaths in " + summary.Countries[country].Country + ": " + countryDeaths.toLocaleString();
}