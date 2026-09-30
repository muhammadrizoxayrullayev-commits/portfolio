@echo off
chcp 65001 > nul
color 0A
cls
echo ================================================================
echo    PORTFOLIO SAYTINI GITHUBGA YUKLASH VA YANGILASH TIZIMI
echo    Muallif: Muhammadrizo Xayrullayev
echo ================================================================
echo.
echo [1/3] Fayllardagi barcha o'zgarishlar tekshirilmoqda...
git status -s
echo.
echo [2/3] O'zgarishlar saqlanmoqda (commit)...
git add .
set commit_msg=Update portfolio - %date% %time%
git commit -m "%commit_msg%" > nul 2>&1
echo.
echo [3/3] GitHub global serveriga yuklanmoqda (push)...
git push origin master
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo    MUVAFFAQIYATLI YUKLANDI!
    echo.
    echo    Sizning saytingiz va Vercel AI xizmatingiz 15-30 soniyada:
    echo.
    echo    1. GitHub Pages:
    echo       👉 https://muhammadrizoxayrullayev-commits.github.io/portfolio/
    echo.
    echo    2. Vercel (Jonli Vercel AI bilan):
    echo       👉 https://vercel.com/ (Loyiha bog'langandan so'ng avtomatik)
    echo ================================================================
) else (
    echo.
    echo [XATOLIK] Internet aloqasini tekshiring yoki qayta urinib ko'ring.
)
echo.
pause
