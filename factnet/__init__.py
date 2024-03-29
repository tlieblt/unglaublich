from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask(__name__)
app.config['SECRET_KEY']='O02EX4ASPHGMYS4HIZIJFWVNY0VF5HM141C6SAVK'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://factnet:Jetzgehtslous!@factnet.mysql.pythonanywhere-services.com/factnet$userbase'
#engine = create_engine('mysql+mysqldb://factnet:Jetzgehtslous!@factnet.mysql.pythonanywhere-services.com/factnet$userbase', pool_recycle=280)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///userbase.db?check_same_thread=False'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

from factnet import routes
