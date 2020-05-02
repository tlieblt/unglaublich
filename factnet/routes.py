from flask import render_template, flash, redirect, url_for, request, jsonify
from factnet import app, db, bcrypt
from factnet.forms import RegistrationForm, LoginForm, AddInfoForm, SaveModelForm
from factnet.pers import User, Models, Verwaltung
from flask_login import login_user, logout_user, current_user, login_required
import json
import random


@app.route('/')
@app.route('/home')
def home():
    return render_template('main.html')


@app.route('/main')
def main():
    return render_template('main.html', title='Start')

@app.route('/dia')
def dia():
    return render_template('ffs.html')


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
        macher = User.query.filter_by(email=form.email.data).first()
        diag = Verwaltung(content={}, macher=macher, title="Ein erstes Modell")
        db.session.add(diag)
        db.session.commit()
        flash('Account für ' + form.alias.data + ' erstellt!', 'success')
        return redirect(url_for('home', title = 'Start'))
    return render_template('register.html', title='Registrierung', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        #flash('Eingeloggt als ' + current_user.alias, 'success')
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
        return render_template('save.html')



@app.route("/saved/<int:model_id>", methods=['GET', 'POST'])
@login_required
def change_model(model_id):
    model = Models.query.get_or_404(model_id)
    print('bis hierhin')
    print(model.content)
    if model.creator != current_user:
        flash('Sie haben keine Berechtigung auf dieses Modell zuzugreifen.', 'danger')
        return redirect(url_for('login'))
    elif request.method == 'GET' and request.content_type == 'application/json':
        response = app.response_class(response=model.content, status=200, mimetype='application/json')
        print(model.content)
        return jsonify(model.content)
        #return jsonify(model.content)
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
        return render_template('saved.html', diagram_name = model.title), 201

@login_required
@app.route("/einmodell/<int:page>", methods=['GET', 'POST'])
def einmodell(page):
    ubersicht = Verwaltung.query.get_or_404(page)
    if ubersicht.macher != current_user:
        return '', 404
    elif request.method == "GET" and request.content_type == 'application/json':
        print("ubersicht")
        print(ubersicht.content)
        #models = Verwaltung.query.filter_by(macher=current_user).paginate(page=page, per_page=1)
        model = ubersicht.content
        response = app.response_class(response=model, status=200, mimetype='application/json')
        return jsonify(model)

    elif request.method == "GET":
        print("ubersicht")
        print(ubersicht)
        # models = Verwaltung.query.filter_by(macher=current_user).paginate(page=page, per_page=1)
        model = ubersicht.content
        print(model)
        response = app.response_class(response=model, status=200, mimetype='application/json')

        print("nur get")
        return render_template("diagramme.html", title=ubersicht.title, model=model)
    elif request.method == 'POST' and request.content_type == 'application/json':
        print(ubersicht.content)
        print("json request im post: ")
        print(request.get_json())  # parse as JSON
        ubersicht.content = request.get_json()
        flash('Änderung gespeichert', 'success')
        db.session.commit()
        print(ubersicht.content)
        return '', 204

    elif request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        print(ubersicht.content)
        print("json request im post: ")
        neuerTitel = str(request.data.decode("utf-8"))
        #neuerTitel = neuerTitel[]
        print(neuerTitel)  # parse as JSON
        ubersicht.title = neuerTitel
        db.session.commit()
        print(ubersicht.content)
        return '', 204

@login_required
@app.route("/einmodell/<int:page>/<int:dias>", methods=['GET', 'POST'])
def modellbearbeitung(page,dias):
    modell = Verwaltung.query.get_or_404(page)

    if request.method == "GET" and request.content_type == 'application/json':
        print(modell.content)
        #models = Verwaltung.query.filter_by(macher=current_user).paginate(page=page, per_page=1)
        model = modell.content
        print(model)
        response = app.response_class(response=model, status=200, mimetype='application/json')
        return jsonify(model)

    elif request.method == "GET":
        print(modell)
        diagramme = Models.query.filter_by(creator=current_user).paginate(page=dias, per_page=10)
        print("diagramme.total")
        print(diagramme.pages)
        model = modell.content
        print(modell)
        response = app.response_class(response=model, status=200, mimetype='application/json')

        print("nur get")
        return render_template("diagrammbearbeitung.html", diagramme=diagramme, title=modell.title, model=model)





@login_required
@app.route("/eigenemodelle/<int:pg>", methods=['POST', 'GET'])
def eigenemodelle(pg):

    if request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        title = request.get_data().decode()
        neuetmodell = Verwaltung(title=title, content={}, macher=current_user)
        db.session.add(neuetmodell)
        db.session.commit()
        response = app.response_class(response=str(neuetmodell.id), status=302, mimetype='text/html;charset=UTF-8')
        return response
            #(url_for('einmodell', page=neuetmodell.id, dias=1))

    modelle = Verwaltung.query.filter_by(macher=current_user).paginate(page=pg, per_page=5)
    for m in modelle.items:
        print(m.id)
    return render_template("sichdiag.html", user=current_user, models=modelle)


@app.route('/neuesModell', methods=['GET', 'POST'])
@login_required
def neuesmodell():
    ersterInhalt = {}

    if request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        title = request.get_data().decode()
        model = Verwaltung(title=title, content=ersterInhalt, macher=current_user)
        db.session.add(model)
        db.session.commit()
        print(type(model.id))
        return redirect(url_for('einmodell', page=model.id, dias=1))
