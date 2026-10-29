# События GA4 — актуально на 30.10.2026

17 предусмотренных событий наблюдались в DebugView 28.10; три оставшихся подтверждены в Realtime 30.10. Это подтверждение по совокупности проверок, не одновременный тест всех событий в одной сессии.

| Событие | Источник | Параметры с примерами | Условие |
|---|---|---|---|
| page_view | авто: gtag config во всех HTML | page_location, page_title | Открытие страницы |
| scroll | авто: Enhanced measurement | percent_scrolled=90 | Прокрутка до 90% |
| click | авто: Enhanced measurement | link_url, outbound=true | Внешняя ссылка |
| file_download | авто: Enhanced measurement | file_name, file_extension=pdf | PDF на gear.html |
| form_start | авто: Enhanced measurement | form_id=booking-form | Первое взаимодействие |
| form_submit | авто: Enhanced measurement | form_id=booking-form | Отправка формы |
| generate_lead | js/form.js | lead_trip_id=icefalls; participants=1; lead_source=instagram | Только после ok:true |
| cta_click | index.html; js/site.js | button_name=hero_trips; page_section=hero | Кнопки перехода к маршрутам и брони |
| trip_filter | js/site.js | difficulty=легко; duration_days=1 | Изменение фильтра |
| trip_view | js/site.js | trip_id=icefalls; difficulty=легко | Название маршрута в карточке |
| date_select | js/site.js | trip_id=icefalls; trip_date=2026-12-13; seats_left=8 | Выбор доступной даты |
| guide_view | js/site.js | guide_id=anna | Раскрытие учебной карточки |
| rental_calc | js/site.js | items_count=2; days=2; rental_price=1300 | Кнопка расчёта |
| checklist_check | js/site.js | item_id из data-item | Отметка пункта |
| contact_click | contacts.html | contact_type=phone или email | Телефон и e-mail |
| messenger_click | js/site.js | messenger=telegram или whatsapp | Клик учебной кнопки; реальный чат не подключён |
| social_click | js/site.js | network=instagram; page_section=footer | Клик Instagram @tropa_winter_hiking |
| form_error | js/form.js | field_name=participants; error_type=validation или server | Ошибка поля или приёмника |
| promo_copy | js/site.js | promo_code=SNOW300 | Успешное копирование, по выбору |
| map_open | calendar.html | map_service=openstreetmap | Ссылка учебной точки, по выбору |


## Доказательства

- [17 событий и цепочка заявки](reports/live-debug-2026-10-28.md).
- [Автоматический form_submit, form_id=booking-form](reports/form-submit-fixed-2026-10-30.md).
- social_click=1, network=instagram, page_section=footer: [событие](proofs/remaining-events-2026-10-30/social-click-event.png), [network](proofs/remaining-events-2026-10-30/social-click-network.png), [раздел](proofs/remaining-events-2026-10-30/social-click-section.png).
- messenger_click=2, messenger=telegram:1 и whatsapp:1: [событие](proofs/remaining-events-2026-10-30/messenger-click-event.png), [значения](proofs/remaining-events-2026-10-30/messenger-click-values.png). Это учебные кнопки, не реальные чаты.
- [Ожидание generate_lead перед навигацией](reports/lead-delivery-fix-2026-10-30.md).

Семь Event-scope определений: button_name, page_section, difficulty, trip_id, seats_left, lead_trip_id, messenger. Ключевые события проекта: generate_lead, contact_click, messenger_click. Системное purchase не удалось снять в доступном интерфейсе.

Все ручные вызовы проходят белый список неперсональных параметров js/analytics.js. Имя, телефон и e-mail в события не передаются. event_callback подтверждает обработку команды Google tag, а не серверный приём. Полный набор одинаковых кадров параметров для всех событий отдельно не объявляется собранным.
