from flask import render_template, redirect, url_for, request, jsonify, abort
from factnet import app, db, bcrypt
from factnet.forms import RegistrationForm, LoginForm, AddInfoForm, SaveModelForm
from factnet.pers import User, Models, Verwaltung, Abfrage
from flask_login import login_user, logout_user, current_user, login_required
import json
import random




@app.route('/')
@app.route('/home')
@app.route('/main')
def main():
    return render_template('main.html', title='Start')


#Erstellt einen neuen Nutzer
@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
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
        return redirect(url_for('home', title = 'Start'))
    return render_template('register.html', title='Registrierung', form=form)


#Überprüft beim Login die daten
@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home', title = 'Start'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            return render_template('main.html', title = 'Start')
    return render_template('login.html', title='Login', form=form)


#Loggt aus
@app.route("/logout", methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect(url_for('home', title = 'Start'))


#Stellt das Nutzerprofil dar und verwaltet Änderungen
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
        return redirect(url_for('profile'))
    elif request.method == 'GET':
        form.alias.data = current_user.alias
        form.email.data = current_user.email
        form.f_o_s.data = current_user.f_o_s
        form.title.data = current_user.title
    return render_template('user.html', title='Profil', form=form)


#Eine Route zur Erstellung eines neuen Diagrammes
@app.route('/save', methods=['GET', 'POST'])
@login_required
def save():
    jason = {}

    if request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        title = request.get_data().decode()
        model = Models(title=title, content=jason, creator=current_user)
        db.session.add(model)
        db.session.commit()
        response = app.response_class(response=str(model.id), status=200, mimetype='text/html;charset=UTF-8')
        return response

    else:
        return render_template('save.html')


#Zeigt ein Diagramm an und ändert Titel und Inhalt bei Bedarf
@app.route("/saved/<int:model_id>", methods=['GET', 'POST'])
@login_required
def change_model(model_id):
    model = Models.query.get_or_404(model_id)
    if model.creator != current_user:
        return redirect(url_for('login'))

    elif request.method == 'GET' and request.content_type == 'application/json':
        response = app.response_class(response=model.content, status=200, mimetype='application/json')
        return jsonify(model.content)

    elif request.method == 'POST' and request.content_type == 'application/json':
        model.content = request.get_json()
        db.session.commit()

        return render_template('eindiagramm.html')
    elif request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        neuertitel = str(request.data.decode("utf-8"))
        if(model.creator != current_user):
            abort(403)
        model.title = neuertitel
        db.session.commit()
        return '', 204

    else:
        return render_template('eindiagramm.html', diagram_name = model.title), 201


#Zeigt ein erstelltes Modell an
@login_required
@app.route("/einmodell/<int:page>", methods=['GET', 'POST'])
def einmodell(page):
    ubersicht = Verwaltung.query.get_or_404(page)
    if ubersicht.macher != current_user:
        return '', 404
    elif request.method == "GET" and request.content_type == 'application/json':
        #models = Verwaltung.query.filter_by(macher=current_user).paginate(page=page, per_page=1)
        model = ubersicht.content
        response = app.response_class(response=model, status=200, mimetype='application/json')
        return jsonify(model)

    elif request.method == "GET":
        model = ubersicht.content
        response = app.response_class(response=model, status=200, mimetype='application/json')

        return render_template("einmodell.html", title=ubersicht.title, model=model)


    elif request.method == 'POST' and request.content_type == 'application/json':
        ubersicht.content = request.get_json()
        db.session.commit()
        return '', 204

    elif request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        if(ubersicht.macher != current_user):
            abort(403)

        neuerTitel = str(request.data.decode("utf-8"))
        ubersicht.title = neuerTitel
        db.session.commit()
        return '', 204


#Hier werden Diagramme angezeigt, die in Modelle gezogen werden können
@login_required
@app.route("/einmodell/<int:page>/<int:dias>", methods=['GET', 'POST'])
def modellbearbeitung(page,dias):
    modell = Verwaltung.query.get_or_404(page)

    if request.method == "GET" and request.content_type == 'application/json':
        model = modell.content
        response = app.response_class(response=model, status=200, mimetype='application/')
        return jsonify(model)

    elif request.method == "GET":
        diagramme = Models.query.filter_by(creator=current_user).paginate(page=dias, per_page=10)
        model = modell.content
        response = app.response_class(response=model, status=200, mimetype='application/json')
        return render_template("diagrammbearbeitung.html", diagramme=diagramme, title=modell.title, model=model)




#Zeigt eine Übersicht über die erstellten Modelle an
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

    modelle = Verwaltung.query.filter_by(macher=current_user).paginate(page=pg, per_page=5)
    return render_template("erstelltemodelle.html", user=current_user, models=modelle)


#Erstellt ein neues Modell
@app.route('/neuesModell', methods=['GET', 'POST'])
@login_required
def neuesmodell():
    ersterInhalt = {}

    if request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        title = request.get_data().decode()
        model = Verwaltung(title=title, content=ersterInhalt, macher=current_user)
        db.session.add(model)
        db.session.commit()
        return redirect(url_for('einmodell', page=model.id, dias=1))



#Zeigt die erstellten Diagramme an
@login_required
@app.route("/erstelltediagramme/<int:page>", methods=['GET', 'POST'])
def diagramme(page):

    if request.method == "GET":
        diagramme = Models.query.filter_by(creator=current_user).paginate(page=page, per_page=24)
        return render_template("erstelltediagramme.html", diagramme=diagramme)



#Zeigt ein Quiz an und ändert den Titel
@app.route('/diagrammquiz/<int:di>', methods=['GET', 'POST'])
@login_required
def diagrammquiz(di):
    dasquiz = Abfrage.query.get_or_404(di)

    if request.method == "GET" and request.content_type == 'application/json':
        return jsonify(dasquiz.content)

    elif request.method == "GET":
        return render_template("einquiz.html", title=dasquiz.title)

    elif request.method == 'POST' and request.content_type == 'text/html;charset=UTF-8':
        neurtitel = str(request.data.decode("utf-8"))
        if(dasquiz.fragender != current_user):
            abort(403)
        dasquiz.title = neurtitel
        db.session.commit()
        return '', 204


    elif request.method == 'POST' and request.content_type == 'application/json':
        dasquiz.content['array'] = request.get_json()['array']
        db.session.commit()

        return '', 204



    else: return render_template("einquiz.html", title=dasquiz.title)


#Erstellt ein Diagrammquiz
@app.route('/diagrammquiz/<string:neu>', methods=['GET', 'POST'])
@login_required
def neuesquiz(neu):
    if neu == "neu" and request.method == "GET":
        #erstellt einen neuen Fragenkatalog
        leer = {'array':[{'frage':'Eine Frage.', 'antwort':'Eine Antwort', 'count': 0, 'acc': 0.5, 'id':'keine'}]}
        ersterEintrag = Abfrage(fragender=current_user, content=leer, title="Eine Fragensammlung")
        db.session.add(ersterEintrag)
        db.session.commit()
        return str(ersterEintrag.id)

    elif neu == "mach" and request.method == "POST" and request.content_type == 'application/json':
        #wenn ein ganzes Modell in Fragen umgewandelt werden soll
        ersterEintrag = Abfrage(fragender=current_user, content=request.get_json(), title="Eine Fragensammlung")

        return redirect(url_for('diagrammquiz/', di=ersterEintrag.id))


#Zeigt die Abfrageseite zu den Fragen eines Abfrageobjektes an
@app.route('/diagrammquiz/<int:die>/<string:abfrage>', methods=['GET', 'POST'])
@login_required
def abfragen(abfrage, die):
    if abfrage == "abfrage":
        dasQuiz = Abfrage.query.get_or_404(die)

        if request.method == "GET":
            return render_template("abfrage.html", title=dasQuiz.title)

        elif request.method == "POST" and request.content_type == "application/json":

            tempi = dasQuiz.content['array']
            neuFr = request.get_json()
            for tmp in tempi:
                if neuFr['frage'] == tmp['frage'] and neuFr['antwort'] == tmp['antwort']:
                    tmp['acc'] = neuFr['acc']
                    tmp['count'] = neuFr['count']
            dasQuiz.content['array'] = tempi
            db.session.commit()
            return '', 204


#Die Erweiterungsseite zeigt den Inhalt eines Diagramms als  Frageknoten an die zum Quiz zugefügt werden können
@app.route('/diagrammquiz/<int:qi>/erweitern/<int:mi>', methods=['GET', 'POST'])
@login_required
def erweiterquiz(qi,mi):
    fragendaten = Abfrage.query.get_or_404(qi)
    if request.method == 'GET':
        return render_template('diagrammzuquiz.html', title=fragendaten.title, quizid=qi, modellid=mi)

    elif request.method == 'POST' and request.content_type == 'application/json':
        te = fragendaten.content['array']
#        json.loads(te)

        for frage in request.get_json()['array']:
            te.append(frage)
        fragendaten.content['array'] = te
        db.session.commit()

        return str(fragendaten.id)



#Seite zeigt bestehende Diagramme an, von denen man Informationen abfragen will
@app.route('/diagrammquiz/<int:quizid>/<int:paje>', methods=['GET', 'POST'])
@login_required
def erweitern(quizid, paje):
    diagramme = Models.query.filter_by(creator=current_user).paginate(page=paje, per_page=24)

    if request.method == "GET":
            return render_template("quizbearbeitung.html", diagramme = diagramme, quizid= quizid)




#Übersichtsseite für Quizze
@login_required
@app.route("/erstelltequizze/<int:seite>", methods=['GET'])
def alleQuizze(seite):
    if request.method == 'GET':
        diequizze = Abfrage.query.filter_by(fragender=current_user).paginate(page=seite, per_page=24)

        return render_template("erstelltequizze.html", diequizze=diequizze)


#Löscht ein Diagramm
@login_required
@app.route("/saved/<int:dasdia>/delete", methods=['POST'])
def delete_dia(dasdia):
    dia = Models.query.get_or_404(dasdia)
    if dia.creator != current_user:
        abort(403)
    db.session.delete(dia)
    db.session.commit()
    return redirect(url_for('main', title = 'Start'))

#Löscht ein Modell
@login_required
@app.route("/einmodell/<int:dasmodl>/delete", methods=['POST'])
def delete_modell(dasmodl):
    modl = Verwaltung.query.get_or_404(dasmodl)
    if modl.macher != current_user:
        abort(403)
    db.session.delete(modl)
    db.session.commit()
    return redirect(url_for('main', title = 'Start'))

#Löscht ein Quiz
@login_required
@app.route("/diagrammquiz/<int:dasquiz>/delete", methods=['POST'])
def delete_quiz(dasquiz):
    dasquiz = Abfrage.query.get_or_404(dasquiz)
    if dasquiz.fragender != current_user:
        abort(403)
    db.session.delete(dasquiz)
    db.session.commit()
    return redirect(url_for('main', title = 'Start'))
