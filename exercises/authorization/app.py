from flask import Flask, redirect, request, url_for, session, render_template
from flask_login import LoginManager, current_user, login_required, login_user, logout_user, UserMixin
from oauthlib.oauth2 import WebApplicationClient
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

client = WebApplicationClient(os.getenv("GOOGLE_CLIENT_ID"))

login_manager = LoginManager()
login_manager.init_app(app)

users = {}

class User(UserMixin):
    def __init__(self, id_, name, email, picture):
        self.id = id_
        self.name = name
        self.email = email
        self.picture = picture

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

@app.route("/")
def index():
    if current_user.is_authenticated:
        return render_template('profile.html', user=current_user)
    return render_template('index.html')

@app.route("/login")
def login():
    google_provider_cfg = requests.get('https://accounts.google.com/.well-known/openid-configuration').json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    
    redirect_uri = "https://nipun.luther.edu:5000/login/callback"
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=redirect_uri,
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@app.route("/login/callback")
def callback():
    code = request.args.get("code")
    google_provider_cfg = requests.get('https://accounts.google.com/.well-known/openid-configuration').json()
    token_endpoint = google_provider_cfg["token_endpoint"]
    
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(os.getenv("GOOGLE_CLIENT_ID"), os.getenv("GOOGLE_CLIENT_SECRET")),
    )

    client.parse_request_body_response(token_response.text)
    
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)
    
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        users_name = userinfo_response.json()["given_name"]
        picture = userinfo_response.json().get("picture")
        
        user = User(unique_id, users_name, users_email, picture)
        users[unique_id] = user
        login_user(user)
        
        return redirect(url_for("index"))
    
    return "User email not available or not verified by Google.", 400

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(
        ssl_context=(
            "certs/certificate.pem", 
            "certs/private.key"
        ),
        host="0.0.0.0",
        port=5000,
        debug=True
    )