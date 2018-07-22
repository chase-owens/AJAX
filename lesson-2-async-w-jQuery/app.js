/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
          url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
          headers: {
            Authorization: 'Client-ID 4c49476cfc0e384b34f077fe63d4d5d85d49f42147c9f20a4e72af3f945ef804'
          }
        }).done(addImage)
        .fail(function(err) {
          requestError(err, 'image');
        });

        $.ajax({
          url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e01307aa568c4ee89f41a0ddfd5b4fa3`
        }).done(addArticles)
        .fail(function(err) {
          requestError(err, 'articles');
        })
    });

    function addImage(data) {
      htmlContent = '';

      if (data && data.results && data.results.length > 1) {
        const firstImage = data.results[0];
        htmlContent = `<figure>
          <img src="${firstImage.urls.regular}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
      } else {
        htmlContent = '<div class="error-no-image">No images available</div>'
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(data) {
      let htmlContent = '';

      if (data.response && data.response.docs && data.response.docs.length > 1) {
        const articles = data.response.docs;
        htmlContent = '<ul>' + articles.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
          </li>`
        ).join('') + '</ul>';
      } else {
        htmlContent = 'div class="error-no-articles">No articles available</div>';
      }
      responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning"></p>`)
    }

})();
