import './plugins';
import '../img/map_img.jpg';
import '../css/style.css';
import '../img/logo.png';
import '../img/logo_white.png';
import createCustomBalloonLayout from './customBalloonLayout';
import createCustomClusterLayout from './customClusterLayout';
import dataStorage from './storage';

ymaps.ready(function() {
    // Create the map (center of the map is in Perm)
    const mainMap = new ymaps.Map('map', {
        center: [57.980872, 56.240547],
        zoom: 12,
        controls: ['zoomControl']
    });
    let balloon;
    const customClusterLayout = createCustomClusterLayout(mainMap, balloon);
    // Create cluster with custom layout
    const clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonLayout: customClusterLayout,
        hideIconOnBalloonOpen: false
    });
    const customBalloonLayout = createCustomBalloonLayout(clusterer);

    mainMap.geoObjects.add(clusterer);
    mainMap.options.set({
        balloonLayout: customBalloonLayout
    });
    // Add points from the localStorage to the map
    dataStorage.reviews.forEach(review => {
        const geocoder = ymaps.geocode(review.title);

        geocoder.then(res => {
            const coords = res.geoObjects.get(0).geometry.getCoordinates();
            const newPoint = new ymaps.Placemark(
                coords,
                {
                    reviews: review
                },
                {
                    hideIconOnBalloonOpen: false
                }
            );
            clusterer.add(newPoint);
        });
    });
    // Open new balloon on click
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
