# Эксплуатация и настройка

## Существующий проект

Сайт https://tz-11-turklub-tropa-phi.vercel.app/, репозиторий https://github.com/Resolushh/tz-11-turklub-tropa, Measurement ID G-JG7PNX1WWW. HTML/CSS/JS без сборки. Vercel: Framework Other, корень ./, публикация main.

GA4 «ТРОПА — сайт», account 407470679, property 560936809, stream 16210906890. Тег подключён в head девяти страниц. Улучшенная статистика и взаимодействия с формами включены. Список собственных параметров и событий — [events.md](events.md).

Таблица [Tropa — Bookings](https://docs.google.com/spreadsheets/d/11_X-0ho07vGj-Q-Z5V2aeUz0e2_W9zXHBeM34XoDY_c/edit): utm и leads. Чтение по ссылке. Для реальной работы доступ следует ограничить; текущая форма предназначена только для вымышленных данных.

## Apps Script

Код apps-script/Code.gs. SPREADSHEET_ID задаётся в Script Properties; setup() готовит заголовки, статусы и проверки. Web app выполняется от владельца, доступ Anyone. URL /exec — bookingEndpoint в js/config.js. В публичном репозитории нет ключа Measurement Protocol или учётных секретов.

Перед изменением заголовков таблицы сверить HEADERS: приёмник проверяет схему. Повторный request_id отклоняется. SNOW300 сохраняется в N. Статусы: new, contacted, prepaid, went, lost.

## Форма и аналитика

После проверки полей выполняется POST, затем проверка ok:true, generate_lead с ожиданием обработки Google tag до 2,5 с и нативная навигация thanks.html. Все поля перед GET отключаются, контакты в адрес не попадают. Автоматический form_submit не дублируется вручную. Сбой аналитики не блокирует переход после успешной серверной записи.

Для новой проверки применяйте вымышленные имя/телефон, пустой e-mail и метки qa/referral. Отделяйте Realtime от обработанных отчётов, не складывайте эти срезы.

## ManyChat и ссылки

Настройки двух Live-веток: [manychat.md](manychat.md). Ссылки формируются в J2:J13 живого листа utm из исходных столбцов и R2; якорь в P. После изменения листа синхронизировать CSV/XLSX.

Для сайта используется реальный Instagram. Telegram/WhatsApp — учебные заглушки с пояснением. При появлении контактов заменить заглушки согласованными адресами и повторить проверку перехода и события.

## Проверки кода

Из корня репозитория: `node tests/phone.test.cjs`, `node tests/promo.test.cjs`, `node tests/analytics-delivery.test.cjs js/analytics.js`. Они не создают живые заявки.
