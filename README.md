First Backend for a Taskmanagement System
# Join Backend

Das Join Backend ist eine serverseitige Anwendung, die mit Django entwickelt wurde und die Backend-Logik für die Join-App bereitstellt. Es umfasst Funktionen wie Benutzerregistrierung, Authentifizierung und API-Endpoints zur Verwaltung von Benutzerdaten.

## Features

- Benutzerregistrierung und -anmeldung
- Authentifizierung und Autorisierung mit JWT
- API zur Verwaltung von Benutzerdaten
- Datenbankintegration (z.B. PostgreSQL oder SQLite)

## Voraussetzungen

Bevor du das Projekt klonst, stelle sicher, dass du die folgenden Softwarekomponenten installiert hast:

- [Python 3.x](https://www.python.org/downloads/) (mindestens Version 3.8)
- [Pip](https://pip.pypa.io/en/stable/)
- [Django](https://www.djangoproject.com/)
- [PostgreSQL](https://www.postgresql.org/) (oder eine andere unterstützte Datenbank)

## Installation

Installation auf Mac:

1. Erstelle eine virtuelle Python-Umgebung mit python3 -m venv env.
2. Aktiviere die virtuelle Umgebung mit source env/bin/activate.
3. Installiere die erforderlichen Pakete mit pip install -r requirements.txt.
4. Führe, falls nötig, Migrationen mit python3 manage.py migrate aus.
5. Starte den Entwicklungsserver mit python3 manage.py runserver.

Requirements:

asgiref==3.8.1
bcrypt==4.2.0
cffi==1.17.0
cryptography==43.0.0
Django==5.1.1
django-cors-headers==4.6.0
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
numpy==2.1.0
paramiko==3.4.1
pycparser==2.22
PyJWT==2.10.1
PyNaCl==1.5.0
sqlparse==0.5.1



### 1. Repository klonen

Klonen des Repositories mit folgendem Befehl:

```bash
git clone https://github.com/SunnyDevZH/Join-Backend.git

