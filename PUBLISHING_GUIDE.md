# Инструкция по публикации в HACS

## Шаг 1: Создание GitHub репозитория

1. Зайдите на https://github.com и войдите в свой аккаунт
2. Нажмите "New repository" (зеленая кнопка)
3. Заполните:
   - **Repository name**: `zambretti_sager`
   - **Description**: `Weather forecasting for Home Assistant using Zambretti and Sager algorithms`
   - **Public** (обязательно для HACS)
   - ✅ Add a README file (можно не ставить, мы загрузим свой)
4. Нажмите "Create repository"

## Шаг 2: Структура файлов для загрузки

Загрузите в корень репозитория:
```
zambretti_sager/
├── README.md
├── LICENSE
├── hacs.json
├── info.md
├── logo.png
└── custom_components/
    └── zambretti_sager/
        ├── __init__.py
        ├── manifest.json
        ├── config_flow.py
        ├── const.py
        ├── sensor.py
        └── strings.json
```

## Шаг 3: Загрузка файлов

### Вариант А: Через веб-интерфейс GitHub

1. В вашем репозитории нажмите "Add file" → "Upload files"
2. Перетащите все файлы из `C:\Users\Mlyub\Desktop\zambretti_sager\`
3. **ВАЖНО**: Создайте структуру папок `custom_components/zambretti_sager/` и загрузите туда файлы интеграции
4. Напишите commit message: "Initial release v1.0.0"
5. Нажмите "Commit changes"

### Вариант Б: Через Git (если установлен)

```bash
cd "C:\Users\Mlyub\Desktop\zambretti_sager"

# Инициализация git
git init

# Создаем правильную структуру
mkdir -p custom_components/zambretti_sager
mv __init__.py manifest.json config_flow.py const.py sensor.py strings.json custom_components/zambretti_sager/

# Добавляем файлы
git add .
git commit -m "Initial release v1.0.0"

# Подключаем к GitHub (замените YOUR_USERNAME на ваш username)
git remote add origin https://github.com/YOUR_USERNAME/zambretti_sager.git
git branch -M main
git push -u origin main
```

## Шаг 4: Создание релиза

1. В репозитории перейдите на вкладку "Releases"
2. Нажмите "Create a new release"
3. Заполните:
   - **Tag version**: `v1.0.0`
   - **Release title**: `v1.0.0 - Initial Release`
   - **Description**: 
     ```
     ## Features
     - Zambretti weather forecasting (32 states)
     - Sager weather forecasting (3 states)
     - Sea level pressure correction
     - Interactive map location selector
     - Automatic altitude detection
     ```
4. Нажмите "Publish release"

## Шаг 5: Обновление ссылок

После создания репозитория замените `YOUR_USERNAME` в следующих файлах:

1. **README.md** (строки 6, 17, 163)
2. **manifest.json** (строки 6, 7)

Замените на ваш реальный GitHub username.

## Шаг 6: Добавление в HACS

### Вариант 1: Добавление как Custom Repository (для тестирования)

1. Откройте HACS в Home Assistant
2. Нажмите три точки → "Custom repositories"
3. Добавьте URL: `https://github.com/YOUR_USERNAME/zambretti_sager`
4. Категория: "Integration"
5. Нажмите "Add"

### Вариант 2: Официальное добавление в HACS (рекомендуется)

1. Убедитесь, что репозиторий соответствует требованиям HACS:
   - ✅ Публичный репозиторий
   - ✅ Есть README.md
   - ✅ Есть hacs.json
   - ✅ Есть info.md
   - ✅ Есть LICENSE
   - ✅ Правильная структура папок
   - ✅ Есть хотя бы один релиз

2. Перейдите на https://github.com/hacs/default
3. Нажмите "Fork"
4. В своем форке отредактируйте файл `integration`
5. Добавьте в конец списка:
   ```json
   "YOUR_USERNAME/zambretti_sager"
   ```
6. Создайте Pull Request с описанием:
   ```
   Add Zambretti & Sager Weather Forecaster integration
   
   Weather forecasting integration using classic Zambretti and Sager algorithms.
   ```

7. Дождитесь одобрения (обычно 1-7 дней)

## Шаг 7: Проверка

После добавления в HACS:
1. Откройте HACS → Integrations
2. Найдите "Zambretti & Sager Weather Forecaster"
3. Установите и протестируйте

## Полезные ссылки

- HACS Documentation: https://hacs.xyz/docs/publish/integration
- Home Assistant Developer Docs: https://developers.home-assistant.io/
- GitHub Docs: https://docs.github.com/

## Поддержка

Если возникнут вопросы при публикации, создайте issue в репозитории или обратитесь в сообщество HACS.
