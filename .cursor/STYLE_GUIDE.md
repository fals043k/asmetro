# основа в каком стиле должен быть написан код

## html
``` html
<body>
    <div class="wrapper">
        <div class="content">

            <header class="main-header">
                <div class="header container">
                    <a href="#" class="logo">
                        <div class="logo__pin"><img src="imges/LogoImg.svg" alt=""></div>
                        <div class="logo__text">
                            <p class="logo__text-1">ТехноСервис</p>
                            <p class="logo__text-2">IT Аутсорсинг</p>
                        </div>
                    </a>
                    <nav class="nav">
                        <ul>
                            <li><a  href="#" class="navbar-link">Услуги</a></li>
                            <li><a  href="#" class="navbar-link">Каталог</a></li>
                            <li><a  href="#" class="navbar-link">О компании</a></li>
                            <li><a  href="#" class="navbar-link">Кейсы</a> </li>
                            <li><a  href="#" class="navbar-link">Контакты</a></li>
                        </ul>            
                    </nav>

                        
                    <div class="taskbar">           
                        <a class="contact">
                            <img src="imges/IconPhone.svg" class="contact-ico">
                            <p>+7 (495) 123 45 67</p>
                        </a>

                        <button class="basket-btn">
                            <img src="imges/IconBasket.svg" class="basket-ico">
                        </button>

                        <button class="burger-btn">
                            <img src="imges/burger-menu-img.svg" class="burger-menu-img">
                        </button>

                        <a class="consultation-btn">
                            <p>Получить консультацию</p>
                        </a>
                    </div>
                </div>
            </header>


            <section class="amenities-title">
                <div class="container">
                    <div class="amenities-text">
                        <h1 class="amenities-text__h1">Наши услуги</h1>
                        <p class="amenities-text__p">Комплексные решения для вашего бизнеса</p>   
                    </div>
                </div>
            </section>

            <section class="ame-one">
                <div class="container ame-blocks">
                    <div class="text-block">
                        <img class="text-block__icon" src="imges/first_icon.svg" alt="">
                        <h2 class="text-block__h2">IT Аутсорсинг</h2>
                        <div class="problem">
                            <p>Проблема: Ваша IT-инфраструктура работает нестабильно? Частые сбои мешают бизнес-процессам?</p>
                        </div>
                        <div class="reshenie">
                            <p>Решение: Мы берем на себя полное управление вашей IT-инфраструктурой: от мониторинга до решения инцидентов.</p>
                        </div>
                        <div class="plus">
                            <h3>Преимущества:</h3>
                            <div class="plus_box">
                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Круглосуточный мониторинг систем</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Время реакции на инциденты от 15 минут</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Проактивное обслуживание и обновления</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Регулярное резервное копирование</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Защита от киберугроз</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Отчетность и аналитика</p>   
                                </div>
                            </div>
                        </div>
                        <div class="button-order">
                            <p>Заказать услугу</p>
                            <img src="imges/arrow-right.svg" alt="">
                        </div>
                    </div>
                    <div class="picture-block">
                        <img src="imges/Image-one.png" alt="">
                    </div>
                </div>
            </section>

            <section class="ame-two">
                <div class="container ame-blocks ame-blocks--right">
                    <div class="text-block text-block--right">
                        <img class="text-block__icon" src="imges/second-icon.svg" alt="">
                        <h2 class="text-block__h2">Печатный Аутсорсинг</h2>
                        <div class="problem">
                            <p>Проблема: Высокие расходы на печать? Простои из-за отсутствия расходников или поломок принтеров?</p>
                        </div>
                        <div class="reshenie">
                            <p>Решение: Управление всем печатным парком: от установки до обслуживания и поставки расходников.</p>
                        </div>
                        <div class="plus">
                            <h3>Преимущества:</h3>
                            <div class="plus_box">
                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Снижение расходов на печать до 30%</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Поставка оригинальных расходников</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Проактивное обслуживание и обновления</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Плановое обслуживание техники</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Мониторинг использования печати</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Консолидированная отчетность</p>   
                                </div>
                            </div>
                        </div>
                        <div class="button-order">
                            <p>Заказать услугу</p>
                            <img src="imges/arrow-right.svg" alt="">
                        </div>
                    </div>
                    <div class="picture-block picture-block--right">
                        <img src="imges/Image-two'.png" alt="">
                    </div>
                </div>
            </section>

            <section class="ame-three">
                <div class="container ame-blocks">
                    <div class="text-block">
                        <img class="text-block__icon" src="imges/third-icon.svg" alt="">
                        <h2 class="text-block__h2">Программное обеспечение</h2>
                        <div class="problem">
                            <p>Проблема: Сложности с лицензированием ПО? Не знаете, какие программы действительно нужны?</p>
                        </div>
                        <div class="reshenie">
                            <p>Решение: Аудит, подбор, лицензирование и поддержка программного обеспечения для вашего бизнеса.</p>
                        </div>
                        <div class="plus">
                            <h3>Преимущества:</h3>
                            <div class="plus_box">
                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Легальное лицензирование всех программ</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Оптимизация затрат на ПО</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Обновления и патчи безопасности</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Консультации по выбору решений</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Управление подписками</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Техническая поддержка приложений</p>   
                                </div>
                            </div>
                        </div>
                        <div class="button-order">
                            <p>Заказать услугу</p>
                            <img src="imges/arrow-right.svg" alt="">
                        </div>
                    </div>
                    <div class="picture-block">
                        <img src="imges/Image-tree.png " alt="">
                    </div>
                </div>
            </section>

            <section class="ame-four">
                <div class="container ame-blocks ame-blocks--right">
                    <div class="text-block text-block--right">
                        <img class="text-block__icon" src="imges/fourd-icon.svg" alt="">
                        <h2 class="text-block__h2">Поставка Оборудования</h2>
                        <div class="problem">
                            <p>Проблема: Нужно новое оборудование, но не знаете, что выбрать? Долгие поиски и сравнения?</p>
                        </div>
                        <div class="reshenie">
                            <p>Решение: Подбор, поставка и настройка IT-оборудования с учетом специфики вашего бизнеса.</p>
                        </div>
                        <div class="plus">
                            <h3>Преимущества:</h3>
                            <div class="plus_box">
                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Индивидуальный подбор оборудования</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Конкурентные цены от производителей</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Доставка и установка "под ключ"</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Настройка и интеграция</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Гарантийное обслуживание</p>
                                </div>

                                <div class="plus_box__item">
                                    <img src="imges/check-point-icon.svg" alt="">
                                    <p>Trade-in старого оборудования</p>   
                                </div>
                            </div>
                        </div>
                        <div class="button-order">
                            <p>Заказать услугу</p>
                            <img src="imges/arrow-right.svg" alt="">
                        </div>
                    </div>
                    <div class="picture-block picture-block--right">
                        <img src="imges/Image-four.png" alt="">
                    </div>
                </div>
            </section>
```

## css
``` css
.container{
    padding: 0 2vw;
}

.amenities-title{
    background: linear-gradient(180deg, #0a2463 0%, #2e3a59 100%);
}

.amenities-text h1{
    font-weight: 400;
    font-size: 33px;
    line-height: 111%;
    color: #fff;

    padding-top: 59px;
    margin-bottom: 15px;
}

.amenities-text p{
    font-weight: 400;
    font-size: 18px;
    line-height: 140%;
    color: #d1d5dc;

    padding-bottom: 59px;
}


.ame-blocks{
    display: flex;
    justify-content: space-between;
    /* background-color: bisque; */
}

.ame-blocks--right{
    display: flex;
    flex-direction: row-reverse;
}

.text-block{
    margin-top: 44px;
    width: 48%;
}

.text-block__icon{
    margin-bottom: 14px;
    transition: all 0.2s ;
}

.text-block__icon:hover{
    filter: contrast(130%) brightness(60%);
    transform: scale(1.13);
}

.text-block__h2{
    margin-bottom: 14px;
}

.problem{
    width: 100%;
    background-color: #fef2f2;
    border-left: 3.74px solid #fb2c36;
    margin-bottom: 14px;
    padding: 18px 14px;
}

.problem p{
    font-weight: 400;
    font-size: 13px;
    line-height: 143%;
    color: #9f0712;
}

.reshenie{
    width: 100%;
    background: #f0fdf4;
    border-left: 3.74px solid #00c950;

    padding: 18px 14px;
    margin-bottom: 23px;
}

.reshenie p{
    font-weight: 400;
    font-size: 13px;
    line-height: 143%;
    color: #016630;
}
.plus{
    margin-bottom: 23px;
}

.plus h3{
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #0a2463;
    margin-bottom: 11px;  
}

.plus_box__item{
    display: flex;
    margin-bottom: 8px;
}

.plus_box__item p{
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #364153;

    margin-left: 7px;
}

.button-order{
    display: flex;
    background: #00c2d2;
    border-radius: 9px;
    width: 168px;
    height: 44px;
    padding: 10px 18px;
    transition: background 0.3s, transform 0.2s ;
    
}

.button-order:hover{
    background: #0ba5b3;
    transform: scale(1.05);

}

.button-order p{
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #fff;
}

.button-order img{
    width: 18px;
    margin-left: 4px;
}
.picture-block{
    width: 48%;
    /* background-color: #364153; */
}
.picture-block img{
    margin-top: 122px;
    width: 100%;
    /* margin-left: calc(var(--index) * 2); */
    /* width: calc(var(--index) * 24);
    max-width: 560px; */
    box-shadow: 0 7px 9px -6px rgba(0, 0, 0, 0.1), 0 19px 23px -5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.picture-block img:hover{
    transform: scale(1.03);
}

.picture-block--right img{
    margin-left: 0;
}


footer{
    background: #0a2463;
    margin-top: 119px;
    padding-bottom: 30px;
}

.footer-top{
    display: flex;
    justify-content: space-between;
    padding-top: 41px;
}
.logobox{
    display: flex;
    margin-bottom: 14px;
}
.logobox img{
    width: 41px;
    height: 41px;
    margin-right: 10px;
}
.logobox h4{
    font-weight: 400;
    font-size: 13px;
    line-height: 150%;
    color: #ffffff;
}
.logobox p{
    font-weight: 400;
    font-size: 12px;
    line-height: 143%;
    color: #d1d5dc;
    }
```


## Адаптация
``` css
@media (max-width: 768px) {
    .ame-blocks{
        display: block;
    }

    .container{
        padding: 0 4vw;
    }

    .text-block{
        width: 100%;
    }
    .picture-block{
        display: flex;
        justify-content: center;
        margin-top: 5vh;
        width: 100%;
    }
    .picture-block img{
        width: 100%;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
    }

}
```
# Пример слайдера

## Пример слайдера HTML
``` html

<div class="slider-container">
    <div class="slider">
        <a href="#">
            <div id="slide-one" class="slider__item">
                <p>9-12 декабря</p>
                <h3>Визит делегации Международной Ассоциации «Метро» в Пекин и Шанхай</h3>
            </div>
        </a>
        <a href="#">
            <div id="slide-two" class="slider__item">
                <p>14 ноября</p>
                <h3>Заседание Совета и Общее собрание членов Международной Ассоциации "Метро"</h3>
            </div>
        </a>
        <a href="#">
            <div id="slide-one" class="slider__item">
                <p>9-12 декабря</p>
                <h3>Визит делегации Международной Ассоциации «Метро» в Пекин и Шанхай</h3>
            </div>
        </a>
    </div>
</div>

```

## Пример слайдера CSS
``` css

.slider{
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    gap: 10px;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    
    scrollbar-width: none;
}



.slider > *{
    scroll-snap-align: start;
}

#slide-one{
    background-image: url('images/slider-1.png');
}

#slide-two{
    background-image: url('images/slider-2.png');
}
.slider__item {
    position: relative;
    padding: 36px 19px;
    width: 232px;
    height: 324px;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-position: center;
}

.slider__item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(69, 80, 141, 0) 0%, rgba(117, 146, 195, 0.8) 59.13%, #7592c3 93.27%);

}

.slider__item p{
    position: relative;
    font-weight: 500;
    font-size: 12px;
    color: #d6e9ff;
    z-index: 10;
    margin-top: 200px;
    margin-bottom: 10px;
}

.slider__item h3{
    position: relative;
    font-weight: 600;
    font-size: 12px;
    color: #fff;
    z-index: 10;
}

.slider-container{
    margin-bottom: 20px;
}

.sec5-h2{
    margin-top: 67px;
    margin-bottom: 38px;
}
```
