from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config

# instantiate the app
app = Flask(__name__)

# setup app config 
app.config.from_object(Config)

# Initiate database
db = SQLAlchemy(app)

# enable CORS
CORS(app, resources={r'/api/*':{'origins': '*'}}) 

if __name__ == "__main__":
    app.run(debug=True)

from .routes import routes
