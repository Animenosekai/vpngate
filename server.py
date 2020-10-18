"""
The server script which runs the API
"""
import io
import sys
import json
import base64

from flask import Flask, request, send_file
from flask_cors import CORS

import vpngate_api

app = Flask(__name__)
CORS(app)

def str_to_bool(string):
    """
    Converts a string to a boolean value
    """
    if string.replace(" ", "").lower() in ["true", "1", "yes"]:
        return True
    else:
        return False

@app.route("/vpngate/api/servers", methods=["GET"])
def VPNGateAPI():
    """
    Main VPN Gate API Endpoint
    """
    try:
        country = request.args.get('country', default=None, type=str)
        academicUse = str_to_bool(request.args.get('academic', default="false", type=str))
        if "Anise-IgnoreBase64OpenVPN" in request.headers:    
            return json.dumps(vpngate_api.vpngate_api(["OpenVPN_ConfigData_Base64"], onlyCountry=country, academicUse=academicUse), indent=4), 200
        else:
            return json.dumps(vpngate_api.vpngate_api([], onlyCountry=country, academicUse=academicUse), indent=4), 200
    except:
        exceptionDetails = {"exceptionType": str(sys.exc_info()[0]), "exception": str(sys.exc_info()[1])}
        return json.dumps({"error": True, "message": "An error occured while processing your request", "statusCode": 400, "details": exceptionDetails}), 400


@app.route("/vpngate/api/downloadConfig", methods=["GET"])
def DownloadConfig():
    """
    Returns the OpenVPN Config File
    """
    try:
        ip = request.args.get('serverIP', default=None, type=str)
        if ip is not None:
            data = vpngate_api.getOpenVPNConfig(ip)
            if data is not None:
                return send_file(io.BytesIO(base64.b64decode(data[0])), as_attachment=True, attachment_filename=f"{str(data[1])} Server ({str(ip)}).ovpn"), 200
            else:
                return json.dumps({"error": "Server Not Found"})
        else:
            return json.dumps({"error": "No server IP provided"})
    except:
        exceptionDetails = {"exceptionType": str(sys.exc_info()[0]), "exception": str(sys.exc_info()[1])}
        return json.dumps({"error": True, "message": "An error occured while processing your request", "statusCode": 400, "details": exceptionDetails}), 400
    

app.run(host='127.0.0.1', port='4000')