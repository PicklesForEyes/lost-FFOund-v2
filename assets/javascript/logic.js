$(document).ready(function(){

function fadingOut () {
    $('#dump').fadeOut();
    $('#human-contact').fadeOut();
    $('#animal-overlays').fadeOut();
    $('#band-search').fadeIn();
}



  $('#band-search-button').click(function() {
    fadingOut();
  });

$('#home').click(function() {
  $('#human-contact').fadeOut();
  $('#band-search').fadeOut();
  $('#animal-overlays').fadeIn();
  $('#dump').fadeIn();
});
$('#contact-human').click(function() {
  $('#band-search').fadeOut();
  $('#animal-overlays').fadeOut();
  $('#dump').fadeOut();
  $('#human-contact').fadeIn();
});

$('.slick-slide').imagesLoaded(function() {
  $('#footer').show();
});

  var keyWord = '';

  $(document).on('keydown', function(event){
    if (event.which === 13){
      event.preventDefault();
      keyWord = $('.submit').val().trim();
      fadingOut();  

      if(keyWord.length > 0){
        drawArtist();
        $('.submit').val('')
      }
    }
  })

  $(document).on('click', '.sim-div', function(event){
    event.preventDefault();
    keyWord = $(this).attr('data-name');
    drawArtist();
  })

  function drawArtist(){
    console.log(keyWord);
    $('#events-table').empty();
    $('#similar').empty();
    var lastURL = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&autocorrect=1&artist=' + keyWord + '&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json';

    var bandsURL = 'https://rest.bandsintown.com/artists/' + keyWord + '/events?app_id=lost&ffound';

    $.ajax({
      url: lastURL,
      method: 'GET'
    }).done(function(result){
      console.log(result);

      $('#band-name').text(result.artist.name);
      $('#band-bio').html(result.artist.bio.summary)
      $('#band-img').attr('src', result.artist.image[4]['#text'])
      $('#band-img').css('visibility', 'visible');


      for(var i = 0; i < result.artist.similar.artist.length; i++){
        var simName = $('<span class="sim-artist">');
        var simImg = $('<img class="sim-img">');
        var simDiv = $('<div class="sim-div">');
          var newName = result.artist.similar.artist[i].name;
          var newImg = result.artist.similar.artist[i].image[1]['#text'];
          simName.html(newName);
          simImg.attr('src', newImg);
          simDiv.attr('data-name', newName);
        simDiv.append(simImg);
        simDiv.append(simName);

        $('#similar').append(simDiv);
        $('#similar').append('<br>');

      }

      $.ajax({
        url: bandsURL,
        method: 'GET'
      }).done(function(result){
        console.log(result);
        if(result.length > 5){
          for(var i = 0; i < 5; i++){

            $('#events-table').append(
              '<tr><td>' + moment(result[i].datetime).format('MMM Do, YYYY h:mma') + 
              '</td><td>' + result[i].venue.name + 
              '</td><td>' + result[i].venue.city + ', ' + result[i].venue.region + ', ' + result[i].venue.country + 
              '</td><td><a target="_blank" href=' + result[i].offers[0].url + '>' + "Get Tickets!" + '</a></td></tr>'
              );
          }
        } else {
          for(var i = 0; i < result.length; i++){

            $('#events-table').append(
              '<tr><td>' + moment(result[i].datetime).format('MMM Do, YYYY h:mma') + 
              '</td><td>' + result[i].venue.name + 
              '</td><td>' + result[i].venue.city + ', ' + result[i].venue.region + ', ' + result[i].venue.country + 
              '</td><td><a target="_blank" href=' + result[i].offers[0].url + '>' + "Get Tickets!" + '</a></td></tr>'
              );
          }
        }
      })
    })
  }

  function scrollerApi(){
    var queryURL = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json&limit=5';

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).done(function(res){

      for(var i = 0; i < res.artists.artist.length; i++){
        var trending = $('<div>')
        var artistImg = $('<img>');
        var artistName = res.artists.artist[i].name

        artistImg.attr('src',res.artists.artist[i].image[4]['#text']);
        trending.append(artistImg);
        $('#dump').append(trending);
      }
    $('#dump').slick({
      dots: false,
      infinite: true,
      speed: 700,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1
  });
    })
  }

  scrollerApi();

// Firebase stufffffff

  var config = {
    apiKey: "AIzaSyDRpGzVh43wHxEAiH-I6commqUWlJe_Cb8",
    authDomain: "lostnfffound.firebaseapp.com",
    databaseURL: "https://lostnfffound.firebaseio.com",
    projectId: "lostnfffound",
    storageBucket: "lostnfffound.appspot.com",
    messagingSenderId: "375907715461"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#contact-form-button").on('click', function (){
    event.preventDefault();
    var firstName = $("#firstname").val().trim();
    var lastName = $("#lastname").val().trim();
    var comment = $("#subject").val().trim();

    database.ref().push({
      FirstName: firstName,
      LastName: lastName,
      CommentBody: comment

    })


  })
  
  var trashValue;

  database.ref().on('value', function(snapshot){
    trashValue = snapshot.numChildren();
    $('#trashcan').text(trashValue);
  })


})
