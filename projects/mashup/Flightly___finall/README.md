# Flightly - Flight Tracking Application

Flightly is a web application that allows users to track flight information, view weather details, and receive SMS notifications about their flights.

## Project Structure

- `server.py`: The main Flask server file that handles backend operations.
- `static/`: Directory containing all static files (CSS, JavaScript, images, videos).
- `templates/`: Directory containing HTML templates.

### Static Files

#### CSS
- `static/css/styles.css`: Contains all the styling for the application.

#### JavaScript
- `static/js/main.js`: The main JavaScript file that initializes all components.
- `static/js/components/`: Directory containing modular JavaScript components.
  - `flightSearch.js`: Handles flight search functionality.
  - `smsForm.js`: Manages the SMS form for flight tracking.
  - `popup.js`: Controls the popup for QR code scanning.
- `static/js/api/`: Directory for API-related functions.
  - `flightApi.js`: Handles flight data API calls.
  - `weatherApi.js`: Manages weather data API calls.
- `static/js/utils/`: Directory for utility functions.
  - `dateTime.js`: Provides date and time formatting functions.
  - `cookies.js`: Handles cookie operations for saving flight numbers.

#### Media
- `static/images/`: Contains images used in the application.
- `static/videos/`: Stores background video for the application.

### Templates
- `templates/index.html`: The main (and only) HTML template for the application.

## Features

1. **Flight Search**: Users can search for flights using flight numbers.
2. **Flight Information Display**: Shows detailed flight information including departure/arrival times, airports, and flight status.
3. **Weather Information**: Displays weather details for both departure and arrival cities.
4. **SMS Tracking**: Allows users to receive SMS notifications about their flight by entering their name and phone number.
5. **QR Code Scanning**: Provides a QR code for users to scan for additional information.
6. **Responsive Design**: The application is designed to work on various screen sizes.

## How It Works

1. The user enters a flight number in the search bar.
2. The application fetches flight data from an aviation API.
3. Weather data for departure and arrival cities is fetched from a weather API.
4. The UI is updated with the fetched flight and weather information.
5. Users can opt to receive SMS notifications by entering their details.
6. The server sends SMS notifications using Twilio API.

## Setup and Running

1. Install the required Python packages: `flask` and `twilio`.
2. Set up your API keys for aviation and weather APIs in the respective files.
3. Configure your Twilio account details in `server.py`.
4. Run the Flask server: `python server.py`
5. Access the application through a web browser at `http://localhost:5000`

## Note

This project uses external APIs for flight and weather data. Make sure you have the necessary API keys and permissions to use these services.
