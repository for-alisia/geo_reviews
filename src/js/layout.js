function layoutTemplate() {
    let template = `
    <div class="card">
    <div class="card-header">
        <div class="card-info">
            <i class="fas fa-map-marker-alt"></i>
            <span id="address" class="card-info">{{properties.reviews.title}}</span>
        </div>
        <div id="close-balloon"><i class="fas fa-times"></i></div>
    </div>
    <div class="card-container">
        <div class="card-reviews">
        {% if properties.reviews.content == undefined %}
            <div id="default-text">Отзывов пока нет...</div>
        {% else %}
        {% for item in properties.reviews.content %}
            <div class="card-one-review">
                <p class="review-head">
                    <span class="review-name">{{item.author}}</span>
                    <span class="review-place">{{item.place}}</span>
                    <span class="review-time">{{item.date}}</span>
                </p>
                <p class="review-body">{{item.text}}</p>
            </div>
        {% endfor %}
        {% endif %}
        </div>
        <form id="form-review" class="card-form">
            <h3 class="add-review-header">
                Ваш отзыв
            </h3>
            <input
                type="text"
                name="name"
                placeholder="Ваше имя" required
            />
            <input
                type="text"
                name="place"
                placeholder="Укажите место" required
            />
            <textarea
                name="review"
                rows="5"
                placeholder="Поделитесь впечатлениями" required
            ></textarea>
            <button id="add-review">Добавить</button>
        </form>
    </div>
</div>`;

    return template;
}

export default layoutTemplate;
