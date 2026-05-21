import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParts } from '../redux/slices/partsSlice';
import './HomePage.css';

const fallbackCategories = [
    { name: 'Тормозная система', count: 6, note: 'Контроль, сцепление и уверенность на скорости.' },
    { name: 'Охлаждение', count: 4, note: 'Термостаты, жидкости и стабильный температурный режим.' },
    { name: 'Подвеска', count: 5, note: 'Точное поведение кузова и предсказуемый контакт с дорогой.' },
    { name: 'Электрика', count: 3, note: 'Свет, запуск и ясная диагностика в одном потоке.' },
];

const fallbackFeaturedParts = [
    {
        id: 'fallback-brakes',
        name: 'Тормозные колодки передние',
        price: 23,
        article: 'VW-B4-BRK-001',
        category: 'Тормозная система',
        description: 'Оригинальные колодки с понятной совместимостью и быстрой готовностью к отправке.',
        stock: 45,
        imageUrl: 'https://ir.ozone.ru/s3/multimedia-p/6289219849.jpg',
    },
    {
        id: 'fallback-belt',
        name: 'Ремень ГРМ комплект',
        price: 38,
        article: 'VW-B4-TMG-006',
        category: 'Двигатель',
        description: 'Комплект для сервисного интервала с акцентом на надежность и визуальную подачу.',
        stock: 18,
        imageUrl: 'https://avatars.mds.yandex.net/get-mpic/16277195/2a0000019886ae7a1a0071ccc7833ed9bf9d/orig',
    },
    {
        id: 'fallback-headlight',
        name: 'Фара левая (комплект)',
        price: 62,
        article: 'VW-B4-LMP-008',
        category: 'Электрика и оптика',
        description: 'Выразительная оптика для витрины и один из самых заметных визуальных акцентов каталога.',
        stock: 9,
        imageUrl:
            'https://cdn.izap24.ru/images/prodacts/sourse/394852/394852898_passat-b4-93-97-faryi-komplekt-pravaya-levyiy-depo-oe-441-11a2l-441-11a2p.jpg',
    },
];

const reviewCards = [
    {
        quote: 'Заказывал тормозные колодки, и весь процесс ощущался как премиальный сервис: быстро, точно, без лишней суеты.',
        author: 'Михаил, Passat B4 1.9 TDI',
    },
    {
        quote: 'Подбор по VIN реально сэкономил время. Вместо длинного поиска я сразу получила нужный ремень ГРМ и уверенность в совместимости.',
        author: 'Елена, Passat B4 2.0',
    },
    {
        quote: 'Нравится, что магазин выглядит современно, но говорит по делу. Товары понятны, цены прозрачны, доставка без сюрпризов.',
        author: 'Андрей, Passat B4 Variant',
    },
];

const processSteps = [
    {
        step: '01',
        title: 'Диагностика',
        text: 'Сначала отсекаем лишнее и понимаем, какой именно узел требует внимания.',
    },
    {
        step: '02',
        title: 'Подбор по VIN',
        text: 'Проверяем совместимость, артикулы и версию детали перед оформлением.',
    },
    {
        step: '03',
        title: 'Отгрузка за 24 часа',
        text: 'Собираем заказ как pit-box перед выездом: быстро, чисто и без хаоса.',
    },
];

const HomePage = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.parts);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchParts());
        }
    }, [dispatch, items.length]);

    const featuredParts = items.slice(0, 3);
    const quickShipParts = [...items].sort((first, second) => second.stock - first.stock).slice(0, 3);
    const inventoryCount = items.reduce((total, part) => total + part.stock, 0);
    const priceFloor = items.length > 0 ? Math.min(...items.map((part) => part.price)) : 5;
    const categoryHighlights = Object.entries(
        items.reduce((accumulator, part) => {
            accumulator[part.category] = (accumulator[part.category] || 0) + 1;
            return accumulator;
        }, {})
    )
        .sort((first, second) => second[1] - first[1])
        .slice(0, 4)
        .map(([name, count]) => ({
            name,
            count,
            note: `Внутри витрины: ${count} позиций, собранных вокруг одной сервисной задачи.`,
        }));

    const categoryCards = categoryHighlights.length > 0 ? categoryHighlights : fallbackCategories;
    const showcaseParts = featuredParts.length > 0 ? featuredParts : fallbackFeaturedParts;
    const expressParts = quickShipParts.length > 0 ? quickShipParts : fallbackFeaturedParts;
    const heroPart = showcaseParts[0];
    const signalItems = [
        'VIN-guided picks',
        '24h dispatch',
        'OEM accuracy',
        'Passat B4 specialist',
        ...categoryCards.map((category) => category.name),
    ];

    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-shape hero-shape--amber" aria-hidden="true" />
                <div className="hero-shape hero-shape--blue" aria-hidden="true" />
                <div className="hero-shape hero-shape--mesh" aria-hidden="true" />

                <div className="hero-grid">
                    <div className="hero-copy">
                        <p className="hero-kicker">Rich Auto Parts Atelier</p>
                        <h1 className="hero-title">Магазин запчастей, оформленный как концепт-гараж для Passat B4.</h1>
                        <p className="hero-description">
                            Здесь детали не просто перечислены в каталоге. Мы собираем их в визуально насыщенную
                            витрину с акцентом на совместимость, скорость отгрузки и ощущение точного инженерного
                            выбора.
                        </p>

                        <div className="hero-actions">
                            <Link to="/catalog" className="cta-button">
                                Открыть каталог
                            </Link>
                            <a href="#spotlight" className="ghost-button">
                                Смотреть витрину
                            </a>
                        </div>

                        <div className="hero-metrics">
                            <article className="metric-card">
                                <span className="metric-value">{items.length || 10}</span>
                                <span className="metric-label">подобранных SKU</span>
                            </article>
                            <article className="metric-card">
                                <span className="metric-value">{inventoryCount || 558}+</span>
                                <span className="metric-label">единиц на складе</span>
                            </article>
                            <article className="metric-card">
                                <span className="metric-value">${priceFloor}</span>
                                <span className="metric-label">стартовая цена</span>
                            </article>
                        </div>
                    </div>

                    <div className="hero-visual" aria-label="Auto parts abstract display">
                        <div className="hero-wheel" aria-hidden="true">
                            <span className="wheel-ring wheel-ring--outer" />
                            <span className="wheel-ring wheel-ring--middle" />
                            <span className="wheel-ring wheel-ring--inner" />
                            <span className="wheel-core" />
                        </div>

                        <article className="hero-floating-card hero-floating-card--primary">
                            <span className="floating-label">Today&apos;s lead part</span>
                            <strong>{heroPart?.name || 'Тормозные и сервисные модули'}</strong>
                            <p>{heroPart?.category || 'Ключевые узлы для быстрой сервисной сборки'}</p>
                        </article>

                        <article className="hero-floating-card hero-floating-card--secondary">
                            <span className="floating-label">Fastest moving stock</span>
                            <strong>{expressParts[0]?.name || 'Расходники ежедневного спроса'}</strong>
                            <p>
                                От ${priceFloor} и до {expressParts[0]?.stock || 120} шт. в наличии для мгновенной
                                отправки.
                            </p>
                        </article>

                        <div className="hero-badge-cluster">
                            <span>VIN Match</span>
                            <span>OEM / Select</span>
                            <span>24h Ship</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="signal-strip" aria-label="Shop signals">
                <div className="signal-track">
                    {[...signalItems, ...signalItems].map((item, index) => (
                        <span key={`${item}-${index}`} className="signal-pill">
                            {item}
                        </span>
                    ))}
                </div>
            </section>

            <section className="spotlight-section" id="spotlight">
                <div className="section-heading">
                    <p className="section-kicker">Curated shelf</p>
                    <h2 className="section-title">Витрина с реальными деталями, а не с шаблонными промо-блоками.</h2>
                    <p className="section-copy">
                        Три первых позиции каталога превращаются в художественные карточки с сильным акцентом на форму,
                        материал и мгновенную читаемость цены.
                    </p>
                </div>

                <div className="spotlight-grid">
                    {showcaseParts.map((part, index) => (
                        <article key={part.id} className={`spotlight-card spotlight-card--${index + 1}`}>
                            <div className="spotlight-media">
                                <img
                                    src={part.imageUrl || '/images/placeholder.jpg'}
                                    alt={part.name}
                                    className="spotlight-image"
                                    onError={(event) => {
                                        event.target.src = '/images/placeholder.jpg';
                                    }}
                                />
                                <span className="spotlight-price">${part.price}</span>
                            </div>

                            <div className="spotlight-body">
                                <div className="spotlight-meta">
                                    <span>{part.category}</span>
                                    <span>Арт. {part.article}</span>
                                </div>
                                <h3>{part.name}</h3>
                                <p>{part.description}</p>

                                <div className="spotlight-footer">
                                    <span>{part.stock} шт. на складе</span>
                                    <Link to="/catalog" className="spotlight-link">
                                        Купить
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="atelier-section">
                <div className="category-panel">
                    <div className="section-heading section-heading--left">
                        <p className="section-kicker">Category radar</p>
                        <h2 className="section-title">Формы и блоки меняются вместе с типами деталей.</h2>
                        <p className="section-copy">
                            Вместо одинаковых карточек витрина распределяет внимание по сервисным категориям: тормоза,
                            фильтры, охлаждение, подвеска и другие узлы.
                        </p>
                    </div>

                    <div className="category-grid">
                        {categoryCards.map((category, index) => (
                            <article key={category.name} className={`category-card category-card--${(index % 4) + 1}`}>
                                <span className="category-count">{String(category.count).padStart(2, '0')}</span>
                                <h3>{category.name}</h3>
                                <p>{category.note}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="process-panel">
                    <div className="section-heading section-heading--left">
                        <p className="section-kicker">Pit crew flow</p>
                        <h2 className="section-title">Сервисный маршрут выстроен как короткий, уверенный сценарий.</h2>
                    </div>

                    <div className="process-list">
                        {processSteps.map((item) => (
                            <article key={item.step} className="process-card">
                                <span className="process-step">{item.step}</span>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="process-summary">
                        <strong>Быстрый ориентир.</strong>
                        <p>
                            Минимальная цена стартует от ${priceFloor}, а общий складской запас уже покрывает
                            {` ${inventoryCount || 558}+ `}
                            единиц расходников и базовых узлов.
                        </p>
                    </div>
                </div>
            </section>

            <section className="reviews-section">
                <div className="section-heading">
                    <p className="section-kicker">Workshop voices</p>
                    <h2 className="section-title">Даже отзывы встроены в страницу как часть общей композиции.</h2>
                </div>

                <div className="reviews-grid">
                    {reviewCards.map((review, index) => (
                        <article key={review.author} className={`review-card review-card--${index + 1}`}>
                            <span className="review-index">0{index + 1}</span>
                            <p>{review.quote}</p>
                            <div className="review-author">{review.author}</div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-shape cta-shape--left" aria-hidden="true" />
                <div className="cta-shape cta-shape--right" aria-hidden="true" />

                <p className="cta-kicker">Ready to tune the shop floor?</p>
                <h2>Откройте каталог и соберите заказ как выверенный сетап перед выездом.</h2>
                <p>
                    От расходников до оптики и элементов двигателя: теперь магазин выглядит богаче, движется мягче и
                    чувствуется как полноценный бренд, а не набор случайных блоков.
                </p>

                <div className="cta-actions">
                    <Link to="/catalog" className="cta-button cta-button--wide">
                        Перейти в каталог
                    </Link>
                    <Link to="/cart" className="ghost-button ghost-button--light">
                        Открыть корзину
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
