# Calculator-taxi — веб-калькулятор прибыли таксиста

React + Vite + TypeScript + Mantine, мобильный-first интерфейс с офлайн-хранением (IndexedDB) и PWA.

## Быстрый старт
```bash
npm install
npm run dev
```

## Backend (FastAPI) для auth и синхронизации
```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

ENV переменные (см. `server/app/config.py`):
- `CALC_SECRET_KEY` — секрет для JWT (смените в проде).
- `CALC_DB_URL` — URL БД (по умолчанию SQLite файл `data.db`).
- `CALC_CORS_ORIGINS` — список Origins через запятую (по умолчанию localhost:5173/4173).

Во фронте укажите `VITE_API_URL=http://localhost:8000`, чтобы авторизация била в сервер.

## Что готово
- Калькулятор смены: заказы (нал/безнал, чаевые, время), ежедневные расходы, аренда, инфо-услуги, медик/механик, заметка.
- Подсчёт чистой прибыли/выручки, разбиение по способам оплаты, учёт чаевых и аренды по настройкам.
- Сохранение смен в IndexedDB, просмотр истории, детализация и удаление.
- Настройки интерфейса и расчёта (что показывать, тема, акцентный цвет).
- PWA (иконки, автообновление SW).

## Стек
- Frontend: React + Vite + TypeScript, Mantine UI, React Router.
- Сторидж: IndexedDB (idb).
- Утилиты: dayjs, nanoid, vite-plugin-pwa.

## Дальнейшие шаги
1. Подключить фронт к FastAPI (auth + sync смен, теперь есть серверный каркас).
2. Расширить историю: фильтры по месяцу, экспорт в PDF/Excel.
3. Добавить e2e и unit-тесты расчётов.
4. Настроить CI и деплой (Render/Heroku/VPS) с HTTPS.
