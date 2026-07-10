@echo off
echo ============================================================
echo   FreelanceHub – Starting Django Server
echo ============================================================
echo.

:: Set your MongoDB Atlas URI here OR set it as an environment variable before running this script.
:: Example: set MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
::
:: If MONGO_URI is already set in the environment, this line is ignored.
if "%MONGO_URI%"=="" (
    echo [WARNING] MONGO_URI is not set. Using localhost:27017
    echo           Edit MONGO_URI in this file to use MongoDB Atlas.
    echo.
)

echo Starting Django development server at http://127.0.0.1:8000
echo Open Frontend\index.html in your browser after the server starts.
echo Press Ctrl+C to stop.
echo.

python manage.py runserver
pause
