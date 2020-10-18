"""
 -- VPN Gate CSV API parser --

> Converts VPNGate's CSV API to a python dictionary

VPN Gate API URL:
    http://www.vpngate.net/api/iphone/
"""

# Imports
import requests

def vpngate_api(removeData=[], onlyCountry=None, academicUse=False):
    """
    Returns API data
    """
    # Downloading the data from VPNGate CSV API
    vpngate_csv = requests.get('http://www.vpngate.net/api/iphone/').text

    # Prepare the data
    vpngate_data_servers = vpngate_csv.split('\n')
    fields = ["ServerName","IP","Score","Ping","Speed","CountryLong","CountryShort","NumberOfVPNSessions","Uptime","TotalUsers","TotalTraffic","LogType","Operator","Message","OpenVPN_ConfigData_Base64"]

    # Variable declaration and initialization
    results = []
    temp_data = {}
    for server in vpngate_data_servers:
        server_data = server.split(',') # Split the string of infos with a comma following the csv format of the vpngate api
        if len(server_data) == 15:
            counter = 0
            # Iterate through all of the elements in the CSV Data
            for element in server_data:
                """debug
                print(fields[counter] + f"({str(counter)}): " + element)
                lifeeasy.sleep(1)
                """
                temp_data[fields[counter]] = element
                counter += 1
                if counter >= 15:
                    results.append(temp_data) # Append the current VPN Server data to the results
                    temp_data = {}
                    counter = 0

    country_temp = []

    if onlyCountry is not None:
        for server in results:
            if server["CountryShort"] == onlyCountry or server["CountryLong"] == onlyCountry:
                country_temp.append(server)
    else:
        country_temp = results

    nonAcademicUse_temp = []
    if not academicUse:
        for server in country_temp:
            if "academicuseonly" not in server["Operator"].replace(" ", "").lower():
                nonAcademicUse_temp.append(server)
    else:
        nonAcademicUse_temp = country_temp
    
    final = []
    for server in nonAcademicUse_temp:
        temp = server
        for element in removeData:
            temp.pop(element)
        final.append(temp)

    return final


def getOpenVPNConfig(serverIP):
    """
    Returns a tuple with the OpenVPN Config File (base64 encoded) and the country code.
    """
    data = vpngate_api(academicUse=True)
    for server in data:
        if server["IP"] == serverIP:
            return server["OpenVPN_ConfigData_Base64"], server["CountryShort"]
    return None