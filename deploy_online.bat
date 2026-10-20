@echo off
title Deploy WAQTY Online
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
pause
