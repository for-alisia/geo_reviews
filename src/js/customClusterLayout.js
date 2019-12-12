import layoutCluster from './layoutCluster';
import dataStorage from './storage';

function createCustomClusterLayout(map, balloon) {
    const customClusterLayout = ymaps.templateLayoutFactory.createClass(
        layoutCluster,
        {
            // Build a new layout, add eventListeners and set a position
            build() {
                customClusterLayout.superclass.build.call(this);

                this._element = this.getParentElement().querySelector(
                    '.cluster-balloon-cont'
                );

                this.applyElementOffset();
                this.createCarousel();
                this._element
                    .querySelector('#close-cluster-balloon')
                    .addEventListener('click', this.onCloseClick.bind(this));

                for (let titleBlock of this._element.querySelectorAll(
                    '.cluster-title'
                )) {
                    titleBlock.addEventListener(
                        'click',
                        this.onTitleClick.bind(this)
                    );
                }

                this._element
                    .querySelector('.cluster-footer')
                    .addEventListener('click', this.onChangeReview.bind(this));
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
                    .querySelector('#close-cluster-balloon')
                    .removeEventListener('click', this.onCloseClick);
                customClusterLayout.superclass.clear.call(this);
            },
            // Close balloon
            onCloseClick: function(e) {
                e.preventDefault();
                this.events.fire('userclose');
            },

            // Create balloon with all reviews by click on the title
            onTitleClick: function(e) {
                const title = e.target.textContent;
                this.events.fire('userclose');
                const allReviewsByTitle = dataStorage.getDataByTitle(title);
                balloon = map.balloon.open(map.getCenter(), {
                    properties: { reviews: allReviewsByTitle }
                });
            },

            // Create tabs layout for the reviews
            createCarousel: function() {
                const qty = [
                    ...this._element.querySelectorAll('.cluster-balloon')
                ].length;
                const fragment = document.createDocumentFragment();
                const firstElem = this._element.querySelector(
                    '.cluster-balloon'
                );
                const container = this._element.querySelector(
                    '.cluster-footer'
                );

                for (let i = 0; i < qty; i++) {
                    const block = document.createElement('div');
                    block.classList.add('car-block');
                    block.textContent = i + 1;
                    if (i === 0) {
                        block.classList.add('active');
                    }
                    fragment.appendChild(block);
                }

                firstElem.style.zIndex = 10;

                container.appendChild(fragment);
            },
            // Change the review by the click on it's number
            onChangeReview: function(e) {
                if (e.target.classList.contains('car-block')) {
                    const currentElem = e.target;
                    const allElem = [
                        ...this._element.querySelectorAll('.car-block')
                    ];
                    const index = allElem.findIndex(
                        item => item == currentElem
                    );
                    const reviews = [
                        ...this._element.querySelectorAll('.cluster-balloon')
                    ];
                    allElem.forEach(elem => {
                        elem.classList.remove('active');
                    });
                    reviews.forEach(review => {
                        review.style.zIndex = 1;
                    });
                    reviews[index].style.zIndex = 10;
                    currentElem.classList.add('active');
                }
            }
        }
    );

    return customClusterLayout;
}

export default createCustomClusterLayout;
