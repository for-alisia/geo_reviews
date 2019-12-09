import './plugins';
import '../img/map_img.jpg';
import '../css/style.css';
import '../img/logo.png';
import '../img/logo_white.png';
import layoutTemplate from './layout';

ymaps.ready(function() {
    const mainMap = new ymaps.Map('map', {
        center: [57.980872, 56.240547],
        zoom: 12,
        controls: ['zoomControl']
    });

    // Create Custom Ballon
    const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        layoutTemplate(),
        {
            // Build a new layout, add eventListeners and set a position
            build() {
                BalloonContentLayout.superclass.build.call(this);

                this._element = this.getParentElement().querySelector('.card');
                const addBtn = this._element.querySelector('#add-review');

                this.applyElementOffset();
                this._element
                    .querySelector('#close-balloon')
                    .addEventListener('click', this.onCloseClick.bind(this));

                addBtn.addEventListener('click', this.addReview.bind(this));
            },
            // Define a position of balloon
            applyElementOffset: function() {
                this._element.style.left =
                    -(this._element.offsetWidth / 2) + 'px';
                this._element.style.top =
                    -(this._element.offsetHeight / 2) + 'px';
            },
            // Clear all events after ballooon closed
            clear() {
                this._element
                    .querySelector('#close-balloon')
                    .removeEventListener('click', this.onCloseClick.bind(this));
                BalloonContentLayout.superclass.clear.call(this);
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
                //const currentCoords = this._data.geoObject.geometry._coordinates;

                if (validation(form)) {
                    const newReview = createReviewObject(currentCoords, form);
                    addReviewToPage.call(this, newReview);
                    clearForm(form);
                }
            }
        }
    );

    mainMap.options.set({
        balloonLayout: BalloonContentLayout
    });

    mainMap.events.add('click', e => {
        const coords = e.get('coords');
        const geoCoder = ymaps.geocode(coords);
        geoCoder.then(res => {
            const address = res.geoObjects.get(0).properties._data.text;
            const balloon = new ymaps.Balloon(mainMap);
            balloon.options.setParent(mainMap.options);

            balloon.open(coords, { place: address });
            //mainMap.balloon.open(coords, { balloonContentLayout: BalloonContentLayout } );
        });
    });
});

// Create review object for adding
function createReviewObject(coords, form) {
    const date = new Date();
    const newReview = {};

    newReview.coords = coords;
    newReview.reviews = {
        author: form.elements.name.value,
        date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
        place: form.elements.place.value,
        text: form.elements.review.value
    };

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
    const newReview = document.createElement('div');
    const contentReview = ` 
        <p class="review-head">
            <span class="review-name">${review.reviews.author}</span>
            <span class="review-place">${review.reviews.place}</span>
            <span class="review-time">${review.reviews.date}</span>
        </p>
        <p class="review-body">${review.reviews.text}</p>`;
    newReview.classList.add('card-one-review');
    newReview.innerHTML = contentReview;
    parent.appendChild(newReview);
}
