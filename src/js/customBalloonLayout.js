import layoutTemplate from './layout';
import dataStorage from './storage';

function createCustomBalloonLayout(clusterer) {
    const customBalloonLayout = ymaps.templateLayoutFactory.createClass(
        layoutTemplate(),
        {
            // Create balloon, add listeners, set position of the balloon
            build() {
                customBalloonLayout.superclass.build.call(this);

                this._element = this.getParentElement().querySelector('.card');
                const addBtn = this._element.querySelector('#add-review');

                this.applyElementOffset();
                this._element
                    .querySelector('#close-balloon')
                    .addEventListener('click', this.onCloseClick.bind(this));

                addBtn.addEventListener('click', this.addReview.bind(this));
            },
            // Position of the balloon (a litle bit left and top, then a point)
            applyElementOffset: function() {
                this._element.style.left = 20 + 'px';
                this._element.style.top =
                    -(this._element.offsetHeight / 2) - 50 + 'px';
            },
            // Clear all events after ballooon closed
            clear() {
                this._element
                    .querySelector('#close-balloon')
                    .removeEventListener('click', this.onCloseClick);
                this._element
                    .querySelector('#add-review')
                    .removeEventListener('click', this.addReview);
                customBalloonLayout.superclass.clear.call(this);
            },
            // Close balloon
            onCloseClick: function(e) {
                e.preventDefault();
                this.events.fire('userclose');
            },

            // Add new review
            addReview: function(e) {
                e.preventDefault();
                const form = this._element.querySelector('#form-review');
                const title = this._element.querySelector('#address');

                // if new review contains data, add it to the map and to the storage
                if (validation(form)) {
                    const newReview = createReviewObject(form, title);
                    addReviewToPage.call(this, newReview);
                    clearForm(form);

                    ymaps.geocode(title.textContent).then(res => {
                        const currentCoords = res.geoObjects
                            .get(0)
                            .geometry.getCoordinates();
                        const newPoint = new ymaps.Placemark(
                            currentCoords,
                            {
                                reviews: newReview
                            },
                            {
                                hideIconOnBalloonOpen: false
                            }
                        );
                        clusterer.add(newPoint);
                    });

                    dataStorage.addData(newReview);
                }
            }
        }
    );

    return customBalloonLayout;
}

// Create review object for adding
function createReviewObject(form, title) {
    const date = new Date();
    const newReview = {};
    newReview.content = [];

    newReview.title = title.textContent;
    newReview.content.push({
        author: form.elements.name.value,
        date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
        place: form.elements.place.value,
        text: form.elements.review.value
    });

    return newReview;
}

// Validate form
function validation(form) {
    let isValid = true;
    const formChildren = form.children;

    for (let element of formChildren) {
        if (element.hasAttribute('required')) {
            if (!element.value) {
                isValid = false;
            }
        }
    }

    return isValid;
}

// Clear form
function clearForm(form) {
    form.elements.name.value = '';
    form.elements.place.value = '';
    form.elements.review.value = '';
}

// Add new review to the page
function addReviewToPage(review) {
    const parent = this._element.querySelector('.card-reviews');
    const defaultText = this._element.querySelector('#default-text');
    const newReview = document.createElement('div');
    const contentReview = ` 
        <p class="review-head">
            <span class="review-name">${review.content[0].author}</span>
            <span class="review-place">${review.content[0].place}</span>
            <span class="review-time">${review.content[0].date}</span>
        </p>
        <p class="review-body">${review.content[0].text}</p>`;
    newReview.classList.add('card-one-review');
    newReview.innerHTML = contentReview;
    if (defaultText) {
        defaultText.remove();
    }
    parent.appendChild(newReview);
}

export default createCustomBalloonLayout;
