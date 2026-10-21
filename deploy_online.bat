@echo off
chcp 65001 >nul
title تحديث موقع وقتي على Vercel
echo ======================================================
echo   جاري حفظ التعديلات ورفعها إلى GitHub و Vercel...
echo ======================================================
cd /d "%~dp0"
git add -A
git commit -m "Auto update website"
git push origin main
echo ======================================================
echo  تم إرسال التحديث بنجاح!
echo  موقعك سيتحدث تلقائياً خلال ثوانٍ على الرابط الدائم:
echo  https://waqty-landing.vercel.app/
echo ======================================================
pause
