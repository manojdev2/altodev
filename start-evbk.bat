@echo off
cd /d "%~dp0evbk-main"

if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
    echo Installing dependencies...
    venv\Scripts\pip install -r requirements.txt
)

echo Starting evbk Flask backend...
call venv\Scripts\activate.bat
python retailapp.py
