# Webhook Examples

Automatically perform actions as CMS data changes in Webflow through webhooks.

# How it works

The Webflow API includes [webhook trigger types](https://developers.webflow.com/#triggertype) that allow you to tie into certain events. Using these triggers, we can write additional code to connect to other apis.

In this example, we'll look at how we can update an Algolia search index when data is added and deleted in Webflow. This will allow data to remain in sync between Webflow and the external platform (i.e., search index) as we change our collections in these scenarios.

**Note:** _this repo looks at the `collection_item_created` and `collection_item_deleted` triggers. Apply the same concept for the `collection_item_changed` trigger to ensure the external platform is updated collection data is changed._

# Adding webhooks

These webhooks must be added through the Webflow API. We can use a tool like Postman to accomplish this.

### Collection item created

<img src="https://wadoodh.github.io/images/collection-item-created-webhook.png" alt="collection-item-created-webhook">

### Collection item deleted

<img src="https://wadoodh.github.io/images/collection-item-deleted-webhook.png" alt="collection-item-deleted-webhook">

Once the webhooks are added, they will appear in your Webflow site under Project settings > Integrations > Webhooks.

<img src="https://wadoodh.github.io/images/webhooks-in-project.png" alt="collection-item-deleted-webhook">

Now, as we create and delete items in our CMS, our server can respond to those changes. Here's a screenshot of server logs responding to newly created items.

<img src="https://wadoodh.github.io/images/webhook-logs-new.png" alt="server logs showing successful api operation">

# The Javascript

### Collection item created

```js
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
```

### Collection item deleted

```js
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

// destructure relevant id
const { itemId } = context.params;

// make api call to algolia index to delete item
return index
  .deleteObject(itemId)
  .then(() => console.log("Item deleted from search index"))
  .catch((err) => console.log(err));
```
