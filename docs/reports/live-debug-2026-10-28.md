# Живая проверка GA4 — 28.10.2026, 22:12–22:15 МСК

Управление Edge через браузерное расширение восстановилось. Tag Assistant подключён к опубликованному сайту; обнаружен G-JG7PNX1WWW.

Путь: каталог с UTM instagram/social/winter_trips_2026/funnel_debug_28 → фильтр «легко» (3 маршрута) → кнопка «В поход» у icefalls → форма → успешная отправка.

В GA4 DebugView ресурса 560936809 подтверждены события в порядке:

- page_view — 22:12:26;
- trip_filter — 22:12:47;
- cta_click — 22:13:05;
- page_view формы — 22:13:06;
- form_start — 22:13:10;
- generate_lead — 22:13:18 (отображается ключевым событием).

Параметры открыты и прочитаны в DebugView:

- trip_filter: difficulty=легко, duration_days=all;
- cta_click: button_name=book_icefalls, page_section=trips;
- generate_lead: lead_source=instagram, lead_trip_id=icefalls, participants=1.

Страница thanks показала REQ-74d105d5-9d1f-42d3-84be-d258bcf164b6. В таблице leads прочитан диапазон A1:M20: ровно 3 заполненные заявки, включая этот номер с created_at=28.10.2026 22:13:18, trip_id=icefalls, trip_date=2026-12-13, participants=1, utm_source=instagram, utm_medium=social, utm_campaign=winter_trips_2026, utm_content=funnel_debug_28, status=new. Использованы вымышленные контактные данные.

Доказательство: debug-funnel-2026-10-28.jpg — DebugView с цепочкой и открытым participants=1. В снимке нет контактных полей таблицы.

Это подтверждает живую пятишаговую цепочку и совпадение заявки с таблицей, но ещё не доказывает остальные обязательные события, мобильную воронку, обновлённые агрегированные отчёты или оповещение. Старые итоги отчётов 27–28 октября получены до этой проверки; их нельзя выдавать за текущие. Доказательства включены в пакет живой проверки.

## Дополнительные события 22:16–22:19 МСК
В DebugView подтверждены: guide_view (guide_id=anna), checklist_check (item_id=layers), rental_calc (days=2, items_count=2, rental_price=1300), promo_copy (promo_code=SNOW300), file_download (file_extension=pdf, file_name=/files/checklist.pdf), map_open (map_service=openstreetmap), date_select (trip_id=icefalls, trip_date=2026-12-13, seats_left=8), click. Пустая форма дала четыре form_error; у раскрытого события field_name=consent, error_type=validation. Контакты не передавались в GA4. Скриншоты debug-date-seats.jpg, debug-rental-price.jpg, debug-guide.jpg, debug-checklist.jpg, debug-promo.jpg, debug-download.jpg, debug-map.jpg, debug-form-error.jpg сохранены здесь же. Для click отдельные параметры ещё не раскрыты. form_submit в списке пока нет, trip_view и contact_click ещё не проверены, messenger/social ожидают настоящих URL проекта. Вкладки Tag Assistant и тестового сайта закрылись после окончания предыдущего хода; это подтверждено свежим списком вкладок. Для следующих действий нужен новый сеанс Tag Assistant. Управление Edge и вкладка GA4 доступны.

## Дополнение 22:21–22:24 МСК
В GA4 DebugView подтверждены trip_view (trip_id=icefalls, difficulty=легко) и contact_click (contact_type=email, отображается ключевым). Скриншоты debug-trip-view.jpg и debug-contact.jpg.
Проверка адаптивности: viewport задан 390×844; доступная ширина содержимого из DOM — 375 px с учётом полосы прокрутки, scrollWidth=clientWidth=375. Меню раскрывается, пустая форма показывает ошибки и aria-invalid=true у 5 полей. Скриншоты mobile-menu-390.jpg, mobile-form-errors-390.jpg. Viewport сброшен к обычному размеру после проверки. Это не мобильный User-Agent и не подтверждение device_category=mobile в GA4. Новой заявки в этой проверке не отправлялось.
Веб-поток 16210906890 сообщает, что сбор данных работает за последние 48 часов. Улучшенная статистика и Взаимодействия с формами включены (switch=1); настройки не менялись. Скрин ga4-form-interactions-enabled.jpg. Несмотря на gtm-событие Отправка формы в Tag Assistant, form_submit в GA4 пока не наблюдался. Причина не установлена. Код формы использует preventDefault и fetch, но это только гипотеза о несовместимости автоотслеживания, не доказанный диагноз. Официальная справка описывает form_start и form_submit как два события взаимодействий с формами: https://support.google.com/analytics/answer/9216061 . Ручной дубль не добавлялся.
Из 20 предусмотренных имен событий 17 хотя бы раз наблюдались в GA4 текущими проверками. Открыты form_submit, messenger_click, social_click; последние два требуют настоящих ссылок проекта. Полный комплект скриншотов всех параметров каждого события ещё не готов. Отчёты и Explore надо обновить после обработки новой заявки; старые значения не заменяют текущие.

Сохранённая Explore-воронка Open · Source повторно проверена за 27–28 октября после живого теста. Обработанные данные пока показывают page_view: Instagram Sessions 1 пользователь, Direct Sessions 2 пользователя; шаги 2–5 равны 0. Свежая DebugView-цепочка не отразилась в Explore на момент проверки. Эти два результата нельзя смешивать: доставка событий доказана DebugView, обработанная воронка ещё не подтверждает завершение. Скрин funnel-open-current-2224.jpg. Старые значения Direct1 в отдельных снимках теперь исторические. Новые Live-доказательства не дают права объявить агрегированные отчёты обновлёнными.

## Снимки проверки

- [debug-checklist.jpg](../proofs/live-debug/debug-checklist.jpg)
- [debug-contact.jpg](../proofs/live-debug/debug-contact.jpg)
- [debug-date-seats.jpg](../proofs/live-debug/debug-date-seats.jpg)
- [debug-download.jpg](../proofs/live-debug/debug-download.jpg)
- [debug-form-error.jpg](../proofs/live-debug/debug-form-error.jpg)
- [debug-funnel-2026-10-28.jpg](../proofs/live-debug/debug-funnel-2026-10-28.jpg)
- [debug-guide.jpg](../proofs/live-debug/debug-guide.jpg)
- [debug-map.jpg](../proofs/live-debug/debug-map.jpg)
- [debug-promo.jpg](../proofs/live-debug/debug-promo.jpg)
- [debug-rental-price.jpg](../proofs/live-debug/debug-rental-price.jpg)
- [debug-trip-view.jpg](../proofs/live-debug/debug-trip-view.jpg)
- [funnel-open-current-2224.jpg](../proofs/live-debug/funnel-open-current-2224.jpg)
- [ga4-form-interactions-enabled.jpg](../proofs/live-debug/ga4-form-interactions-enabled.jpg)
- [mobile-form-errors-390.jpg](../proofs/live-debug/mobile-form-errors-390.jpg)
- [mobile-menu-390.jpg](../proofs/live-debug/mobile-menu-390.jpg)
