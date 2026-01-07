@echo off
echo Starting PawCare Hub Backend...
echo Make sure PostgreSQL is running on localhost:5432
echo Database: pawcare_hub
echo Username: postgres
echo Password: admin
echo.
cd /d "%~dp0"
mvn spring-boot:run
pause