$(document).ready(function(){
  



  var keyWord = '';

  $(document).on('keydown', function(event){
    if (event.which === 13){
      event.preventDefault();
      keyWord = $('#submit').val().trim();

      if(keyWord.length > 0){
        drawArtist();
        $('#submit').val('')
      }
    }
  })

  $(document).on('click', '.sim-artist', function(event){
    event.preventDefault();
    keyWord = $(this).attr('data-name');
    drawArtist();
  })

  function drawArtist(){
    console.log(keyWord);
    $('#events-table').empty();
    $('#similar').empty();
    var lastURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + keyWord + '&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json';

    var bandsURL = 'https://rest.bandsintown.com/artists/' + keyWord + '/events?app_id=lost&ffound';

    $.ajax({
      url: lastURL,
      method: 'GET'
    }).done(function(result){
      console.log(result);

      $('#band-name').text(result.artist.name);
      $('#band-bio').html(result.artist.bio.summary)
      $('#band-img').attr('src', result.artist.image[4]['#text'])


      for(var i = 0; i < result.artist.similar.artist.length; i++){
        var simName = $('<li class="sim-artist">');
          var newName = result.artist.similar.artist[i].name;
          simName.html(newName);
          simName.attr('data-name', newName);

        $('#similar').append(simName)

      }

      $.ajax({
        url: bandsURL,
        method: 'GET'
      }).done(function(result){
        console.log(result);
        if(result.length > 5){
          for(var i = 0; i < 5; i++){

            $('#events-table').append(
              '<tr><td>' + result[i].datetime + 
              '</td><td>' + result[i].venue.name + 
              '</td><td>' + result[i].venue.city + ', ' + result[i].venue.country + 
              '</td><td><a>' + result[i].offers[0].url + '</a></td></tr>'
              );
          }
        } else {
          for(var i = 0; i < result.length; i++){

            $('#events-table').append(
              '<tr><td>' + result[i].datetime + 
              '</td><td>' + result[i].venue.name + 
              '</td><td>' + result[i].venue.city + ', ' + result[i].venue.country + 
              '</td><td><a>' + result[i].offers[0].url + '</a></td></tr>'
              );
          }
        }
      })
    })
  }

  function testApi(){
    var queryURL = 'http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json&limit=5';

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).done(function(res){
  
      for(var i = 0; i < res.artists.artist.length; i++){
        var trending = $('<div>')
        var artistImg = $('<img>');
        var artistName = res.artists.artist[i].name
        
        artistImg.attr('src',res.artists.artist[i].image[4]['#text']);
        artistImg.addClass("trending")
        artistImg.attr('data-name', artistName)
        // $('#dump').append(trending);
        trending.append(artistImg);
        $('#dump').append(trending);
      }
    $('#dump').slick({
      dots: true,
      infinite: true,
      speed: 700,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1
  });
    })
  }

  testApi();


  // $(document).on('click','.trending', function() {
  //   keyWord = $(this).attr('data-name');
  //   window.location.href = 'bio.html';
  //   console.log(keyWord);
  //   drawArtist();
  // })  
})
