from flask import render_template, flash, redirect, url_for, request
from factnet import app, db, bcrypt
from factnet.forms import RegistrationForm, LoginForm, AddInfoForm
from factnet.pers import User, Models
from flask_login import login_user, logout_user, current_user, login_required


@app.route('/')
@app.route('/home')
def home():
    return render_template('base.html')


@app.route('/main')
def main():
    return render_template('main.html')


@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        flash('Sie sind bereits als ' + current_user.alias +' eingeloggt', 'success')
        return redirect(url_for('main'))
    form = RegistrationForm()
    if form.validate_on_submit():
        secure_pw = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(alias=form.alias.data, email=form.email.data, f_o_s=' ', title=' ', password=secure_pw)
        db.session.add(user)
        db.session.commit()
        flash('Account für ' + form.alias.data + ' erstellt!', 'success')
        return redirect(url_for('home'))
    return render_template('register.html', title='Registrierung', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        flash('Eingeloggt als ' + current_user.alias, 'success')
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            flash('Sie sind als '+ user.alias +' eingeloggt!', 'success')
            login_user(user, remember=form.remember.data)
            dest = request.args.get('next')
            if dest:
                return redirect(url_for(dest[1:]))
            else:
                return redirect(url_for('main'))
        else:
            flash('Login fehlgeschlagen, bitte Email und Passwort überprüfen!', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route("/logout", methods=['GET', 'POST'])
def logout():
    logout_user()
    flash('Erfolgreich ausgeloggt!', 'success')
    return redirect(url_for('home'))


@app.route("/profile", methods=['GET', 'POST'])
@login_required
def profile():
    form = AddInfoForm()
    if form.validate_on_submit():
        current_user.alias = form.alias.data
        current_user.email = form.email.data
        current_user.f_o_s = form.f_o_s.data
        current_user.title = form.title.data
        db.session.commit()
        flash('Die Änderungen wurden gespeichert!', 'success')
        return redirect(url_for('profile'))
    elif request.method == 'GET':
        form.alias.data = current_user.alias
        form.email.data = current_user.email
        form.f_o_s.data = current_user.f_o_s
        form.title.data = current_user.title
    return render_template('user.html', title='Profil', form=form)
