# События GA4

Статус на 27.10.2026: тег установлен во всех девяти HTML. Семь параметров зарегистрированы. DebugView и получение событий ещё не подтверждены. При прямой проверке загрузчик https://www.googletagmanager.com/gtag/js?id=G-JG7PNX1WWW не открылся в Edge: ERR_CONNECTION_CLOSED. Это результат конкретной проверки сети, а не доказательство исправности сбора.

| Событие | Источник | Параметры с примерами | Условие |
|---|---|---|---|
| page_view | авто: gtag config во всех HTML | page_location, page_title | Открытие страницы |
| scroll | авто: Enhanced measurement | percent_scrolled=90 | Прокрутка до 90% |
| click | авто: Enhanced measurement | link_url, outbound=true | Внешняя ссылка |
| file_download | авто: Enhanced measurement | file_name, file_extension=pdf | PDF на gear.html |
| form_start | авто: Enhanced measurement | form_id=booking-form | Первое взаимодействие |
| form_submit | авто: Enhanced measurement | form_id=booking-form | Отправка формы |
| generate_lead | js/form.js:32 | lead_trip_id=icefalls; participants=1; lead_source=instagram | Только после ok:true |
| cta_click | index.html:9; js/site.js:9 | button_name=hero_trips; page_section=hero | Кнопки перехода к маршрутам и брони |
| trip_filter | js/site.js:10 | difficulty=легко; duration_days=1 | Изменение фильтра |
| trip_view | js/site.js:9 | trip_id=icefalls; difficulty=легко | Название маршрута в карточке |
| date_select | js/site.js:23 | trip_id=icefalls; trip_date=2026-12-13; seats_left=8 | Выбор доступной даты |
| guide_view | js/site.js:33 | guide_id=anna | Раскрытие учебной карточки |
| rental_calc | js/site.js:38 | items_count=2; days=2; rental_price=1300 | Кнопка расчёта |
| checklist_check | js/site.js:37 | item_id из data-item | Отметка пункта |
| contact_click | contacts.html:9 | contact_type=phone или email | Телефон и e-mail |
| messenger_click | js/site.js:40 | messenger=telegram или whatsapp | Нужны реальные project URLs в config.socials |
| social_click | js/site.js:40 | network=instagram; page_section=footer | Нужны реальные project URLs в config.socials |
| form_error | js/form.js:14 | field_name=participants; error_type=validation или server | Ошибка поля или приёмника |
| promo_copy | js/site.js:39 | promo_code=SNOW300 | Успешное копирование, по выбору |
| map_open | calendar.html:9 | map_service=openstreetmap | Ссылка учебной точки, по выбору |

Все ручные отправки gtag(event) находятся в js/analytics.js: 10. Сайт передаёт только разрешённые неперсональные параметры. Имя, телефон и e-mail не включаются в события или URL.

Обязательные определения уровня события: button_name, page_section, difficulty, trip_id, seats_left, lead_trip_id, messenger — сохранены в GA4.

Ключевые события проекта: generate_lead, contact_click, messenger_click. Лишние close_convert_lead и qualify_lead сняты с ключевых. Системное purchase остаётся: Google отключил его переключатель и пункт меню снятия. Это отклонение от буквального требования ТЗ зафиксировано, а не скрыто.

Код предусматривает все 20 событий, включая два дополнительных. Автоматические события не дублируются вручную. messenger_click и social_click ожидают URL аккаунтов проекта; живой приёмник и переход thanks проверены, но получение generate_lead в GA4 ещё не подтверждено. Наличие кода не подтверждает получение события в GA4.

Доказательства определения параметров и ключевых событий находятся в screens/kursovaya/. Для закрытия раздела 4.6 ещё нужны screenshots DebugView каждого события с раскрытыми параметрами.
