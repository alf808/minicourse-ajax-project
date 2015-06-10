// use strict';
function loadData() {

    var $body = $('body');
    // var $wikiHeaderElem = $('#wikipedia-header');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var addressStr = streetStr + ", " + cityStr;
    $greeting.text("You want to live here? " + addressStr);

    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + addressStr + "";
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');    // YOUR CODE GOES HERE!

    // New York Times AJAX request for articles
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=';
    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        }

    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Wikipedia AJAX request for articles
    var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text("FAIL");
    }, 8000);

    var wikiUrl = 'http://de.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    $.ajax({url: wikiUrl,
      dataType: "jsonp",
      success: function(response){

        // $wikiElem.text('Wikipedia Articles About ' + cityStr);
// console.log(response);
        var articleList = response[1];
        for (var i = 0; i < articleList.length; i++) {
            var articleStr = articleList[i];
            var url = 'http://de.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li>'+
                '<a target=_new href="'+url+'">'+url+'</a>'+
                // '<p>' + article.snippet + '</p>'+
            '</li>');
        }
        clearTimeout(wikiRequestTimeout);

    }
  });

    // .error(function(e){
    //     $wikiHeaderElem.text('Wikipedia Links Could Not Be Loaded');
    // });

    return false;
}

$('#form-container').submit(loadData);

// loadData();
