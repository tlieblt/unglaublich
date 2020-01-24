from factnet import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    alias = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(100),nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)
    models = db.relationship('Models', backref="creator", lazy=True)

    def __repr__(self):
        return f"User('{self.alias}','{self.email}','{self.id}')"


class Models(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Models('{self.title}')"
