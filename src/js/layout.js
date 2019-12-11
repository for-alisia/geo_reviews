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

        <div id="default-text">No reviews</div>
        {% for review in properties.reviews %}
            <div class="card-one-review">
                <p class="review-head">
                    <span class="review-name">{{review.author}}</span>
                    <span class="review-place">{{review.place}}</span>
                    <span class="review-time">{{review.date}}</span>
                </p>
                <p class="review-body">{{review.text}}</p>
            </div>
            {% endfor %}
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
