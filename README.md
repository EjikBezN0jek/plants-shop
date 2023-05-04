# Plants - Интернет-магазин растений

## Стэк

- Vue3 (Composition API)
- TypeScript
- SCSS
- PrimeVue, Swiper, Vuelidate
- json-server, json-server-auth

В данном проекте реализована авторизация пользователей с помощью json-server-auth с сохранением данных в SessionStorage.
![Login](https://user-images.githubusercontent.com/76658761/236275329-630a18de-92ad-4258-b96e-9fd39972b3e3.png)

На всех страницах присутствует виджет, отслеживающий количество товаров в вашей корзине.

### Главная

- Слайдер (Swiper)
  ![Home](https://user-images.githubusercontent.com/76658761/236275380-9c33208a-8332-411b-a51a-c0d6100f6495.png)

### Каталог

- Фильтрация товаров по категории, тегам, цветам и цене
- Сортировка по цене и рейтингу
- Бесконечная подгрузка товаров
- Поиск по имени (+ debounce)

![Catalog](https://user-images.githubusercontent.com/76658761/236275349-54eab3e0-9db3-481a-aa55-7e784f6610f3.png)

### Страница товара

- Просмотр фото (PrimeVue)
- Breadcrumb navigation
- Добавление товара в корзину (+ изменение кол-ва) и wishlist с сохранением в LocalStorage
- Возможность оставлять отзывы (только после авторизации)
- Карусель Похожих товаров (Swiper)

![Product](https://user-images.githubusercontent.com/76658761/236275301-5402bb4d-4d83-4276-aaae-281b795a68c4.png)

### Корзина

- Изменение кол-ва товаров, удаление из корзины

![Cart](https://user-images.githubusercontent.com/76658761/236275804-1b689812-e945-4cf5-9fdc-16ce4fdea5eb.png)

### Оформление заказа (только после авторизации)

- Форма с валидацией (Vuelidate) и отправка заказа на бэк

![Checkout](https://user-images.githubusercontent.com/76658761/236275267-f918a0a1-2259-4e4b-81d5-e9dfec1ddf57.png)

### Wishlist

- Добавление в корзину, удаление из wishlist

![Wishlist](https://user-images.githubusercontent.com/76658761/236275830-e4deb7ac-6f97-487c-91ba-d76016d92d05.png)

### Личный кабинет пользователя

- История заказов с отслеживанием статуса заказа
- История отзывов со статусом (published)

![User](https://user-images.githubusercontent.com/76658761/236276659-8fd2e1df-d220-4e06-b309-59335f1d040a.png)

### Админка

- Dashboard с новыми отзывами и заказами
- Добавление новых, изменение и удаление имеющихся категорий, цветов, тэгов и товаров
- Изменение статуса заказа, страница заказа с более точной информацией
- Модерация отзывов, их удаление
- Поиск товаров, сортировка по имени, цене, рейтингу, дате
- Возможность просмотра магазина в режиме администратора

![Admin](https://user-images.githubusercontent.com/76658761/236275228-bf2c3abd-a507-4d3a-8fc1-486e9c523605.png)
