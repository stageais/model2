@echo off
title Model Gallery Server

echo -------------------------------------
echo.
echo    Запуск сервера для Галереи Моделей
echo.
echo -------------------------------------
echo.

echo [1/2] Обновляю список изображений...
echo.

python generate_data.py

REM Проверяем, выполнилась ли предыдущая команда успешно
if %errorlevel% neq 0 (
    echo.
    echo ОШИБКА: Не удалось обновить список изображений.
    echo Убедитесь, что Python установлен, и файл 'generate_data.py' находится в этой же папке.
    echo.
    pause
    exit
)

echo Список изображений успешно обновлен!
echo.
echo -------------------------------------
echo.

echo [2/2] Запускаю локальный веб-сервер...
echo.
echo Ваш сайт теперь доступен по этим адресам:
echo.
echo   http://localhost:8000
echo   http://127.0.0.1:8000
echo.
echo Чтобы остановить сервер, просто закройте это окно
echo или нажмите CTRL+C.
echo.

python -m http.server

pause