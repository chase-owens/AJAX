(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const imageRequest = new XMLHttpRequest();
        imageRequest.onload = addImage;
        imageRequest.onerror = function(err) {
          requestError(err, 'image');
        }
        imageRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imageRequest.setRequestHeader('Authorization', 'Client-ID 4c49476cfc0e384b34f077fe63d4d5d85d49f42147c9f20a4e72af3f945ef804');
        imageRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e01307aa568c4ee89f41a0ddfd5b4fa3`);
        articleRequest.send();
    });


    function addImage() {
      let htmlContent = '';
      const data = JSON.parse(this.responseText);
      const firstImage = data.results[0];

      htmlContent = `<figure>
        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
      </figure>`;

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
      let htmlContent = '';
      const data = JSON.parse(this.responseText);

      if (data.response && data.response.docs && data.response.docs.length > 1) {
        htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
              <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
              <p>${article.snippet}</p>
            </li>`
          ).join('') + '</ul>';
      } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>';
      }
      responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
})();
