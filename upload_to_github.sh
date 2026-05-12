#!/bin/bash

# Скрипт для загрузки интеграции на GitHub
# Использование: запустите этот скрипт в Git Bash

cd "C:\Users\Mlyub\Desktop\zambretti_sager"

# Инициализация git репозитория
git init

# Добавляем все файлы
git add .

# Создаем первый коммит
git commit -m "Initial release v1.0.0

- Zambretti weather forecasting (32 states)
- Sager weather forecasting (3 states)
- Sea level pressure correction with automatic altitude detection
- Interactive map location selector
- Temperature compensation for accurate pressure correction"

# Переименовываем ветку в main
git branch -M main

# Подключаем к GitHub
git remote add origin https://github.com/ziffmafiya/zambretti_sager.git

# Загружаем на GitHub
echo "Сейчас откроется окно для ввода логина и пароля GitHub"
git push -u origin main

echo ""
echo "✅ Готово! Репозиторий загружен на GitHub"
echo ""
echo "Следующие шаги:"
echo "1. Перейдите на https://github.com/ziffmafiya/zambretti_sager"
echo "2. Создайте релиз v1.0.0 (вкладка Releases → Create a new release)"
echo "3. Добавьте в HACS как custom repository"
echo ""
