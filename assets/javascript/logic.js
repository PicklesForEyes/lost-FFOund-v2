$(document).ready(function(){

  // console.log(moment().format())

  var keyWord = '';

  $(document).on('keydown', function(event){
    if (event.which === 13){
      event.preventDefault();
      keyWord = $('#submit').val().trim();

      if(keyWord.length > 0){
        drawArtist();
      }
    }
  })

  $(document).on('click', '.sim-artist', function(event){
    event.preventDefault();
    keyWord = $(this).attr('data-name');
    drawArtist();
  })

  function drawArtist(){

    $('#events-table').empty();
    $('#similar').empty();
    var lastURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + keyWord + '&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json';

    var bandsURL = 'https://rest.bandsintown.com/artists/' + keyWord + '/events?app_id=lost&ffound';

    $.ajax({
      url: lastURL,
      method: 'GET'
    }).done(function(result){
      console.log(result);

      // var artist = $('<div class="artist">');
      $('#band-name').text(result.artist.name);
      $('#band-bio').html(result.artist.bio.summary)
      $('#band-img').attr('src', result.artist.image[4]['#text'])
      // var image = $('<img>');
      //   image.attr('src', result.artist.image[4]['#text'])
      //   name.text(result.artist.name);
      //   bio.html(result.artist.bio.summary);
      //   artist.append(image, name, bio);
      // $('#content-dump').append(artist)

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
            // console.log(result[i]);
            // console.log(moment(result[i].datetime).format('MMM-Do-YYYY hh:ma'))
            // var eventLink = $('<a class="ticket-link">');
            //   eventLink.attr('href', result[i].offers[0].url);
            // var event = $('<div class="event">');
            // var venue = $('<p>');
            // var location = $('<p>');
            // var datetime = $('<p>' + moment(result[i].datetime).format('MMM Do, YYYY hh:mma') + '</p>')
            //   venue.text(result[i].venue.name);
            //   location.text(result[i].venue.city + result[i].venue.country);
            // event.append(datetime, venue, location);
            // eventLink.append(event)
            // $('.artist').append(eventLink);
            $('#events-table').append(
              '<tr><td>' + result[i].datetime + 
              '</td><td>' + result[i].venue.name + 
              '</td><td>' + result[i].venue.city + ', ' + result[i].venue.country + 
              '</td><td><a>' + result[i].offers[0].url + '</a></td></tr>'
              );
          }
        } else {
          for(var i = 0; i < result.length; i++){
            // console.log(result[i]);
            // console.log(moment(result[i].datetime).format('MMM-Do-YYYY hh:ma'))
            // var eventLink = $('<a class="ticket-link">');
            //   eventLink.attr('href', result[i].offers[0].url);
            // var event = $('<div class="event">');
            // var venue = $('<p>');
            // var location = $('<p>');
            // var datetime = $('<p>' + moment(result[i].datetime).format('MMM Do, YYYY hh:mma') + '</p>')
            //   venue.text(result[i].venue.name);
            //   location.text(result[i].venue.city + result[i].venue.country);
            // event.append(datetime, venue, location);
            // eventLink.append(event)
            // $('.artist').append(eventLink);
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
})