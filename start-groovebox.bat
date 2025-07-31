@echo off
echo Starting GrooveBox application...
echo.
echo This will start both the backend and frontend servers.
echo The application will be available at http://127.0.0.1:3000
echo Press Ctrl+C twice to stop all servers.
echo.

:: Set environment variable to ensure React uses 127.0.0.1
set HOST=127.0.0.1

:: Start the application
npm start

:: Open the browser with the correct URL
start http://127.0.0.1:3000
