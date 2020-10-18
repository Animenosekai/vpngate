window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("country")
    if (country == null) {
        document.getElementById("selectedCountry").innerText = "Loading, please wait..."
    } else {
        document.getElementById("selectedCountry").innerText = "Selected country: " + country
    }

    

    //fetch("https://animenosekai.herokuapp.com/vpngate/api/servers")
    fetch("https://animenosekai.herokuapp.com/vpngate/api/servers" + window.location.search, {
        "method": "GET",
        "headers": {
            "Anise-IgnoreBase64OpenVPN": true
        }
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {

        if (country == null) {
            document.getElementById("selectedCountry").classList.add("hidden")
        }
        
        document.getElementById("title").classList.add("loaded")
        document.getElementById("selectedCountry").classList.add("loaded")
        document.getElementById("loader").classList.add("hiddenLoader")

        setTimeout(function(){
            document.getElementById("title").classList.add("done")
                    
            setTimeout(function(){
                document.getElementById("loader").style.display = "none";
                document.getElementById("serversList").classList.add("loaded")
            }, 300)
        }, 1000)
        
        
        for (element in data) {
            if (element == 0){
                continue
            }
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
            
            newServerNameElement.innerText = data[element]["ServerName"]
            newNoSessionsElement.innerText = data[element]["NumberOfVPNSessions"] + " Sessions"
            newOperatorElement.innerText = "by " + data[element]["Operator"]
            newPingElement.innerText = data[element]["Ping"] + "ms"
            newIpElement.innerText = data[element]["IP"]
            newLogTypeElement.innerText = data[element]["LogType"]
            newScoreElement.innerText = data[element]["Score"]
            newCountryElement.innerText = data[element]["CountryLong"]
            var serverSpeed = parseInt(data[element]["Speed"]) / 10e6
            newSpeedElement.innerText = String(Math.round((serverSpeed + Number.EPSILON) * 100) / 100) + 'Mbps'
            
            var newServerInfoElement = document.createElement("serverInfo")
            /*
            var newServerDownloadLink = document.createElement("downloadLink")
            newServerDownloadLink.innerText = "OpenVPN Config File"
            newServerInfoElement.appendChild(newServerDownloadLink)
            */
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
            newDownloadButton.setAttribute("onclick", "downloadConfigFile('" + String(data[element]['IP']) + "')")
            newServerDetailsElement.appendChild(newDownloadButton)


            newServerDetailsElement.appendChild(newNoSessionsElement)
            newServerDetailsElement.appendChild(newIpElement)
            //newServerDetailsElement.appendChild(newLogTypeElement)
            //newServerDetailsElement.appendChild(newScoreElement)

            newServerElement.appendChild(newServerDetailsElement)

            document.getElementById("serversList").appendChild(newServerElement)
        }
    })
    .catch(function(err){
        document.getElementById("selectedCountry").innerText = "An error occured"
    })
}

function downloadConfigFile(serverIP){
    window.open("https://animenosekai.herokuapp.com/vpngate/api/downloadConfig?serverIP=" + String(serverIP))
}