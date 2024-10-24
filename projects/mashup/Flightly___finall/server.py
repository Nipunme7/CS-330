from flask import Flask, render_template, request, jsonify
from twilio.rest import Client

api_key = "4b4c263ffab0eea9e5568b74a4b66a8d"
account_sid = 'ACf36962d86bf43ee3bee2c8a4627d27c5'
auth_token = '6c92fd96c1cfb166ec9005d3f4a1e65a'

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template("index.html")

@app.route("/api/retrieve", methods=["POST"])
def retrieve_data():
    data = request.json  # Get the JSON data sent from the client
    # You can process the data here
    parse_message(data)
    return jsonify({"status": "success", "received": data}), 200  # Send a response back

def parse_message(data):
    departure_city = data[8]
    departure_code = data[0]
    arrival_city = data[9]
    arrival_code = data[1]
    flight_number = data[2]
    departure_date = data[10]
    departure_time = data[11]
    arrival_time = data[13]
    weather_temp = data[17]
    passenger_name = data[20]

    # Formatting the message
    message = (
        f"Hi {passenger_name}, your flight {flight_number} from {departure_city} "
        f"({departure_code}) to {arrival_city} ({arrival_code}) is scheduled for {departure_date}, "
        f"departing at {departure_time} and arriving at {arrival_time}. "
        f"The weather at {arrival_city} at the given time is predicted to be {weather_temp}°C. "
        f"We'll text you again 4 hours before your flight. Safe travels!"
    )

    send_message(data, message)

def send_message(data, message):
    client = Client(account_sid, auth_token)
    client.api.account.messages.create(
        to=f"whatsapp:+1{data[21]}",
        from_="whatsapp:+14155238886",
        body=f"{message}")


if __name__ == "__main__":
    app.run(debug=True)
