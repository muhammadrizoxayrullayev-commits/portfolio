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
    echo    Sizning saytingiz 15-30 soniyada butun dunyo bo'yicha
    echo    avtomatik tarzda yangilanadi:
    echo.
    echo    👉 https://muhammadrizoxayrullayev-commits.github.io/portfolio/
    echo ================================================================
) else (
    echo.
    echo [XATOLIK] Internet aloqasini tekshiring yoki qayta urinib ko'ring.
)
echo.
pause
