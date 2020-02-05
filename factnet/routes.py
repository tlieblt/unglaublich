from flask import render_template, flash, redirect, url_for, request, jsonify
from factnet import app, db, bcrypt
from factnet.forms import RegistrationForm, LoginForm, AddInfoForm, SaveModelForm
from factnet.pers import User, Models
from flask_login import login_user, logout_user, current_user, login_required
from factnet.js_test import schicker
import json
import random


@app.route('/')
@app.route('/home')
def home():
    return render_template('main.html')


@app.route('/main')
def main():
    return render_template('main.html', title='Start')


@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        flash('Sie sind bereits als ' + current_user.alias +' eingeloggt', 'success')
        return redirect(url_for('main', title = 'Start'))
    form = RegistrationForm()
    if form.validate_on_submit():
        secure_pw = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(alias=form.alias.data, email=form.email.data, f_o_s=' ', title=' ', password=secure_pw)
        db.session.add(user)
        db.session.commit()
        flash('Account für ' + form.alias.data + ' erstellt!', 'success')
        return redirect(url_for('home', title = 'Start'))
    return render_template('register.html', title='Registrierung', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        flash('Eingeloggt als ' + current_user.alias, 'success')
        return redirect(url_for('home', title = 'Start'))
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
                return redirect(url_for('main', title = 'Start'))
        else:
            flash('Login fehlgeschlagen, bitte Email und Passwort überprüfen!', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route("/logout", methods=['GET', 'POST'])
def logout():
    logout_user()
    flash('Erfolgreich ausgeloggt!', 'success')
    return redirect(url_for('home', title = 'Start'))


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






'''
data = []

time.sleep(random.random() * 5)  # wait 0 to 5 seconds
data.append(random.random() * 20)  # -5 to 15

# POST request
if request.method == 'POST':
    print('Incoming..')
    print(request.get_json())  # parse as JSON
    return 'OK', 200

# GET request
else:
    message = {'greeting':'Hello from Flask!'}

    return jsonify(data)  # serialize and use JSON headers

'''

@app.route('/hello', methods=['GET', 'POST'])
def hello():
    if request.method == 'POST':
        print("were postin")
        print(request.get_json())  # parse as JSON
        return render_template('save.html')
    else:
        return render_template('save.html')


@app.route('/save', methods=['GET', 'POST'])
@login_required
def save():
    jason = {}

    if request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        title = request.get_data().decode()
        model = Models(title=title, content=jason, creator=current_user)
        db.session.add(model)
        db.session.commit()
        print(type(model.id))
        response = app.response_class(response=str(model.id), status=200, mimetype='text/html;charset=UTF-8')
        return response

    else:
        print('model sdfsdf')

        return render_template('save.html')



@app.route("/saved/<int:model_id>", methods=['GET', 'POST'])
@login_required
def change_model(model_id):
    model = Models.query.get_or_404(model_id)
    print('bis hierhin')
    if model.creator != current_user:
        flash('Sie haben keine Berechtigung auf dieses Modell zuzugreifen.', 'danger')
        return redirect(url_for('login'))
    elif request.method == 'GET' and request.content_type == 'application/json':
        response = app.response_class(response=model.content, status=200, mimetype='application/json')
        print(model.content)
        return jsonify(model.content)
    elif request.method == 'POST' and request.content_type == 'application/json':
        print(model.content)
        print("json request im post: ")
        print(request.get_json())  # parse as JSON
        model.content = request.get_json()
        flash('Änderung gespeichert', 'success')
        db.session.commit()
        print(model.content)
        return render_template('saved.html')
    else:
        return render_template('saved.html')


#mb obsolet
'''
    @app.route('/savemod', methods=['GET', 'POST'])
    @login_required
    def save_modell():
        if request.method == 'POST' and request.content_type == 'application/json':
            print("im save requestdata: ")

            print(request.data)
            diagramm_data = request.get_json()
            title = request.get_data().decode()
            model = Models(title=title, content=diagramm_data, creator=current_user)
            db.session.add(model)
            db.session.commit()

            print('model gesischert')

            flash('model gesischert', 'success')
            return redirect(url_for('main', model_id=model.id))
        else:
            return render_template('save.html')  
'''