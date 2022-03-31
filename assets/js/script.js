$(document).ready(function () {

  // code for hamburger icon 
  $(".hamburger").click(() => {
    $(".menus").toggleClass("headermenus-show");
    $(".menus").toggleClass("headermenus");
    $(this).toggleClass("cross");
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
  displayNews("trending-news");

  // initialising variables for login form 
  let loginform = $('.loginform'),
    username = $('.username'),
    password = $('.password'),
    usererror = $('.usernameerror'),
    passerror = $('.passworderror');
  localStorage.setItem('username1', 'saurabh96');
  localStorage.setItem('password1', '123456');
  console.log(username);

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

  // js code for search functionality 
  $(".search-button").click(()=>{
    if($(".search-field").val().length > 0) {
      $(".search-button").toggleClass("closeresult");
      showresults();
    }
  }); 

  $(".search-field").keypress((e)=>{
    if(e.key === "Enter") {
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
      next = $(".next");

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
        console.log(total_pages);
        $(".prev").addClass("disabled");
        if (current === total_pages - 1) {
          $(".next").addClass("disabled");
        }

        // functions for accessing next and previous pages in pagination list 

        next.click(() => {
          $(".prev").removeClass("disabled");
          page_no = parseInt(page_no + 1);
          console.log(page_no);
          console.log(total_pages);
          console.log(pagination_url);
          if (page_no < total_pages) {
            gotoPage(page_no, content_type, category);
          } else {
            $(".next").addClass("disabled");
          }
          $(".current").html(page_no);
        })

        prev.click(() => {
          if (page_no !== 1) {
            page_no = parseInt(page_no - 1);
            console.log(page_no);
            gotoPage(page_no, content_type, category);
          } else {
            $(".prev").addClass("disabled");
          }
          $(".current").html(page_no);
        });

        if (content_type === "movie") {
          result.forEach(i => {
            $(".paginated-contents").append(`
        <div class="page-item ">
        <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
            <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
        </a>
         <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.title}</a>
            <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details">
                view details
            </a>
    </div>
        `);
          })
        }

        if (content_type === "tv") {
          result.forEach(i => {
            $(".paginated-contents").append(`
        <div class="page-item ">
        <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
            <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
        </a>
         <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.name}</a>
            <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details">
            view details
        </a>
    </div>
        `);
          })
        }

        if (category === "trending") {
          result.forEach(i => {
            let media_type = i.media_type;
            if (media_type === "movie") {
              $(".paginated-contents").append(`
              <div class="page-item">
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="page-item-image">
                  <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
              </a>
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="pagination-title">${i.title}</a>
                  <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
                      view details
                  </a>
          </div>
              `);
            }
            if (media_type === "tv") {
              $(".paginated-contents").append(`
              <div class="page-item">
              <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="page-item-image">
                  <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
              </a>
              <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="pagination-title">${i.name}</a>
                  <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="view-details">
                  view details
              </a>
          </div>
                `);
            }
          })
        }
      },
      error: (error) => {
        alert("something went wrong,try again");
        console.log(error);
      }

    });
  }

  // js code for details page 

  if ($(".details").length > 0) {
    $(".details .wrapper").html("");
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
        console.log(data);
        if (content_type === "movie") {
          console.log(data.production_countries);
          $(".details .wrapper").append(`
            <h2>${data.title}</h2>
            <figure>
            <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie Poster">
            </figure>
            <p class="details-overview">${data.overview}</p>
            <button class="addto-watchlist">add to watchlist</button>
            <span class="item-id">${data.id}</span>
            <span class="rate-us">rate this movie</span>
            <div class="more-details">
            <p class="status">Status:<span class="text-red">${data.status}</span></p>
            <p class="release-date">Release date: <span class="text-red">${data.release_date}</span></p>
            <p class="production-company">Production company: <span class="text-red">${data.production_companies[0].name}</span></p>
            <p class="production-country">Production country: <span class="text-red">${data.production_countries[0].name}</span></p>
            </div>
        
          `);
        }
        if (content_type === "tv") {
          $(".details .wrapper").append(`
          <h2>${data.name}</h2>
          <figure>
          <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie Poster">
          </figure>
          <p class="details-overview">${data.overview}</p>
          <button class="addto-watchlist">add to watchlist</button>
          <span class="item-id">${data.id}</span>
          <span class="rate-us">rate this show</span>
          <div class="more-details">
          <p class="status">Status:<span class="text-red">${data.status}</span></p>
          <p class="first-air-date">First Air date: <span class="text-red">${data.first_air_date}</span></p>
          </div>
        `);
          if (data.production_companies[0].name.length > 0 && data.production_countries[0].name.length > 0) {
            $(".details .wrapper .more-details").append(`
            <p class="production-company">Production company: <span class="text-red">${data.production_companies[0].name}</span></p>
            <p class="production-country">Production country: <span class="text-red">${data.production_countries[0].name}</span></p>
            `);
          }
        }
      },
      error: (error) => {
        alert("something went wrong,try again");
        console.log(error);
      }

    });
  }
  // js code for add to watchlist 

  url = new URL(window.location.href),
    urlstring = url.search.slice(1),
    searchurlparam = new URLSearchParams(urlstring),
    content_type = searchurlparam.get('type');
  $(".details ,.wrapper").on('click', '.addto-watchlist', () => {
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
    if (old_data.indexOf(new_data) < 0) {
      old_data.push(new_data);
    }

    localStorage.setItem("favourites", JSON.stringify(old_data));
  });


  // code for add to watchlist/favouries local storage
  if ($(".watchlist").length > 0) {
    $(".watchlist .wrapper").html("");
    let allfavourites = JSON.parse(localStorage.getItem("favourites")),
      favourites = [...allfavourites.reduce((map, obj) => map.set(obj.id, obj), new Map()).values()];
    console.log(favourites);
    favourites.forEach(i => {
      console.log(i);
      if (i.type === "movie") {
        $.ajax({
          url: " https://api.themoviedb.org/3/" + i.type + "/" + i.id + "?api_key=" + api_key,
          type: "GET",
          success: (data) => {
            console.log(data.title);
            $(".watchlist .wrapper").append(`   
          <div class="watchlist-item ">
          <a href="details.html?id=${i.id}&type=${i.type}" title="Get Details" target="_self" class="watchlist-item-image">
              <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie">
          </a>
           <a href="details.html?id=${i.id}&type=${i.type}" title="Get Details" target="_self" class="watchlist-title">${data.title}</a>
              <button class="removefrom-watchlist">
                  remove from Watchlist
              </button>
              <span class="watchlist-id">${i.id}</span>
          </div>
        `);

          }
        });
      }

      if (i.type === "tv") {
        $.ajax({
          url: " https://api.themoviedb.org/3/" + i.type + "/" + i.id + "?api_key=" + api_key,
          type: "GET",
          success: (data) => {
            console.log(data.title);
            $(".watchlist .wrapper").append(`   
          <div class="watchlist-item ">
          <a href="details.html?id=${i.id}&type=${i.type}" title="Get Details" target="_self" class="watchlist-item-image">
              <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie">
          </a>
           <a href="details.html?id=${i.id}&type=${i.type}" title="Get Details" target="_self" class="watchlist-title">${data.name}</a>
              <button class="removefrom-watchlist">
                  remove from Watchlist
              </button>
              <span class="watchlist-id">${i.id}</span>
          </div>
        `);

          }
        });
      }
    })
    $(".watchlist .wrapper").on("click",".removefrom-watchlist",()=>{
      let old_data = JSON.parse(localStorage.getItem("favourites")),
          deleted_item = $(".watchlist .wrapper .removefrom-watchlist").next().html();
          old_data.forEach(i=>{
            if(i.id === deleted_item) {
             let new_data= old_data.splice(i,i);
             if (old_data.indexOf(new_data) < 0) {
              old_data.push(new_data);
            }
        
            }
          })
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
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="title">${i.title}</a>
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
                  view details
              </a>
      </div>
          `);
      })
      $(".slider").slick();
    },
    error: (error) => {
      alert("something went wrong,try again");
      console.log(error);
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
          <div class="movie-content ">
          <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="title">${i.name}</a>
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
              view details
          </a>
      </div>
          `);
      })
      $(".slider").slick();
    },
    error: (error) => {
      alert("something went wrong,try again");
      console.log(error);
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
          <div class="movie-content ">
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="title">${i.title}</a>
              <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
              view details
          </a>
      </div>
          `);
        }
        if (content_type === "tv") {
          $("." + classname + " .slider").slick('slickAdd', `
            <div class="movie-content ">
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self">
                <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
            </a>
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="title">${i.name}</a>
                <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
                view details
            </a>
        </div>
            `);
        }
      })
      $(".slider").slick();
    },
    error: (error) => {
      alert("something went wrong,try again");
      console.log(error);
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
            <div class="page-item">
            <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="page-item-image">
                <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
            </a>
            <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="pagination-title">${i.title}</a>
                <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="view-details">
                    view details
                </a>
        </div>
            `);
          }
          if (media_type === "tv") {
            $(".paginated-contents").append(`
            <div class="page-item">
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="page-item-image">
                <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
            </a>
            <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="pagination-title">${i.name}</a>
                <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="view-details">
                    view details
                </a>
        </div>
              `);
          }
        })
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
          <div class="page-item ">
          <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
           <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.title}</a>
              <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details">
                  view-details
              </a>
      </div>
          `);
          })
        }

        if (content_type === "tv") {
          result.forEach(i => {
            $(".paginated-contents").append(`
          <div class="page-item ">
          <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
           <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.name}</a>
              <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="view-details>
                  view more
              </a>
      </div>
          `);
          })
        }
      },
      error: (error) => {
        alert("something went wrong,try again");
        console.log(error);
      }

    });
  }
}

const showresults = ()=>{
  
  $(".search-result").html("");
  let search_text = $(".search-field").val(),
   api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: "https://api.themoviedb.org/3/search/multi?api_key="+api_key+"&language=en-US&page=1&include_adult=false&query="+search_text,
    type: "GET",
    success: (data) =>{
      let result = data.results;
      result.forEach(i=>{
        if(i.media_type === "movie"){
        $(".search-result").append(`
          <li><a href="details.html?id=${i.id}&type=${i.media_type}" title="Get Details" class="results">${i.title}</li>
        `);
        }else{
          $(".search-result").append(`
          <li><a href="details.html?id=${i.id}&type=${i.media_type}" title="Get Details" class="results">${i.name}</li>
        `);
        }
      })       
    },
    error: (error) => {
      alert("something went wrong,try again");
      console.log(error);
    }
  });
    $(".search-result").addClass("show-flex");
}