# Join Backend

Join Backend ist die serverseitige Anwendung für das Join Taskmanagement-System, entwickelt mit Django.  
Es stellt Backend-Logik wie Benutzerregistrierung, Authentifizierung und API-Endpunkte zur Verwaltung von Benutzerdaten bereit.

---

## 🚀 Funktionen

- Benutzerregistrierung & Anmeldung  
- Authentifizierung & Autorisierung via JWT  
- REST-API zur Verwaltung von Benutzerdaten  
- Datenbankintegration (SQLite)  

---

## 🛠️ Technologien

- **Python**: Programmiersprache
- **Django**: Web-Framework
- **Django REST Framework**: API-Entwicklung
- **SQLite**: Datenbank
- **JWT**: Authentifizierung mit JSON Web Tokens

---

## ⚙️ Installation

### 1. Repository klonen
```bash
git clone https://github.com/SunnyDevZH/Join-Backend
```
```bash
cd Backend
```
### 2. Virtuelle Umgebung anlegen & aktivieren
```bash
python3 -m venv env
```
```bash
source env/bin/activate
```
### 3. Abhängigkeiten installieren
```bash
pip3 install -r requirements.txt
```
### 4. Migrationen ausführen
```bash
python3 manage.py migrate
```
### 5. Entwicklungsserver starten
```bash
python3 manage.py runserver
```
### 6. Anwendung im Browser öffnen
```bash
http://localhost:8000/admin
```
### 7. Superuser anlegen
```bash
python3 manage.py createsuperuser
```
