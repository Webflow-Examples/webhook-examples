// return if newly created item is not in the right collection
const moviesCollection = "6353176f2cf2501b7755dae3";
if (context.params._cid !== moviesCollection) return;

// import external package, using algolia in this example
import algoliasearch from "algoliasearch";

//establish connection to algolia dashboard
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

// declare index to work with
const index = client.initIndex("movies");

let allGenreNames = [];

// destructure values from context params which includes the Webflow CMS item data
const { _id, name, slug, genres, overview, popularity, trailer } =
  context.params;

// since we shouldn't add the itemId to the index, we need to see which genre name the itemId corresponds to so we can add that to the index instead
const allMovieGenres = [
  { id: "28", name: "Action", itemId: "6350c466177fc03ab366dbde" },
  { id: 12, name: "Adventure", itemId: "6350c466fc61527feb98ed8d" },
  { id: 16, name: "Animation", itemId: "6350c4669fddb42553273d22" },
  { id: 35, name: "Comedy", itemId: "6350c46611c67034a8dd3950" },
  { id: 80, name: "Crime", itemId: "6350c46672526eaf9a608e0f" },
  { id: 99, name: "Documentary", itemId: "6350c46646bb1dba9bac4506" },
  { id: 18, name: "Drama", itemId: "6350c4663aebc3d9ab68b239" },
  { id: 10751, name: "Family", itemId: "6350c466b8b704cc5e00bba4" },
  { id: 14, name: "Fantasy", itemId: "6350c467716c1349cd979ea5" },
  { id: 36, name: "History", itemId: "6350c466e48b907aae3dc343" },
  { id: 27, name: "Horror", itemId: "6350c4661f96af44035b5d8b" },
  { id: 10402, name: "Music", itemId: "6350c466cc865494f30b2562" },
  { id: 9648, name: "Mystery", itemId: "6350c4662be0acf3c39fcfe1" },
  { id: 10749, name: "Romance", itemId: "6350c466e3858126836a733c" },
  { id: 878, name: "Science Fiction", itemId: "6350c466227c9381e733fc5f" },
  { id: 10770, name: "TV Movie", itemId: "6350c466c1cf132f292a862e" },
  { id: 53, name: "Thriller", itemId: "6350c466968264447a173718" },
  { id: 10752, name: "War", itemId: "6350c466227c9320d433fc60" },
  { id: 37, name: "Western", itemId: "6350c46672526e68ea608e10" },
];

// get the relevant genre name for newly created collection item
genres.forEach((genreId) => {
  const matchedGenre = allMovieGenres.find((genre) => genre.itemId === genreId);
  if (matchedGenre) allGenreNames.push(matchedGenre.name);
});

// create the structure for the data being added to the algolia index
const newMovie = {
  objectID: _id,
  name,
  slug,
  genres: allGenreNames,
  overview,
  movieBackdropPoster: context.params["movie-backdrop-poster"].url,
  moviePoster: context.params["movie-poster"].url,
  movieId: context.params["movie-id"],
  releaseDate: context.params["release-date"],
  releaseYear: context.params["release-year"],
  voteAverage: context.params["vote-average"],
  voteCount: context.params["vote-count"],
  popularity,
};

// make api call to algolia index to add item
return index
  .saveObject(newMovie, { autoGenerateObjectIDIfNotExist: true })
  .then(() => console.log("object added to index"))
  .catch((err) => console.log(err));
