window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("country")
    if (country == null) {
        document.getElementById("selectedCountry").innerText = "Loading, please wait..."
    } else {
        document.getElementById("selectedCountry").innerText = "Selected country: " + country
    }


    fetch("https://vpngate-api.vercel.app/api/servers" + window.location.search)
        .then((resp) => resp.json()) // Transform the data into json
        .then((response) => {
            if (response.success) {
                if (country == null) {
                    document.getElementById("selectedCountry").classList.add("hidden")
                }

                document.getElementById("title").classList.add("loaded")
                document.getElementById("selectedCountry").classList.add("loaded")
                document.getElementById("loader").classList.add("hiddenLoader")

                setTimeout(() => {
                    document.getElementById("title").classList.add("done")
                    setTimeout(() => {
                        document.getElementById("loader").style.display = "none";
                        document.getElementById("serversList").classList.add("loaded")
                    }, 300)
                }, 1000)

                let data = response.data


                for (element in data) {
                    var newServerElement = document.createElement("server")

                    var newCountryElement = document.createElement("country")
                    var newServerNameElement = document.createElement("serverName")
                    var newNoSessionsElement = document.createElement("numberOfSessions")
                    var newOperatorElement = document.createElement("operator")
                    var newPingElement = document.createElement("ping")
                    var newIpElement = document.createElement("ip")
                    var newLogTypeElement = document.createElement("logType")
                    var newSpeedElement = document.createElement("speed")
                    var newScoreElement = document.createElement("score")

                    newServerNameElement.innerText = data[element]["name"]
                    newNoSessionsElement.innerText = data[element]["numberOfSessions"] + " Sessions"
                    newOperatorElement.innerText = "by " + data[element]["operator"]
                    newPingElement.innerText = data[element]["ping"] + "ms"
                    newIpElement.innerText = data[element]["ip"]
                    newLogTypeElement.innerText = data[element]["logType"]
                    newScoreElement.innerText = data[element]["score"]
                    newCountryElement.innerText = data[element]["countryLong"]
                    var serverSpeed = parseInt(data[element]["speed"]) / 10e6
                    newSpeedElement.innerText = String(Math.round((serverSpeed + Number.EPSILON) * 100) / 100) + 'Mbps'

                    var newServerInfoElement = document.createElement("serverInfo")
                    newServerInfoElement.appendChild(newCountryElement)
                    newServerInfoElement.appendChild(newServerNameElement)
                    newServerInfoElement.appendChild(newOperatorElement)
                    newServerElement.appendChild(newServerInfoElement)

                    var newServerDetailsElement = document.createElement("serverDetails")

                    var newServerSpeedElement = document.createElement("serverSpeed")
                    var SeparationElement = document.createElement("separation")
                    SeparationElement.innerText = " / "
                    newServerSpeedElement.appendChild(newPingElement)
                    newServerSpeedElement.appendChild(SeparationElement)
                    newServerSpeedElement.appendChild(newSpeedElement)

                    newServerDetailsElement.appendChild(newServerSpeedElement)

                    var newDownloadButton = document.createElement("button")
                    newDownloadButton.id = "downloadBtn"
                    newDownloadButton.innerText = "Download"
                    newDownloadButton.setAttribute("onclick", "downloadConfigFile('" + String(data[element]['ip']) + "')")
                    newServerDetailsElement.appendChild(newDownloadButton)


                    newServerDetailsElement.appendChild(newNoSessionsElement)
                    newServerDetailsElement.appendChild(newIpElement)

                    newServerElement.appendChild(newServerDetailsElement)

                    document.getElementById("serversList").appendChild(newServerElement)
                }
            } else {
                document.getElementById("selectedCountry").innerText = response.data.message
            }
        })
        .catch((err) => {
            document.getElementById("selectedCountry").innerText = "An error occured"
        })
}

function downloadConfigFile(serverIP) {
    window.open("https://vpngate-api.vercel.app/api/servers?download=true&server=" + String(serverIP), "_self")
}