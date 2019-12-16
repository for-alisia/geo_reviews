const layoutCluster = `
<div class="cluster-balloon-cont">
<div id="close-cluster-balloon"><i class="fas fa-times"></i></div>
{% for geoObject in properties.geoObjects %}
<div class="cluster-balloon">
    <div class="cluster-title">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{geoObject.properties.reviews.title}}</span>
        
    </div>
    <div class="cluster-container">
        <div class="cluster-card">
            <div class="cluster-header">
                <div class="cluster-author">{{geoObject.properties.reviews.content[0].author}}</div>
                <div class="cluster-place">{{geoObject.properties.reviews.content[0].place}}</div>
                <div class="cluster-date">{{geoObject.properties.reviews.content[0].date}}</div>
            </div>
            <div class="cluster-text">{{geoObject.properties.reviews.content[0].text}}</div>
            <div class="btn-cont"><button class="btn">Добавить отзыв</button></div>
        </div>        
    </div>    
</div>
{% endfor %}
<div class="cluster-footer"></div>
</div>
`;

export default layoutCluster;
