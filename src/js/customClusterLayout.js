import layoutCluster from './layoutCluster';

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

                this._element
                    .querySelector('#cluster-title')
                    .addEventListener('click', this.onTitleClick.bind(this));
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

            // Create balloon with all reviews by title
            onTitleClick: function(e) {
                this.events.fire('userclose');
                balloon = map.balloon.open(map.getCenter(), {
                    properties: { reviews: { title: 'testData' } }
                });
            },

            // Create carousel layout
            createCarousel: function() {
                const qty = [
                    ...this._element.querySelectorAll('.cluster-balloon')
                ].length;
                const fragment = document.createDocumentFragment();
                const container = this._element.querySelector(
                    '.cluster-footer'
                );

                console.log(qty);

                for (let i = 0; i < qty; i++) {
                    const block = document.createElement('div');
                    block.classList.add('car-block');
                    block.textContent = i + 1;
                    if (i === 0) {
                        block.classList.add('active');
                    }
                    fragment.appendChild(block);
                    console.log(i);
                }

                container.appendChild(fragment);
            },

            onChangeReview: function(e) {
                const currentElem = e.target;
                const allElem = [
                    ...this._element.querySelectorAll('.car-block')
                ];
                const index = allElem.findIndex(item => item == currentElem);
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
    );

    return customClusterLayout;
}

export default createCustomClusterLayout;
