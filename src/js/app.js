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

    let balloon;
    // Create Custom Ballon
    const BalloonClusterLayout = ymaps.templateLayoutFactory.createClass(
        `<div class="card">
            <div id="close-balloon"><i class="fas fa-times"></i></div>
            {% for geoObject in properties.geoObjects %}
            <div class="card-reviews">
                <div class="link"><span id="cluster-title">{{geoObject.properties.reviews.title}}</span></div>            
                <p class="review-body">{{geoObject.properties.reviews.reviews.text}}</p>                   
            {% endfor %}
        </div>`,
        {
            // Build a new layout, add eventListeners and set a position
            build() {
                BalloonClusterLayout.superclass.build.call(this);

                this._element = this.getParentElement().querySelector('.card');

                this.applyElementOffset();
                this._element
                    .querySelector('#close-balloon')
                    .addEventListener('click', this.onCloseClick.bind(this));

                this._element
                    .querySelector('#cluster-title')
                    .addEventListener('click', this.onTitleClick.bind(this));
            },
            // Define a position of balloon
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
                BalloonClusterLayout.superclass.clear.call(this);
            },
            // Close balloon
            onCloseClick: function(e) {
                e.preventDefault();
                this.events.fire('userclose');
            },

            // Create balloon with all reviews by title
            onTitleClick: function(e) {
                this.events.fire('userclose');
                balloon = mainMap.balloon.open(mainMap.getCenter(), {
                    properties: { reviews: { title: 'testData' } }
                });
            }
        }
    );

    // Create clusterer
    const clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonLayout: BalloonClusterLayout,
        hideIconOnBalloonOpen: false
    });

    mainMap.geoObjects.add(clusterer);

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
                const currentCoords =
                    this.getData().coords ||
                    this.getData().geoObject.geometry._coordinates;
                const title = this._element.querySelector('#address');
                //console.log(currentCoords);

                if (validation(form)) {
                    const newReview = createReviewObject(form, title);
                    //console.log(newReview);
                    addReviewToPage.call(this, newReview);
                    clearForm(form);
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
                    console.log(clusterer);
                }
            }
        }
    );

    mainMap.options.set({
        balloonLayout: BalloonContentLayout
    });

    //  Open balloon on user's click
    mainMap.events.add('click', e => {
        if (balloon) {
            balloon.close();
        }

        const coords = e.get('coords');
        const geoCoder = ymaps.geocode(coords);

        geoCoder.then(res => {
            const address = res.geoObjects.get(0).properties._data.text;
            balloon = new ymaps.Balloon(mainMap);
            balloon.options.setParent(mainMap.options);
            balloon.setData({
                properties: { reviews: { title: address } },
                coords: coords
            });
            balloon.open(coords);
        });
    });
});

// Create review object for adding
function createReviewObject(form, title) {
    const date = new Date();
    const newReview = {};

    newReview.title = title.textContent;
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
    const defaultText = this._element.querySelector('#default-text');
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
    if (defaultText) {
        defaultText.remove();
    }
    parent.appendChild(newReview);
}
