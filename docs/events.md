# События GA4

Статус: вызовы подготовлены, ресурс GA4 не подключён. Проверка DebugView не выполнена.

| Событие | Расположение вызова / триггера | Параметры |
|---|---|---|
| generate_lead | js/form.js:22 | lead_trip_id, participants, lead_source |
| cta_click | index.html:1, js/site.js:9 | button_name, page_section |
| trip_filter | js/site.js:10 | difficulty, duration_days |
| trip_view | js/site.js:9 | trip_id, difficulty |
| date_select | js/site.js:11 | trip_id, trip_date, seats_left |
| rental_calc | js/site.js:13 | items_count, days, rental_price |
| checklist_check | js/site.js:12 | item_id |
| contact_click | 404.html:1, calendar.html:1, contacts.html:1, gear.html:1, guides.html:1, index.html:1, privacy.html:1, thanks.html:1, trips.html:1 | contact_type |
| messenger_click | js/site.js:15 | messenger |
| social_click | js/site.js:15 | network, page_section |
| form_error | js/form.js:7, js/form.js:19, js/form.js:23 | field_name, error_type |
| promo_copy | js/site.js:14 | promo_code |

Автоматические события Enhanced measurement: page_view, scroll, click, file_download, form_start, form_submit. Они не дублируются вручную.

Ещё не реализованы guide_view и map_open: нет карточек инструкторов и согласованной карты. Из 18 обязательных событий 17 имеют подготовленный источник (включая 6 автоматических); наличие кода не доказывает сбор.

Ключевые события: generate_lead, contact_click, messenger_click. Event-scope definitions: button_name, page_section, difficulty, trip_id, seats_left, lead_trip_id, messenger.

Примеры: trip_id=icefalls, difficulty=легко, rental_price=1300, participants=2, page_section=hero.

Все отправки gtag(event) централизованы в js/analytics.js. Персональные данные в параметры не включаются.