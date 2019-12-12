class DataStorage {
    constructor() {
        this.reviews = [];
        // add data from localStorage
        this.init();
    }

    init() {
        if (localStorage.getItem('reviews')) {
            const reviewsLocal = JSON.parse(localStorage.getItem('reviews'));
            this.reviews = reviewsLocal;
        }
    }

    addData(review) {
        // Add new review fnd refresh the localStorage data
        this.reviews.push(review);
        this.saveDataInStorage();
    }

    getDataByTitle(title) {
        // Create object with all reviews by address (to put it into balloon then)
        const res = {};
        res.title = title;
        res.content = [];

        this.reviews.forEach(element => {
            if (element.title === res.title) {
                res.content.push(...element.content);
            }
        });
        return res;
    }

    saveDataInStorage() {
        localStorage.setItem('reviews', JSON.stringify(this.reviews));
    }
}

const dataStorage = new DataStorage();
export default dataStorage;

/*
reviews: [{
    title: '',
    content: [{
        text: '',
        place: ''.
        author: '',
        date: ''
    }, {}]
}, {}]

*/
