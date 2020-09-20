"""
 -- VPN Gate CSV API parser --

> Converts VPNGate's CSV API to a python dictionary

VPN Gate API URL:
    http://www.vpngate.net/api/iphone/
"""

# Imports
import lifeeasy

def vpngate_api():
    # Downloading the data from VPNGate CSV API
    vpngate_csv = lifeeasy.request('http://www.vpngate.net/api/iphone/').text

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

    return results