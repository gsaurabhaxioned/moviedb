$(document).ready(function(){
    $(".hamburger").click(function () {
        $(".menus").toggleClass("headermenus-show");
        $(".menus").toggleClass("headermenus");
        $(this).toggleClass("cross");
    });

    let api_key ="8d6f976a3d568729504eb85502e74226";
    $(".slider").html("");

    // function calls to display movies according to categories 
    if($(".movie-category").length > 0){
    displayMovies("top_rated","top-rated-movies");
    displayMovies("popular","most-popular-movies");
    displayMovies("now_playing","now-playing-movies");
    displayMovies("upcoming","upcoming-movies");
    }

     // function calls to display tv shows according to categories 
    if($(".tvshow-category").length > 0) {
      displayTvshows("on_the_air","on-air");
      displayTvshows("airing_today","airing-today");
    }

// initialising variables for login form 
    let loginform = $('.loginform'),
    username = $('.username'),
    password = $('.password'),
    usererror = $('.usernameerror'),
    passerror = $('.passworderror');
localStorage.setItem('username1', 'saurabh96');
localStorage.setItem('password1', '123456');
console.log(username);

//blur validation
username.focusout(() => {
    usererror.html("");
    passerror.html("");
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    if (username.val().length === 0) {
        usererror.html("please enter username");
        $('.username').addClass("errorbox");
    }
});

password.focusout(() => {
    usererror.html("");
    passerror.html("");
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    if (password.val().length === 0) {
        passerror.html("please enter password");
        $('.password').addClass("errorbox");
    }
})

//login validation
loginform.submit((event) => {
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    event.preventDefault();

    usererror.html("");
    passerror.html("");
    let user1 = localStorage.getItem('username1'),
        pass1 = localStorage.getItem('password1');
    event.preventDefault();

    if (username.val().length === 0) {
        usererror.html("please enter username");
        $('.username').addClass("errorbox");
    } else if (password.val().length === 0) {
        passerror.html("please enter password")
        $('.password').addClass("errorbox");
    } else if (username.val() === user1 && password.val() === pass1) {
        localStorage.setItem('validuser', 'true');
        window.open('homepage.html');
    } else {
        passerror.html("invalid username or password");
    }
})

// slick slider code 

$('.slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });
})

// function to display movies according to categories
function displayMovies(category,classname){
  let api_key ="8d6f976a3d568729504eb85502e74226";
    $.ajax({
      url :"https://api.themoviedb.org/3/movie/"+category+"?api_key="+api_key+"&language=en-US&page=1",
      type :"GET",
      success :(data)=>{
       let result = data.results;
        result.forEach(i=>{
          $("."+classname+" .slider").slick('slickAdd',`
          <div class="movie-content ">
          <figure>
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </figure>
          <div class="user-actions">
              <span class="rate-movie">rate us</span>
              <button class="addto-watchlist">
                  add to Watchlist
              </button>
          </div>
      </div>
          `);
        })

        $(".slider").slick();
      },
      error: (error)=>{
        alert("something went wrong");
        console.log(error);
      }

    });

}

// function to tv shows according to categories
function displayTvshows(category,classname){
  let api_key ="8d6f976a3d568729504eb85502e74226";
    $.ajax({
      url :" https://api.themoviedb.org/3/tv/"+category+"?api_key="+api_key+"&language=en-US&page=1",
      type :"GET",
      success :(data)=>{
       let result = data.results;
        result.forEach(i=>{
          $("."+classname+" .slider").slick('slickAdd',`
          <div class="movie-content ">
          <figure>
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </figure>
          <div class="user-actions">
              <span class="rate-movie">rate us</span>
              <button class="addto-watchlist">
                  add to Watchlist
              </button>
          </div>
      </div>
          `);
        })

        $(".slider").slick();
      },
      error: (error)=>{
        alert("something went wrong");
        console.log(error);
      }

    });

}



















