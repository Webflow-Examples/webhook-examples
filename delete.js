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
