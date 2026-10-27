# Подключение сервисов

1. Создать публичный GitHub-репозиторий tz-11-turklub-tropa, подключить локальный репозиторий и импортировать в Vercel (Other, без build command, корень проекта).
2. Создать GA4 «ТРОПА — сайт», Москва, RUB. Веб-поток — адрес Vercel. Включить расширенную статистику и формы. Measurement ID записать в js/config.js. Перед приёмкой вставить реальный тег непосредственно в head всех страниц (см. decisions.md).
3. Google Таблица «Tropa — Bookings». В Apps Script вставить apps-script/Code.gs. В настройках проекта добавить Script Property SPREADSHEET_ID. Выполнить setup(), разрешить доступ.
4. Развернуть Apps Script как Web app: выполнение от своего имени, доступ Anyone. URL /exec записать в bookingEndpoint в js/config.js. Проверить с сайта, что fetch читает JSON, заявка появляется в leads, а generate_lead отправляется только после ok:true.
5. Зарегистрировать 7 параметров Event scope, 3 Key events; проверить все события в DebugView.
6. Заполнить departures в config: {tripId:'icefalls',date:'2026-12-05',seats:12} — это пример формата, не согласованное расписание. Указать реальные ссылки socials: instagram/vk/telegram/youtube/whatsapp.
7. Создать лист utm и реестр 12 ссылок по ТЗ, опубликовать и проверить. Затем ManyChat и отчёты через 24–48 часов.

Никакие сервисы пока не подключены. Не используйте реальные персональные данные для тестов.
