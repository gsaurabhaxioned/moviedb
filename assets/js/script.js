$(document).ready(function () {

  // code for hamburger icon 

  $(".hamburger").click(() => {
    $(".menus").toggleClass("headermenus-show");
    $(".page-blur").toggleClass("page-show");
    $(".hamburger").toggleClass("cross");
  });

  let api_key = "8d6f976a3d568729504eb85502e74226";
  $(".slider").html("");

  // function calls to display movies according to categories 

  if ($(".movie-category").length > 0) {
    displayMovies("top_rated", "top-rated-movies");
    displayMovies("popular", "most-popular-movies");
    displayMovies("now_playing", "now-playing-movies");
    displayMovies("upcoming", "upcoming-movies");
  }

  // function calls to display tv shows according to categories 

  if ($(".tvshow-category").length > 0) {
    displayTvshows("on_the_air", "on-air");
    displayTvshows("airing_today", "airing-today");
  }

  // function call to display trending shows

  if ($(".trending-news").length > 0) {
    displayNews("trending-news");
  }

  // initialising variables for login form 

  let loginform = $('.loginform'),
    username = $('.username'),
    password = $('.password'),
    usererror = $('.usernameerror'),
    passerror = $('.passworderror');
  localStorage.setItem('username1', 'saurabh96');
  localStorage.setItem('password1', '123456');

  // validation on input boxes focusout

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
    }
    if (password.val().length === 0) {
      passerror.html("please enter password")
      $('.password').addClass("errorbox");
    } else if (username.val() === user1 && password.val() === pass1) {
      localStorage.setItem('validuser', true);
      window.location.href = 'homepage.html';
    } else {
      passerror.html("invalid username or password");
    }
  })

  //js code to check is user logged in?

  let valid = localStorage.getItem('validuser');
  if (!($(".login-page").length > 0)) {
    if (!valid) {
      window.location.href = 'index.html';
    }
  } else {
    if (valid) {
      if (($(".login-page").length > 0)) {
        window.location.href = "homepage.html";
      }
      window.history.back();
    }
  }

  //js code for loggout functionality

  $('.logout').click(() => {
    localStorage.removeItem("validuser");
    window.location.href = 'index.html';
  });

  // js code for search functionality 

  $(".search-button").click(() => {
    if ($(".search-field").val().length > 0) {
      $(".search-button").toggleClass("closeresult");
      $(".search-result").toggleClass("show-flex");
      showresults();
    }
  });

  $(".search-field").keypress((e) => {
    if (e.key === "Enter") {
      $(".search-button").addClass("closeresult");
      $(".search-result").addClass("show-flex");
      showresults();
    }
  })

  // slick slider code 

  if ($(".movie-category").length > 0 || $(".tvshow-category").length > 0) {

    $('.slider').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [{
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
      ]
    });
  }

  //js code for paginated list page 

  if ($(".paginated-list").length > 0) {
    $(".paginated-contents").html("");
    let prev = $(".prev"),
      current = $(".curent"),
      next = $(".next"),
      url = new URL(window.location.href),
      urlstring = url.search.slice(1),
      searchurlparam = new URLSearchParams(urlstring),
      content_type = searchurlparam.get('type'),
      category = searchurlparam.get('cat'),
      page_no = parseInt(searchurlparam.get('page')),
      api_key = "8d6f976a3d568729504eb85502e74226";
    pagination_url = "https://api.themoviedb.org/3/" + content_type + "/" + category + "?api_key=" + api_key + "&language=en-US&page=1";
    if (category === "trending") {
      pagination_url = " https://api.themoviedb.org/3/trending/all/day?api_key=" + api_key + "&language=en-US&page=1";
    }
    $.ajax({
      url: pagination_url,
      type: "GET",
      success: (data) => {
        let result = data.results,
          total_pages = data.total_pages;
        $(".prev").addClass("disabled");
        if (current === total_pages - 1) {
          $(".next").addClass("disabled");
        }

        // functions for accessing next and previous pages in pagination list 

        next.click(() => {
          $(".prev").removeClass("disabled");
          if (page_no < total_pages) {
            page_no = parseInt(page_no + 1);
            $(".current").html(page_no);
            $(".next").on("click");
            gotoPage(page_no, content_type, category);
          } else {
            $(".next").addClass("disabled");
            $(".current").html(total_pages);;
          }
        })

        prev.click(() => {
          $(".next").removeClass("disabled");
          if (page_no !== 1) {
            page_no = parseInt(page_no - 1);
            gotoPage(page_no, content_type, category);
          } else {
            $(".prev").addClass("disabled");
          }
          $(".current").html(page_no);
        });

        if (content_type === "movie") {
          result.forEach(i => {
            $(".paginated-contents").append(`
        <ul class="page-item">
        <li class="page-item-image">
        <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self">
            <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
        </a>
        </li>
        <li>
         <a href="details.html?id=${i.id}&type=${content_type}" title="${i.title}" target="_self" class="pagination-title">${i.title}</a>
         </li>  
         <li>
         <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details">
                view details
         </a>
         </li>
    </ul>
        `);
          })
        }

        if (content_type === "tv") {
          result.forEach(i => {
            $(".paginated-contents").append(`
        <ul class="page-item">
        <li class="page-item-image">
        <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self">
            <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
        </a>
        </li>
        <li> 
        <a href="details.html?id=${i.id}&type=${content_type}" title="${i.name}" target="_self" class="pagination-title">${i.name}</a>
        </li>
        <li>    
        <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details">
            view details
        </a>
        </li>
    </ul>
        `);
          })
        }

        if (category === "trending") {
          result.forEach(i => {
            let media_type = i.media_type;
            if (media_type === "movie") {
              $(".paginated-contents").append(`
              <ul class="page-item">
              <li class="page-item-image">
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self">
                  <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
              </a>
              </li>
              <li>
              <a href="details.html?id=${i.id}&type=movie" title="${i.title}" target="_self" class="pagination-title">${i.title}</a>
              </li> 
              <li> 
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
                      view details
              </a>
              </li>
          </ul>
              `);
            }
            if (media_type === "tv") {
              $(".paginated-contents").append(`
              <ul class="page-item">
              <li class="page-item-image">
              <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self">
                  <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
              </a>
              </li>
              <li>
              <a href="details.html?id=${i.id}&type=tv" title="${i.name}" target="_self" class="pagination-title">${i.name}</a>
              </li>  
              <li>  
              <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="view-details">
                  view details
              </a>
              </li>
          </ul>
                `);
            }
          })
        }
      },
      error: (error) => {
        alert("something went wrong,try again");
      }

    });
  }

  // js code for details page 

  if ($(".details").length > 0) {
    $(".detail-info").html("");
    url = new URL(window.location.href),
      urlstring = url.search.slice(1),
      searchurlparam = new URLSearchParams(urlstring),
      content_id = searchurlparam.get('id'),
      content_type = searchurlparam.get('type'),
      api_key = "8d6f976a3d568729504eb85502e74226";
    $.ajax({
      url: "https://api.themoviedb.org/3/" + content_type + "/" + content_id + "?api_key=" + api_key + "&language=en-US",
      type: "GET",
      success: (data) => {
        if (content_type === "movie") {
          $(".detail-info").append(`
            <h2>${data.title}</h2>
            <figure>
            <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie Poster">
            </figure>
            <h3>${data.tagline}</h3>
            <p class="details-overview">${data.overview}</p>
            <button class="addto-watchlist">add to watchlist</button>
            <span class="item-id">${data.id}</span>
            <span class="rate-us">rate this movie</span>
            <div class="more-details">
            <div class="program-status">
            <p class="status">Status:<span class="text-red">${data.status}</span></p>
            <p class="release-date">Release date: <span class="text-red">${data.release_date}</span></p>
            </div>
            <div class="trp-info">
            <p>Popularity:<span class="text-red">${data.popularity}</span></p>
            <p>Vote Count:<span class="text-red">${data.vote_count}</span></p>
            </div>
            <p class="production-company">Production company: <span class="text-red">${data.production_companies[0].name}</span></p>
            <p class="production-country">Production country: <span class="text-red">${data.production_countries[0].name}</span></p>
            </div>     
          `);
        }
        if (content_type === "tv") {
          $(".detail-info").append(`
          <h2>${data.name}</h2>
          <figure>
          <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie Poster">
          </figure>
          <h3>${data.tagline}</h3>
          <p class="details-overview">${data.overview}</p>
          <button class="addto-watchlist">add to watchlist</button>
          <span class="item-id">${data.id}</span>
          <span class="rate-us">rate this show</span>
          <div class="more-details">
          <div class="program-status">
          <p class="status">Status:<span class="text-red">${data.status}</span></p>
          <p class="first-air-date">First Air date: <span class="text-red">${data.first_air_date}</span></p>
          </div>
          <div class="trp-info">
          <p>Popularity:<span class="text-red">${data.popularity}</span></p>
          <p>Vote Count:<span class="text-red">${data.vote_count}</span></p>
          </div>
          </div>
        `);
          if (data.production_companies[0].name.length > 0 && data.production_countries[0].name.length > 0) {
            $(".detail-info .more-details").append(`
            <p class="production-company">Production company: <span class="text-red">${data.production_companies[0].name}</span></p>
            <p class="production-country">Production country: <span class="text-red">${data.production_countries[0].name}</span></p>
            `);
          }
        }
      },
      error: (error) => {
        alert("something went wrong,try again");
      }

    });
  }

  // js code for rating functionality 

  $(".detail-info").on("click", ".rate-us", () => {
    $(".rating-background").show();
  })

  $(".rating-star").click(function(){
    console.log($(this).prev().val());
  })

  $(".feedback-submit").click((e) => {
    e.preventDefault();
    let starcount = $("input[type='radio']:checked").length;
    if (starcount === 0) {
      $(".submit-empty-response").show();
    } else {
      $(".submit-empty-response").hide();
      $(".submit-response").show();
      $(".rating-background").fadeOut(4000);
    }
  });

  $(".close-rating-box").click(() => {
    $(".rating-background").hide();
  })

  // js code for add to watchlist 

  url = new URL(window.location.href),
    urlstring = url.search.slice(1),
    searchurlparam = new URLSearchParams(urlstring),
    content_type = searchurlparam.get('type');
  $(".detail-info").on('click', '.addto-watchlist', () => {
    let program_id = $(".addto-watchlist").next().html(),
      program_type = content_type;
    let new_data = {
      id: program_id,
      type: program_type
    }
    if (localStorage.getItem("favourites") === null) {
      localStorage.setItem("favourites", "[]");
    }
    let old_data = JSON.parse(localStorage.getItem("favourites"));
    let repeated_id = false;
    old_data.forEach(i => {
      if (i.id === new_data.id) {
        repeated_id = true;
      }
    })
    if (repeated_id === false) {
      old_data.push(new_data);

    }

    localStorage.setItem("favourites", JSON.stringify(old_data));
    alert("added to watchlist");
  });

  // code to display or remove from watchlist/favouries local storage

  if ($(".watchlist").length > 0) {
    showWatchlist();

    $(".watchlist .wrapper").on("click", ".removefrom-watchlist", function () {
      let old_data = JSON.parse(localStorage.getItem("favourites")),
        deleted_item = $(this).next().html(),
        new_data = old_data.filter(i => i.id !== deleted_item);
      localStorage.setItem("favourites", JSON.stringify(new_data));
      showWatchlist();
    })
  }
})

// function to display movies according to categories

const displayMovies = (category, classname) => {
  let api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: "https://api.themoviedb.org/3/movie/" + category + "?api_key=" + api_key + "&language=en-US&page=1",
    type: "GET",
    success: (data) => {
      let result = data.results;
      result.forEach(i => {
        $("." + classname + " .slider").slick('slickAdd', `
          <div class="movie-content ">
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          <a href="details.html?id=${i.id}&type=movie" title="${i.title}" target="_self" class="title">${i.title}</a>
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
                  view details
              </a>
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="hover-content">click to explore</a>
      </div>
          `);
      })
    },
    error: (error) => {
      alert("something went wrong,try again");
    }
  });
}

// function to tv shows according to categories

const displayTvshows = (category, classname) => {
  let api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: " https://api.themoviedb.org/3/tv/" + category + "?api_key=" + api_key + "&language=en-US&page=1",
    type: "GET",
    success: (data) => {
      let result = data.results;
      result.forEach(i => {
        $("." + classname + " .slider").slick('slickAdd', `
          <div class="tv-content ">
          <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          <a href="details.html?id=${i.id}&type=tv" title="${i.name}" target="_self" class="title">${i.name}</a>
              <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="view-details">
              view details
          </a>
          <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="hover-content">click to explore</a>
      </div>
          `);
      })
    },
    error: (error) => {
      alert("something went wrong,try again");
    }
  });
}

// function to display trending programs

const displayNews = (classname) => {
  let api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: " https://api.themoviedb.org/3/trending/all/day?api_key=" + api_key + "&language=en-US&page=1",
    type: "GET",
    success: (data) => {
      let result = data.results;
      result.forEach(i => {
        let content_type = i.media_type;
        if (content_type === "movie") {
          $("." + classname + " .slider").slick('slickAdd', `
          <ul class="movie-content ">
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          <a href="details.html?id=${i.id}&type=movie" title="${i.title}" target="_self" class="title">${i.title}</a>
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
              view details
          </a>
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="hover-content">click to explore</a>
      </ul>
          `);
        }

        if (content_type === "tv") {
          $("." + classname + " .slider").slick('slickAdd', `
            <ul class="tv-content ">
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self">
                <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
            </a>
            <a href="details.html?id=${i.id}&type=tv" title="${i.name}" target="_self" class="title">${i.name}</a>
                <a href="details.html?id=${i.id}&type=tv" title="${i.name}" target="_self" class="view-details">
                view details
            </a>
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="hover-content">click to explore</a>
        </ul>
            `);
        }
      })
    },
    error: (error) => {
      alert("something went wrong,try again");
    }
  });
}

// function for accessing next or previous page 

const gotoPage = (page, content_type, category) => {
  $(".paginated-contents").html("");
  let api_key = "8d6f976a3d568729504eb85502e74226";

  if (category === "trending") {
    $.ajax({
      url: " https://api.themoviedb.org/3/trending/all/day?api_key=" + api_key + "&language=en-US&page=" + page,
      type: "GET",
      success: (data) => {
        let result = data.results;
        result.forEach(i => {
          let media_type = i.media_type;
          if (media_type === "movie") {
            $(".paginated-contents").append(`
            <ul class="page-item">
            <li class="page-item-image">
            <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self">
                <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
            </a>
            </li>
            <li>
            <a href="details.html?id=${i.id}&type=movie" title="${i.title}" target="_self" class="pagination-title">${i.title}</a>
            </li>  
            <li>  
            <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
                    view details
            </a>
            </li>
        </ul>
            `);
          }

          if (media_type === "tv") {
            $(".paginated-contents").append(`
            <ul class="page-item">
            <li class="page-item-image">
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self">
                <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
            </a>
            </li>
            <li>
            <a href="details.html?id=${i.id}&type=tv" title="${i.name}" target="_self" class="pagination-title">${i.name}</a>
            </li>
            <li>
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="view-details">
                    view details
            </a>
            </li>
        </ul>
              `);
          }
        })
      },
      error: (error) => {
        alert("something went wrong");
      }
    })
  } else {
    $.ajax({
      url: "https://api.themoviedb.org/3/" + content_type + "/" + category + "?api_key=" + api_key + "&language=en-US&page=" + page,
      type: "GET",
      success: (data) => {
        let result = data.results;
        if (content_type === "movie") {
          result.forEach(i => {
            $(".paginated-contents").append(`
          <ul class="page-item ">
          <li class="page-item-image">
          <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          </li>
          <li>
           <a href="details.html?id=${i.id}&type=${content_type}" title="${i.title}" target="_self" class="pagination-title">${i.title}</a>
           </li>
           <li> 
           <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details">
                  view-details
           </a>
           </li>
      </ul>
          `);
          })
        }

        if (content_type === "tv") {
          result.forEach(i => {
            $(".paginated-contents").append(`
          <ul class="page-item ">
          <li class="page-item-image">
          <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          </li>
          <li>
           <a href="details.html?id=${i.id}&type=${content_type}" title="${i.name}" target="_self" class="pagination-title">${i.name}</a>
           </li>
           <li>
           <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details">
                  view details
           </a>
           </li>
      </ul>
          `);
          })
        }
      },
      error: (error) => {
        alert("something went wrong,try again");
      }
    });
  }
}

const showresults = () => {
  $(".search-result").html("");
  let search_text = $(".search-field").val(),
    api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: "https://api.themoviedb.org/3/search/multi?api_key=" + api_key + "&language=en-US&page=1&include_adult=false&query=" + search_text,
    type: "GET",
    success: (data) => {
      let result = data.results;
      result.forEach(i => {
        if (i.media_type === "movie") {
          $(".search-result").append(`
          <li><a href="details.html?id=${i.id}&type=${i.media_type}" title="${i.title}" class="results">${i.title}</li>
        `);
        } else {
          $(".search-result").append(`
          <li><a href="details.html?id=${i.id}&type=${i.media_type}" title="${i.name}" class="results">${i.name}</li>
        `);
        }
      })
    },
    error: (error) => {
      alert("something went wrong,try again");
    }
  });
}

// function to display watchlist 

const showWatchlist = () => {
  $(".watchlist .wrapper").html("");
  let favourites = JSON.parse(localStorage.getItem("favourites")),
    api_key = "8d6f976a3d568729504eb85502e74226";
  favourites.forEach(i => {
    if (i.type === "movie") {
      $.ajax({
        url: " https://api.themoviedb.org/3/" + i.type + "/" + i.id + "?api_key=" + api_key,
        type: "GET",
        success: (data) => {
          $(".watchlist .wrapper").append(`   
        <div class="watchlist-item ">
        <a href="details.html?id=${i.id}&type=${i.type}" title="Get Details" target="_self" class="watchlist-item-image">
            <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie">
        </a>
         <a href="details.html?id=${i.id}&type=${i.type}" title="${data.title}" target="_self" class="watchlist-title">${data.title}</a>
            <button class="removefrom-watchlist">
                remove from Watchlist
            </button>
            <span class="watchlist-id">${i.id}</span>
        </div>
      `);
        },
        error: (error) => {
          alert("something went wrong,try again");
        }
      });
    }

    if (i.type === "tv") {
      $.ajax({
        url: " https://api.themoviedb.org/3/" + i.type + "/" + i.id + "?api_key=" + api_key,
        type: "GET",
        success: (data) => {
          $(".watchlist .wrapper").append(`   
        <div class="watchlist-item ">
        <a href="details.html?id=${i.id}&type=${i.type}" title="Get Details" target="_self" class="watchlist-item-image">
            <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie">
        </a>
         <a href="details.html?id=${i.id}&type=${i.type}" title="${data.name}" target="_self" class="watchlist-title">${data.name}</a>
            <button class="removefrom-watchlist">
                remove from Watchlist
            </button>
            <span class="watchlist-id">${i.id}</span>
        </div>
      `);
        },
        error: (error) => {
          alert("something went wrong,try again");
        }
      });
    }
  })
}