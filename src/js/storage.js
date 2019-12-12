class DataStorage {
    constructor() {
        this.reviews = [];
        this.init();
    }

    init() {
        if (localStorage.getItem('reviews')) {
            const reviewsLocal = JSON.parse(localStorage.getItem('reviews'));
            this.reviews = reviewsLocal;
        }
    }

    addData(review) {
        this.reviews.push(review);
        this.saveDataInStorage();
    }

    getDataByTitle(title) {
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
