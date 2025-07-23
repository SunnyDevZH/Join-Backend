# Join Backend

Join Backend ist die serverseitige Anwendung für das Join Taskmanagement-System, entwickelt mit Django.  
Es stellt Backend-Logik wie Benutzerregistrierung, Authentifizierung und API-Endpunkte zur Verwaltung von Benutzerdaten bereit.

---

## 🚀 Funktionen

1. Benutzerregistrierung & Anmeldung  
2. Authentifizierung & Autorisierung via JWT  
3. REST-API zur Verwaltung von Benutzerdaten  
4. Datenbankintegration (SQLite)  

---

## 🛠️ Technologien

**Python**: Programmiersprache
- **Django**: Web-Framework
- **Django REST Framework**: API-Entwicklung
- **SQLite**: Datenbank 
- **JWT**: Authentifizierung mit JSON Web Tokens

---

## ⚙️ Installation

### 1. Repository klonen
git clone https://github.com/SunnyDevZH/Join-Backend
cd Backend

### 2. Virtuelle Umgebung anlegen & aktivieren
python3 -m venv env
source env/bin/activate

### 3. Migrationen ausführen
python3 manage.py migrate

### 4. Entwicklungsserver starten
python3 manage.py runserver

### 5. Anwendung im Browser öffnen
http://localhost:8000/admin

### 6. Superuser anlegen
python3 manage.py createsuperuser

