//establish variables for search bar, search field, and watch/list trailer
var searchBar = document.querySelector("#search-form");
var searchInputEl = document.querySelector(".search-field");
var watchTrailerEl = document.querySelector("#watch-trailer");
var listViewTrailer = document.querySelector("#listview-trailer")
//establish variable for watched movies using localStorage
var watchedMovies = JSON.parse(localStorage.getItem('watchedMovieList')) || [];

//display our previous search by recieving the innerHTML from the user's search form
function loadPrevSearch() {
        var prevSearchObj = JSON.parse(localStorage.getItem('prevSearch')) || {};
        document.getElementById("prevType").innerHTML = prevSearchObj.Type;
        document.getElementById("prevGenre").innerHTML = prevSearchObj.Genre;
        document.getElementById("prevActor").innerHTML = prevSearchObj.Actor;
        document.getElementById("prevTime").innerHTML = prevSearchObj.RunningTime + " mins";
        document.getElementById("prevRating").innerHTML = prevSearchObj.Rating + "%";
    }

//provide the list for the movies that are in the "my watched list" button
function loadWatchedMovies(){
    watchedMovies = JSON.parse(localStorage.getItem('watchedMovieList')) || [];
    //console.log("loading watched movie list");
    if ($("#singleView").css("display") != "none") {
        $("#singleView").css("display", "none");
        $("#viewWatchedList").css("display", "block");
    }
    else if($("#leftView").css("display") != "none"){
        $("#leftView").css("display", "none");
        $("#rightView").css("display", "none");
        $("#viewWatchedList").css("display", "block");
    }
//provide data of the movies that had their "I'll Watch This!" button clicked
    var latest = watchedMovies.length -1;
    $("#watchedPoster").attr("src",watchedMovies[latest].posterURL);
    document.getElementById("watchedTitle").innerHTML = watchedMovies[latest].title;
    document.getElementById("watchedType").innerHTML = watchedMovies[latest].type;
    document.getElementById("watchedGenre").innerHTML = watchedMovies[latest].genre;
    document.getElementById("watchedRating").innerHTML = watchedMovies[latest].rating;
    document.getElementById("watchedTime").innerHTML = watchedMovies[latest].runningTime + " mins";
    document.getElementById("watchedSynopsis").innerHTML = watchedMovies[latest].synopsis;
}
//establish data of the movies that had their "I'll Watch This!" button clicked
function saveWatchedMovie(){
    var newTitle = document.getElementById("movieTitle").innerHTML;
    var exists = false;
    for(var i =0; i < watchedMovies.length; i++){
        if(watchedMovies[i].title === newTitle){
            exists = true;
            break;
        }
    }

    if(!exists){
        var newMovie = {
            title: newTitle,
            type: document.getElementById("type").innerHTML,
            genre: document.getElementById("genre").innerHTML,
            synopsis: document.getElementById("synopsis").innerHTML,
            runningTime: document.getElementById("runningTime").innerHTML,
            posterURL: $("#moviePoster").attr("src"),
            rating: document.getElementById("singleRating").innerHTML
        }
        
        watchedMovies.push(newMovie);
        localStorage.setItem("watchedMovieList", JSON.stringify(watchedMovies));
    }
    else{
        //console.log("ahhh, we already watched this one!")
    }
    listWatchedMovies();
}

function requiredActor(){
    var requiredActor = $("#actor");
}


//generates a list view based on the search bar in the nav
    function saveListMovie(movieBtn){
       var movieDiv = movieBtn.parentElement.parentElement.previousSibling;
       var imgURL = movieDiv.querySelector('.movie-poster').getAttribute('src');
        var ratingVal = movieDiv.querySelector('.movie-rating').innerHTML;
        var titleVal = movieDiv.querySelector('.movie-title').innerHTML;
        var runtimeVal = movieDiv.querySelector('.movie-runTime').innerHTML;
        var synopsisVal = movieDiv.querySelector('.movie-synopsis').innerHTML;
        var genresVal = movieDiv.querySelector('.movie-genres');
        
        if(genresVal === "" || genresVal === null || genresVal === undefined)
            genresVal = "";
        else
            genresVal = genresVal.innerHTML;
        
            var exists = false;
            for(var i =0; i < watchedMovies.length; i++){
                if(watchedMovies[i].title === titleVal){
                    exists = true;
                    break;
                }
            }
        
            if(!exists){
                var newMovie = {
                    title: titleVal,
                    type: "Movie",
                    genre: genresVal,
                    synopsis: synopsisVal,
                    runningTime: runtimeVal,
                    posterURL: imgURL,
                    rating: ratingVal
                }

                watchedMovies.push(newMovie);
                localStorage.setItem("watchedMovieList", JSON.stringify(watchedMovies));
            }

            if ($("#resultListView").css("display") != "none") {
                $("#leftView").css("display", "block");
                $("#rightView").css("display", "block");
                $("#viewWatchedList").css("display", "none");
                $("#resultListView").css("display", "none");
                $("#singleView").css("display", "none");
                returnUserFormtoOrginal();
            }

        
    }
//displays a single movie with its poster image and details
    function switchSingleView(movieDiv){

        //Setting variable data from element of movie selected for single view
        var imgURL = movieDiv.querySelector('.movie-poster').getAttribute('src');
        var ratingVal = movieDiv.querySelector('.movie-rating').innerHTML;
        var titleVal = movieDiv.querySelector('.movie-title').innerHTML;
        var runtimeVal = movieDiv.querySelector('.movie-runTime').innerHTML;
        var synopsisVal = movieDiv.querySelector('.movie-synopsis').innerHTML;
        var genresVal = movieDiv.querySelector('.movie-genres');

        // If there are no genres for the movie
        if(genresVal === "" || genresVal === null || genresVal === undefined)
            genresVal = "";
        else
            genresVal = genresVal.innerHTML;

            // Checks to see if the previous search container or movie list container is displayed before switching to single view
        if ($("#leftView").css("display") != "none" || $("#resultListView").css("display") != "none") {
            $("#leftView").css("display", "none");
            $("#rightView").css("display", "none");
            $("#viewWatchedList").css("display", "none");
            $("#resultListView").css("display", "none");
            $("#singleView").css("display", "block");

            // setting singleview innter html values pertaining to the movie selected
            $("#moviePoster").attr('src', imgURL);
            document.getElementById("singleRating").innerHTML = ratingVal;
            document.getElementById("movieTitle").innerHTML = titleVal;
            youtubeSearch(titleVal);
            document.getElementById("runningTime").innerHTML = runtimeVal;
            document.getElementById("synopsis").innerHTML = synopsisVal;
            document.getElementById("type").innerHTML = "Movie";
            document.getElementById("genre").innerHTML = genresVal;
        }
    }

    // new youtube api on click for single view
    function youtubeSearch(title) {
        
        //runs api when "watch trailer" clicked
        watchTrailerEl.addEventListener("click", function displayTrailer() {
            
            //api variables and url
            var youtubeApiKey = "AIzaSyAHIW59r1-23MReIhfH7LZ9YF4_zgb3tDQ";
            var secondApi = "AIzaSyAqdJJd0sWPq6BmHwH8GTvUaZ4Lk-ejKGk"
            var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&maxResults=1&q=" + title + "trailer" + "&key=" + youtubeApiKey;
           
            //fetch function
            fetch(url)
            .then(response => response.json())
            .then(data => {
                //display embedded youtube video
                document.getElementById("moviePoster").style.display = "none";
                document.getElementById("singleRating").style.display = "none";
                var iframe = document.getElementById("ytplayer");
                iframe.style.display = "block";
                iframe.height = "400";
                iframe.src = "https://www.youtube.com/embed/" + data.items[0].id.videoId;
            })
        })
    }
    
    //search function to link to api
    var searchSubmitHandler = function (event) {
        event.preventDefault();

        // get input value
        var searchWord = searchInputEl.value.trim();
        if (searchWord) {
            multiMovie(searchWord);
            //movie(searchWord)
            // switchSingleView(searchWord);
            searchInputEl.value = "";
        }

    }
    //provide alert if user doesn't select an actor/actress
    function userSubmitHandler(event){
        event.preventDefault();
        var actorAvail = document.getElementById("actor").value
        // Will not run search until user enters a value for actor/actress
        if(actorAvail){
            search();
        }
        else{
            $("#actorAlert").css("display", "block");
        }
    }


    searchBar.addEventListener("submit", searchSubmitHandler);

// //provides the details for a specific movie with the tmdb api
//     function movie() {

//         $("#leftView").css("display", "none");
//         $("#rightView").css("display", "none");
//         $("#viewWatchedList").css("display", "none");
//         $("#singleView").css("display", "block");

//         var API = "2215e66d3770fa7ff283fdf766c88f8c"
//         var title = document.querySelector('#movie-title').value;
//         var poster = document.querySelector('#moviePoster');

//         fetch("https://api.themoviedb.org/3/search/movie?api_key="
//             + API + "&query=" + title)
//             .then(function (response) { return response.json() })
//             .then(function (response) {
//                 var id = (response.results[0].id);

//                 fetch("https://api.themoviedb.org/3/movie/"
//                     + id
//                     + "?api_key="
//                     + API)

//                     .then(function (detail) { return detail.json() })
//                     .then(function (detail) {

//                         var title = (detail.title)
//                         var genreEl = document.getElementById("genre");
//                         document.getElementById("movieTitle").innerHTML = title;
//                         document.getElementById("runningTime").innerHTML = detail.runtime + " mins";
//                         document.getElementById("synopsis").innerHTML = detail.overview;
//                         document.getElementById("singleRating").innerHTML = ((detail.vote_average) * 10) + "%"
//                         document.getElementById("type").innerHTML = "Movie";
//                         var genreList = detail.genres;
//                         var innerGenreList = '';
//                         for(var i = 0; i < genreList.length; i++){
//                             innerGenreList += '<span class="primary badge" id="genre'+i+'">';
//                             innerGenreList += genreList[i].name;
//                             innerGenreList += '</span>';
//                         }

//                         genreEl.innerHTML = innerGenreList;
//                         var imgUrl = "https://image.tmdb.org/t/p/w780//" + (detail.poster_path)
//                         poster.src = ""
//                         poster.src = imgUrl

//                      })
//             })
//     }
//displays the data from a string generated by the tmdb api
    function multiMovie() {
        // set header title for container to display the resulting list of movies
        document.getElementById('listHeaderTitle').innerHTML = "These Might Be Worth Your Time";
        //Allows for only search form and result list containers to be visible
        $("#leftView").css("display", "none");
        $("#rightView").css("display", "block");
        $("#viewWatchedList").css("display", "none");
        $("#singleView").css("display", "none");
        $("#resultListView").css("display", "block");

        var exists = false;
        var titleArray = [];
        //Creating array for list of movies already watched
        for(var i =0; i < watchedMovies.length; i++){
            titleArray.push(watchedMovies[i].title);
        }

        var API = "2215e66d3770fa7ff283fdf766c88f8c"
        var title = document.querySelector('#movie-title').value;
        var poster = document.querySelector('#moviePoster');
        // String variable to be used as innerhtml string to create movielist
        var innerResultString = "";
        //container element for list of movies
        var movieListEl = document.getElementById("movieList");
        //Alternates format of user search form to horizontal near the top navbar
        moveUserSearchForm();

        fetch("https://api.themoviedb.org/3/search/movie?api_key="
            + API + "&query=" + title)
            .then(function (response) { return response.json() })
            .then(function (response) {
                // condition if there are no results
                if(response.results.length === 0){
                    moveUserSearchForm();
                    var header = document.getElementById('listHeaderTitle');
                    header.innerHTML = "We're sorry, but we don't see anything that might be worth your time with that criteria.";
                    innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                            + '<div class="about-people-author">'
                            + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">We recommend you try an alternate search. Please search for a different title, or use search form above.</p></span>'                           
                            +  '</div></div>'
                            movieListEl.innerHTML = innerResultString;
                }
                //for loop to run nested API call for movie title entered
                for(var i = 0; i < response.results.length; i++){
                    var id = (response.results[i].id);
                    fetch("https://api.themoviedb.org/3/movie/"
                        + id
                        + "?api_key="
                        + API)

                        .then(function (detail) { return detail.json() }
                    )
                    .then(function (detail) {
                        var title = (detail.title)
                        if(titleArray.indexOf(title) < 0){                            
                        
                            var posterURL = detail.poster_path;
                            var reportedRuntime = detail.runtime;
                            //assign default poster if there is none in api result
                            if(posterURL === null){
                                posterURL = "https://placehold.it/75";
                            }
                            else{
                                posterURL = "https://image.tmdb.org/t/p/w780//"+posterURL;
                            }
                            //assign default value if there is no runtime listed in api result
                            if(reportedRuntime === null || reportedRuntime === 0){
                                reportedRuntime = "No Runtime Recorded";
                            }
                            var genreList = detail.genres;
                                var innerGenreList = '';
                                // loop through to display all genres movie is catagorized as
                                for(var i = 0; i < genreList.length; i++){
                                    innerGenreList += '<span class="primary badge" id="genre'+i+'">';
                                    innerGenreList += genreList[i].name;
                                    innerGenreList += '</span>';
                                }

                                var reportedRating = ((detail.vote_average) * 10);
                                // assign default value if there is no rating from api call
                                if (reportedRating === 0 || reportedRating === undefined || reportedRating === null){
                                    reportedRating = "No Reported Rating";
                                }

                            // create string of elements to be used for movie item with it's values inputted from api call
                            innerResultString += '<div class="small-12 medium-9 columns about-people movieItem" onclick="switchSingleView(this)">'
                                + '<div class="about-people-avatar"><img class="avatar-image movie-poster"'
                                + ' src="'+posterURL+'"></div><div class="about-people-author">'
                                + '<span class="columns medium-12"><p class="author-name movie-title columns medium-8">'+title+'</p><p class="secondary movie-rating label">'
                                + reportedRating + '%</p></span>'
                                +  '<span class="movie-genres">' + innerGenreList + '</span>'
                                + '<p class="author-location movie-runTime">'+reportedRuntime+' mins</p>'
                                + '<p class="author-mutual movie-synopsis">'+detail.overview+'</p></div></div>'
                                + '<div class="small-12 medium-3 columns add-friend"><div class="add-friend-action">'
                                +  '<button class="button secondary small" onclick="saveListMovie(this)">'+"I'll Watch This!</button>"
                                +  '</div></div>';
                                 
                            document.getElementById("movieList").style.cursor = "pointer";
                                
                            // assign inner html of string concatenated
                            movieListEl.innerHTML = innerResultString;
                        }
                    })
                    // If you have reached the end of the results list and there are no movies that matched the necessary conditions, generate responding message to user
                    if(i === (response.results.length-1)  && movieListEl.innerHTML === ""){
                            moveUserSearchForm();
                            document.getElementById('listHeaderTitle').innerHTML = "We're sorry, but we don't see anything that might be worth your time with that criteria.";
                            innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                                + '<div class="about-people-author">'
                                + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">We recommend you try an alternate search. Use the form above to run a different search.</p></span>'                           
                                +  '</div></div>'
                            movieListEl.innerHTML = innerResultString;
                    }
                }
                
                
            })

    }
//displays the list of movies that were marked with "I'll watch this!"
    function listWatchedMovies(){
        $("#leftView").css("display", "none");
        //$("#rightView").css("display", "none");
        $("#viewWatchedList").css("display", "none");
        $("#singleView").css("display", "none");
        $("#resultListView").css("display", "block");
        moveUserSearchForm();

        document.getElementById('listHeaderTitle').innerHTML = "Watched List";

        var innerResultString = "";
        var movieListEl = document.getElementById("movieList");
        // Message for user if they have not added any movies to watched list yet
        if(watchedMovies.length === 0){
            innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                + '<div class="about-people-author">'
                + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">It doesn'+"'"+'t look like you have any saved movies in your watch list. Try running a search with the form above.</p></span>'                           
                +  '</div></div>'
        }
        else{
            // loop through movies saved in watched list to display each movieItem in a list
            for(var i = 0; i< watchedMovies.length; i++){
                innerResultString += '<div class="small-12 medium-12 columns about-people movieItem" onclick="switchSingleView(this)">'
                                + '<div class="about-people-avatar"><img class="avatar-image movie-poster"'
                                + ' src="'+watchedMovies[i].posterURL+'"></div><div class="about-people-author">'
                                + '<span class="columns medium-12"><p class="author-name movie-title columns medium-8">'+watchedMovies[i].title+'</p><p class="secondary movie-rating label">'
                                + watchedMovies[i].rating + '%</p></span>'
                                +  '<span class="movie-genres">' + watchedMovies[i].genre + '</span>'
                                + '<p class="author-location movie-runTime">'+watchedMovies[i].runningTime+' mins</p>'
                                + '<p class="author-mutual movie-synopsis">'+watchedMovies[i].synopsis+'</p></div></div>';
            }
        }
        movieListEl.innerHTML = innerResultString;

    }
//not currently used, generates 5 random top rated movies - Kept in code to be used with a future development feature
    function topFive() {

        var API = "2215e66d3770fa7ff283fdf766c88f8c"

        fetch("https://api.themoviedb.org/3/discover/movie?api_key=" +
            API +
            "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1")

            .then(function (top) { return top.json() })
            .then(function (top) {
                var posterArray = []


                for (i = 0; i < 5; i++) {

                    var randomNum = Math.floor(Math.random() * 20)
                    var posterPath = (top.results[randomNum].poster_path)

                    if (posterArray.includes(posterPath)) {

                    }
                    else { posterArray.push("https://image.tmdb.org/t/p/w185//" + posterPath); }


                }
                $("#poster1").attr("src", posterArray[0])
                $("#poster2").attr("src", posterArray[1])
                $("#poster3").attr("src", posterArray[2])
                $("#poster4").attr("src", posterArray[3])
                $("#poster5").attr("src", posterArray[4])
            })

    }
//saves the information that the user provides in the search form
    function saveNewSearch() {
        //read values from the user's search form and assign them to variables
        var checkType = "";
        var movieCheck = document.getElementById("movieType").checked;
        var showCheck = document.getElementById("showType").checked;
        var genreSelect = document.getElementById("genre-select").value;
        var actorSelect = document.getElementById("actor").value;
        var runningTselect = document.getElementById("maxMins").value;
        var ratingSelect = document.getElementById("rating").value;
        // Reset the form
        document.getElementById("movieType").checked = false;
        document.getElementById("showType").checked = false;
        document.getElementById("genre-select").value = "Any";
        document.getElementById("actor").value = "";
        document.getElementById("maxMins").value = "";
        document.getElementById("minMins").value = "";
        document.getElementById("rating").value = "";

        //Force the first letter of selected genre to be uppercase
        var upper = genreSelect.charAt(0).toUpperCase();
        genreSelect = genreSelect.slice(1);
        genreSelect = upper + genreSelect;
        // check to see if both movie & show are checked
        if (movieCheck && showCheck) {
            checkType = "Movie / Show"
        }
        else if (movieCheck) {
            checkType = "Movie"
        }
        else {
            checkType = "Show"
        }
        if (actorSelect === "" || actorSelect === undefined) {
            actorSelect = "None";
        }
        //assign default value if no runtime was specified
        if (runningTselect === null || runningTselect === undefined) {
            runningTselect = 0;
        }
        //Assign default value if no rating was specified
        if (ratingSelect === null || ratingSelect === undefined) {
            ratingSelect = 0;
        }
        // Create previous search object with values from the form
        prevSearchObj = {
            Type: checkType,
            Genre: genreSelect,
            Actor: actorSelect,
            RunningTime: runningTselect,
            Rating: ratingSelect
        }
        // Save previous search object in local storeage
        localStorage.setItem("prevSearch", JSON.stringify(prevSearchObj));
    }
//condense the search form and move it to the top of the page once the user searches for a movie
    function moveUserSearchForm(){
        //As a second defense, makes sure that the container with the search form will be visisble
        $("#righView").css("display", "block");

        var userForm = document.getElementById("rightView");
        // changes user search form classes to match for horizontal layout
        userForm.setAttribute("class", "columns small-12 medium-12");
        //shift alignment of horizontal user search form
        userForm.style.marginTop = "-2.5rem";
        //Creates string for innerhtml value with user's search form classes adapted to support horizontal layout
        var innerString = '<div class="translucent-form-overlay" style="padding-top: 2px;border: white solid; max-width: 100%; box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75); background-color: rgba(19,19,19);margin-bottom: 5px;">'
            + '<form><h5>Search for Something Worth My Time</h5><div class="row columns"><div class="columns medium-2 small-12">'
            + '<fieldset class="fieldset" style="padding-bottom: 2px;padding-top: 2px; padding:.2rem;"><legend class="form-legend">Type: </legend><input id="movieType" name="type" type="checkbox" required=""><label for="movieType">Movie</label>'
            + '<input id="showType" name="type" type="checkbox" required=""><label for="showType">Show</label></fieldset></div>'
            + '<div class="columns medium-2 small-12"><label>Genre<select name="genre" id="genre-select" type="text"><option>Any</option><option value="action">Action</option>'
            + '<option value="drama">Drama</option><option value="comedy">Comedy</option><option value="family">Family</option><option value="sci-fi">Science Fiction</option>'
            + '<option value="thriller">Thriller</option><option value="adventure">Adventure</option><option value="romance">Romance</option><option value="horror">Horror</option>'
            + '</select></label></div><div class="columns medium-2 small-12"><div data-closable="" class="alert-box callout alert" id="actorAlert" style="display: none; z-index: 10;">'
            + '<i class="fa fa-ban"></i> Missing Actor/Actress value. Please enter missing information.<button class="close-button" aria-label="Dismiss alert" type="button" data-close="">'
            + '<span aria-hidden="true">⊗</span></button></div><label>Actor/Actress'
            + '<input type="text" name="actor" id="actor" placeholder="Actor/Actress" required=""></label></div><div class="columns medium-4 small-12">'
            + '<label class="columns small-12 medium-12">Running Time</label><div class="columns small-3 medium-3"><input type="number" min="0" name="min" id="minMins" placeholder="Min">'
            + '</div><div class="columns small-3 medium-2 runningTimeLabel"><label class=" text-left middle" for="min">minutes</label>'
            + '</div><div class="columns small-3 medium-3"><input type="number" min="0" name="max" id="maxMins" placeholder="Max"></div>'
            + '<div class="columns small-3 medium-2 runningTimeLabel" style="float: left"><label class=" text-left middle"  for="max">minutes</label></div></div>'
            + '<div class="columns small-6 medium-2"><label>Minimum Rating<div class="input-group">'
            + '<input type="number" class="input-group-field" id="rating" name="rating" max="100" min="0" placeholder="Rating"><span class="input-group-label">%</span>'
            + '</div></label></div><button type="submit" class="primary button expanded search-button" id="userSubmitBtn" onclick="userSubmitHandler(event)">'
            + 'Search</button></div></form></div>';

        userForm.innerHTML = innerString;
    }
//turns the search form back into its original display size and position
    function returnUserFormtoOrginal(){
        var userForm = document.getElementById("rightView");
        userForm.setAttribute("class", "columns small-12 medium-5");
        var innerString = '<div class="translucent-form-overlay" >'
            + '<form><h5>Search for Something Worth My Time</h5>'
            + '<div class="row columns">'
            + '<fieldset class="fieldset"><legend class="form-legend">Type: </legend><input id="movieType" name="type" type="checkbox" required><label for="movieType">Movie</label>'
            + '<input id="showType" name="type" type="checkbox" required><label for="showType">Show</label></fieldset>'
            + '</div>'
            + '<div class="row columns">'
            + '<label>Genre'
            + '<select name="genre" id="genre-select" type="text">'
            + '<option>Any</option><option value="action">Action</option><option value="drama">Drama</option><option value="comedy">Comedy</option>'
            +  '<option value="family">Family</option><option value="sci-fi">Science Fiction</option><option value="thriller">Thriller</option>'
            +  '<option value="adventure">Adventure</option><option value="romance">Romance</option><option value="horror">Horror</option></select>'
            + '</label></div><div class="row columns"><div data-closable class="alert-box callout alert" id="actorAlert">'
            + '<i class="fa fa-ban"></i> Missing Actor/Actress value. Please enter missing information.<button class="close-button" aria-label="Dismiss alert" type="button" data-close>'
            + '<span aria-hidden="true">&CircleTimes;</span></button></div><label>Actor/Actress'
            + '<input type="text" name="actor" id="actor" placeholder="Actor/Actress" required></label></div><div class="row">'
            + '<label class="columns small-12">Running Time</label><div class="columns small-3"><input type="number" min="0" name="min" id="minMins" placeholder="Min">'
            + '</div><div class="columns small-3 runningTimeLabel"><label class=" text-left middle" for="min">minutes</label></div>'
            + '<div class="columns small-3"><input type="number" min="0" name="max" id="maxMins" placeholder="Max"></div><divl class="columns small-3 runningTimeLabel">'
            + '<label class=" text-left middle " for="max">minutes</label></divl></div><div class="row columns small-6"><label>Minimum Rating'
            + '<div class="input-group"><input type="number" class="input-group-field" id="rating" name="rating" max="100" min="0" placeholder="Rating">'
            + '<span class="input-group-label">%</span></div></label></div>'
            + '<button type="submit"  class="primary button expanded search-button" id="userSubmitBtn" onclick="userSubmitHandler(event)">Search</button>';
        userForm.innerHTML = innerString;
    }
//searches for movies based off the user search form, using tmdb api
    function search() {
        document.getElementById('listHeaderTitle').innerHTML = "These Might Be Worth Your Time";
        $("#leftView").css("display", "none");
        $("#viewWatchedList").css("display", "none");
        $("#singleView").css("display", "none");
        $("#resultListView").css("display", "block");
        // Grabs user's rating and then converts it into a comparable value with the voter average of the movies (scale of 1-10 is used)
        var rating = document.querySelector("#rating").value
        var ratingMath = (rating / 10)
        //remaining values from user search form are assigned to variables
        var minMins = document.querySelector("#minMins").value
        var maxMins = document.querySelector("#maxMins").value
        var actor = document.querySelector("#actor").value
        var innerResultString = "";
        var movieListEl = document.getElementById("movieList");
        var genreSelector = document.querySelector('#genre-select');

        var output = genreSelector.value;
        // save the user's search to be referenced for previous search
        saveNewSearch();
        // load newly saved previous search data
       loadPrevSearch();

       var exists = false;
       // create local array for movies listed in watch list
       var titleArray = [];
        for(var i =0; i < watchedMovies.length; i++){
            titleArray.push(watchedMovies[i].title);
        }

        var API = "2215e66d3770fa7ff283fdf766c88f8c"
        //condition to assign code values based on genre selected. This is done to handle the API call through the genre code value it expects
        var genre = 0
        if (output === "action") {
            genre = 28
        }
        if (output === "drama") {
            genre = 18
        }
        if (output === "comedy") {
            genre = 35
        }
        if (output === "family") {
            genre = 10751
        }
        if (output === "sci-fi") {
            genre = 878
        }
        if (output === "thriller") {
            genre = 53
        }
        if (output === "adventure") {
            genre = 12
        }
        if (output === "romance") {
            genre = 10749
        }
        if (output === "horror") {
            genre = 27
        }
        
        var API = "2215e66d3770fa7ff283fdf766c88f8c"
        //api fetch based on the actor id
        fetch("https://api.themoviedb.org/3/search/person?api_key=" +
        API +
        "&search_type=ngram&query=" +
        actor)

            .then(function (actorSearch) { return actorSearch.json() })
            .then(function (actorSearch) {
                
                var actorId = (actorSearch.results[0].id)
                //generate next api fetch string based on values available from user search form. This allows for not needing all values in form to be req'd
                var apiFetchString = "https://api.themoviedb.org/3/discover/movie?api_key=" +
                    API + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false"
                if(genre != 0){
                    apiFetchString += "&with_genres=" + genre
                }
                if(maxMins != "" || maxMins != "undefined"){
                    apiFetchString += "&with_runtime.lte=" + maxMins 
                }
                if(minMins != "" || minMins != "undefined"){
                    apiFetchString += "&with_runtime.gte=" + minMins 
                }
                apiFetchString += "&with_people=" + actorId + "&page=1"           
                fetch(apiFetchString)   
                .then(function (movieSearch) { return movieSearch.json() })
                .then(function (movieSearch) {
                    // If there are no results from the api pull, generate message to the user
                if(movieSearch.results.length === 0){
                    moveUserSearchForm();
                    document.getElementById('listHeaderTitle').innerHTML = "We're sorry, but we don't see anything that might be worth your time with that criteria.";
                    innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                        + '<div class="about-people-author">'
                        + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">We recommend you try an alternate search. Use the form above to run a different search.</p></span>'                           
                        +  '</div></div>'
                    movieListEl.innerHTML = innerResultString;
                }
                //loop through resulting list of movies from actor's results to grab details for each movie and generate movieItems for the list
                for(var i = 0; i< movieSearch.results.length; i++){
                    var id = movieSearch.results[i].id;
                    fetch("https://api.themoviedb.org/3/movie/"
                        + id
                        + "?api_key="
                        + API)

                        .then(function (detail) { return detail.json() }
                    )
                    .then(function (detail) {

                        var title = (detail.title)
                        //Boolean conditions are used to circumvent the scenario where the user has not entered values for min/max runtime and voting value
                        var maxTCondition = false;
                        var minTCondition = false;
                        var voteCondition = false;
                        if(maxMins === "" || maxMins === "undefinted"){
                            maxTCondition = true
                        }
                        if(minMins === "" || minMins === "undefined"){
                            minTCondition = true
                        }
                        if(ratingMath === "" || ratingMath === "undefined"){
                            voteCondition = true
                        }
                        // Conditions to be matched based on user's entered details and if movie has already been marked as watched before displaying in list
                        if(titleArray.indexOf(title) < 0 && (detail.runtime<=maxMins || maxTCondition) && (detail.runtime>=minMins || minTCondition) && (detail.vote_average >= ratingMath || voteCondition)){                            
                        
                            var posterURL = detail.poster_path;
                            var reportedRuntime = detail.runtime;
                            if(posterURL === null){
                                posterURL = "https://placehold.it/75";
                            }
                            else{
                                posterURL = "https://image.tmdb.org/t/p/w780//"+posterURL;
                            }
                            if(reportedRuntime === null || reportedRuntime === 0){
                                reportedRuntime = "No Runtime Recorded";
                            }
                            var genreList = detail.genres;
                                var innerGenreList = '';
                                for(var i = 0; i < genreList.length; i++){
                                    innerGenreList += '<span class="primary badge" id="genre'+i+'">';
                                    innerGenreList += genreList[i].name;
                                    innerGenreList += '</span>';
                                }

                                var reportedRating = ((detail.vote_average) * 10);
                                if (reportedRating === 0 || reportedRating === undefined || reportedRating === null){
                                    reportedRating = "No Reported Rating";
                                }

                                
                            innerResultString += '<div class="small-12 medium-9 columns about-people movieItem" onclick="switchSingleView(this)">'
                                + '<div class="about-people-avatar"><img class="avatar-image movie-poster"'
                                + ' src="'+posterURL+'"></div><div class="about-people-author">'
                                + '<span class="columns medium-12"><p class="author-name movie-title columns medium-8">'+title+'</p><p class="secondary movie-rating label">'
                                + reportedRating + '%</p></span>'
                                +  '<span class="movie-genres">' + innerGenreList + '</span>'
                                + '<p class="author-location movie-runTime">'+reportedRuntime+' mins</p>'
                                + '<p class="author-mutual movie-synopsis">'+detail.overview+'</p></div></div>'
                                + '<div class="small-12 medium-3 columns add-friend"><div class="add-friend-action">'
                                +  '<button class="button secondary small" onclick="saveListMovie(this)">'+"I'll Watch This!</button>"
                                +  '</div></div>';
                                 
                            movieListEl.innerHTML = innerResultString;
                        }                        
                    })
                    //Reaching case where none of the results were able to match necessary conditions. Generate a message for the user
                    if(i === (movieSearch.results.length-1) && movieListEl.innerHTML === ""){
                        moveUserSearchForm();
                        document.getElementById('listHeaderTitle').innerHTML = "We're sorry, but we don't see anything that might be worth your time with that criteria.";
                        innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                            + '<div class="about-people-author">'
                            + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">We recommend you try an alternate search. Use the form above to run a different search.</p></span>'                           
                            +  '</div></div>'
                        movieListEl.innerHTML = innerResultString;
                    }
                }
            })
        })
        moveUserSearchForm();

    }

    // Restore to original view without running refresh on the page
    function returnToOriginalView(){
        $("#leftView").css("display", "block");
        $("#rightView").css("display", "block");
        $("#viewWatchedList").css("display", "none");
        $("#singleView").css("display", "none");
        $("#resultListView").css("display", "none");
        document.getElementById("movieType").checked = false;
        document.getElementById("showType").checked = false;
        document.getElementById("genre-select").value = "Any";
        document.getElementById("actor").value = "";
        document.getElementById("maxMins").value = "";
        document.getElementById("minMins").value = "";
        document.getElementById("rating").value = "";
        returnUserFormtoOrginal();
    }

    // Function to run search based on prev saved Search
    function runPrevSearch() {
        document.getElementById('listHeaderTitle').innerHTML = "These Might Be Worth Your Time";
        $("#leftView").css("display", "none");
        $("#viewWatchedList").css("display", "none");
        $("#singleView").css("display", "none");
        $("#resultListView").css("display", "block");
        var innerResultString = "";
        var movieListEl = document.getElementById("movieList");

        //If the user tries to run a search for previous run search, when there is no data available to reference. (Usually only if no run has been searched yet)
        // Generate a message for the user
        if(document.querySelector("#prevActor").innerHTML === "undefined"){
            document.getElementById('listHeaderTitle').innerHTML = "Sorry, it looks like you're missing some information to run this search.";
            innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                + '<div class="about-people-author">'
                + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">We recommend you try an alternate search. Use form above to run a search.</p></span>'                           
                +  '</div></div>'
            movieListEl.innerHTML = innerResultString;
            moveUserSearchForm();
        }
        else{
            //assign values from the form to variables to run API search 
            var rating = document.querySelector("#prevRating").innerHTML.slice(0, -1).trim()
            var ratingMath = (rating / 10)
            var maxMins = document.querySelector("#prevTime").innerHTML.slice(0, -4).trim()
            var actor = document.querySelector("#prevActor").innerHTML
            var innerResultString = "";
            var movieListEl = document.getElementById("movieList");
            var output = document.querySelector('#prevGenre').innerHTML.toLowerCase()
            moveUserSearchForm();

            var exists = false;
            var titleArray = [];
            for(var i =0; i < watchedMovies.length; i++){
                titleArray.push(watchedMovies[i].title);
            }

            var API = "2215e66d3770fa7ff283fdf766c88f8c"
            var genre = 0
            if (output === "action") {
                genre = 28
            }
            if (output === "drama") {
                genre = 18
            }
            if (output === "comedy") {
                genre = 35
            }
            if (output === "family") {
                genre = 10751
            }
            if (output === "sci-fi") {
                genre = 878
            }
            if (output === "thriller") {
                genre = 53
            }
            if (output === "adventure") {
                genre = 12
            }
            if (output === "romance") {
                genre = 10749
            }
            if (output === "horror") {
                genre = 27
            }
                        
            var API = "2215e66d3770fa7ff283fdf766c88f8c"
            fetch("https://api.themoviedb.org/3/search/person?api_key=" +
            API +
            "&search_type=ngram&query=" +
            actor)

                .then(function (actorSearch) { return actorSearch.json() })
                .then(function (actorSearch) {
                    

                    var actorId = (actorSearch.results[0].id)
                    //concatinating API fetch string based on available values
                    var apiFetchString = "https://api.themoviedb.org/3/discover/movie?api_key=" +
                        API + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false"
                    if(genre != 0){
                        apiFetchString += "&with_genres=" + genre
                    }
                    if(maxMins != "" || maxMins != "undefined"){
                        apiFetchString += "&with_runtime.lte=" + maxMins 
                    }
                    apiFetchString += "&with_people=" + actorId + "&page=1" 
                    
                    fetch(apiFetchString)
                    .then(function (movieSearch) { return movieSearch.json() })
                    .then(function (movieSearch) {                
                        //Generate message for user if no values available
                        if(movieSearch.results.length === 0){
                        
                            document.getElementById('listHeaderTitle').innerHTML = "We're sorry, but we don't see anything that might be worth your time with that criteria.";
                            innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                                + '<div class="about-people-author">'
                                + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">We recommend you try an alternate search. Use the form above run a different search.</p></span>'                           
                                +  '</div></div>'
                            movieListEl.innerHTML = innerResultString;
                        }
                    
                        for(var i = 0; i< movieSearch.results.length; i++){
                            var id = movieSearch.results[i].id;
                            fetch("https://api.themoviedb.org/3/movie/"
                                + id
                                + "?api_key="
                                + API)

                            .then(function (detail) { return detail.json() }
                        )
                        .then(function (detail) {


                            var title = (detail.title)
                            var maxTCondition = false;
                            var voteCondition = false;
                            if(maxMins === "" || maxMins === "undefinted"){
                                maxTCondition = true
                            }

                            if(ratingMath === "" || ratingMath === "undefined"){
                                voteCondition = true
                            }
                            //Conditions needing to be matched if movie is to be displayed in list
                            if(titleArray.indexOf(title) < 0 && (detail.runtime<=maxMins || maxTCondition) && (detail.vote_average >= ratingMath || voteCondition)){                           
                                var posterURL = detail.poster_path;
                                var reportedRuntime = detail.runtime;
                                if(posterURL === null || posterURL === undefined){
                                    posterURL = "https://placehold.it/75";
                                }
                                else{
                                    posterURL = "https://image.tmdb.org/t/p/w780//"+posterURL;
                                }
                                if(reportedRuntime === null || reportedRuntime === 0){
                                    reportedRuntime = "No Runtime Recorded";
                                }
                                var genreList = detail.genres;
                                var innerGenreList = '';
                                for(var i = 0; i < genreList.length; i++){
                                    innerGenreList += '<span class="primary badge" id="genre'+i+'">';
                                    innerGenreList += genreList[i].name;
                                    innerGenreList += '</span>';
                                }

                                var reportedRating = ((detail.vote_average) * 10);
                                if (reportedRating === 0 || reportedRating === undefined || reportedRating === null){
                                    reportedRating = "No Reported Rating";
                                }

                                    
                                innerResultString += '<div class="small-12 medium-9 columns about-people movieItem" onclick="switchSingleView(this)">'
                                    + '<div class="about-people-avatar"><img class="avatar-image movie-poster"'
                                    + ' src="'+posterURL+'"></div><div class="about-people-author">'
                                    + '<span class="columns medium-12"><p class="author-name movie-title columns medium-8">'+title+'</p><p class="secondary movie-rating label">'
                                    + reportedRating + '%</p></span>'
                                    +  '<span class="movie-genres">' + innerGenreList + '</span>'
                                    + '<p class="author-location movie-runTime">'+reportedRuntime+' mins</p>'
                                    + '<p class="author-mutual movie-synopsis">'+detail.overview+'</p></div></div>'
                                    + '<div class="small-12 medium-3 columns add-friend"><div class="add-friend-action">'
                                    +  '<button class="button secondary small" onclick="saveListMovie(this)">'+"I'll Watch This!</button>"
                                    +  '</div></div>';
                                    
                                //youtubeSearch(title);
                                movieListEl.innerHTML = innerResultString;
                                
                            }
                        })
                        //reached end of results and none of the movies matched the conditions. Generate a message for the user
                        if(i === (movieSearch.results.length-1) && movieListEl.innerHTML === "" ){
                            document.getElementById('listHeaderTitle').innerHTML = "We're sorry, but we don't see anything that might be worth your time with that criteria.";
                            innerResultString += '<div class="small-12 medium-12 columns about-people movieItem">'
                                + '<div class="about-people-author">'
                                + '<span class="columns medium-12 center"><p class="author-name movie-title columns medium-12">We recommend you try an alternate search. Use the form above to run a different search.</p></span>'                           
                                +  '</div></div>'
                                movieListEl.innerHTML = innerResultString;
                            
                        }
                    }
                })})
            }

        
    }

    topFive();
    loadPrevSearch();