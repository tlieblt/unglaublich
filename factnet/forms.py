from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, TextField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError, Optional
from factnet.pers import User
from flask_login import current_user



class RegistrationForm(FlaskForm):
    alias = StringField('Accountname', validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    f_o_s = StringField('Email', validators=[Optional()])

    password = PasswordField('Passwort', validators=[DataRequired()])
    confirm_password = PasswordField('Passwort bestätigen', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Registrieren')

    def validate_alias(self, alias):

        user = User.query.filter_by(alias=alias.data).first()

        if user:
            raise ValidationError('Accountname bereits in Gebrauch, bitte einen andere angeben!')

    def validate_email(self, email):

        user = User.query.filter_by(email=email.data).first()

        if user:
            raise ValidationError('Email bereits registriert, bitte eine andere angeben!')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')


class SaveModelForm(FlaskForm):
    title = StringField('Modellname', validators=[DataRequired()])
    submit = SubmitField('Speichern')


class AddInfoForm(FlaskForm):
    alias = StringField('Accountname', validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    f_o_s = TextAreaField('Was ist ihr Studiengebiet?', validators=[Optional()])
    title = TextAreaField('Was für Abschlüsse haben sie?', validators=[Optional()])

    submit = SubmitField('Speichern')

    def validate_alias(self, alias):
        if alias.data != current_user.alias:
            user = User.query.filter_by(alias=alias.data).first()
            if user:
                raise ValidationError('Accountname bereits in Gebrauch, bitte einen andere angeben!')

    def validate_email(self, email):
        if email.data != current_user.email:
            user = User.query.filter_by(email=email.data).first()
            if user:
                raise ValidationError('Email bereits registriert, bitte eine andere angeben!')
