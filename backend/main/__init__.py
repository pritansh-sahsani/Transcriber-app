from flask import Flask
from flask_cors import CORS

# instantiate the app
app = Flask(__name__, instance_relative_config=False)


# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


from main import routes