from factnet import db, login_manager
from flask_login import UserMixin
from sqlalchemy.ext import mutable
from json import dumps, loads


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    alias = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    f_o_s = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    models = db.relationship('Models', backref="creator", lazy=True)

    def __repr__(self):
        return f"User('{self.alias}','{self.email}','{self.f_o_s}','{self.title}','{self.id}')"


class JsonDict(db.TypeDecorator):
    #Ermöglicht Abspeichern im JSON Format
    impl = db.Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return '{}'
        else:
            return dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return {}
        else:
            return loads(value)


mutable.MutableDict.associate_with(JsonDict)

class Models(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(JsonDict)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Models('{self.title}','{self.content}','{self.user_id}')"
