import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { getPreviews } from "../api";
import { Preview } from "../types";
import { PuffLoader } from "react-spinners";

export default function Home() {
  const [preview, setPreview] = useState<Preview[]>([]);
  const [displayedPreviews, setDisplayedPreviews] = useState<Preview[]>([]);
  const [sortParam, setSortParam] = useState<string>("alpha");
  const [sort, setSort] = useState(true);
  const [loading, setLoading] = useState(false);

  const genres = [
    "Personal Growth",
    "Investigative Journalism",
    "History",
    "Comedy",
    "Entertainment",
    "Business",
    "Fiction",
    "News",
    "Kids and Family",
  ];

  useEffect(() => {
    setLoading(true);
    async function loadPreviews() {
      setLoading(true);

      try {
        const previews = await getPreviews();
        setPreview(previews);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadPreviews();
  }, []);

  const sortPreview = useCallback(
    (sortBy: string, ascending: boolean) => {
      let sortedArray: Preview[];

      function sortAlphaHandler(a: Preview, b: Preview) {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      }

      function sortDateHandler(a: Preview, b: Preview) {
        if (new Date(a.updated) > new Date(b.updated)) {
          return -1;
        }
        if (new Date(a.updated) < new Date(b.updated)) {
          return 1;
        }
        return 0;
      }

      if (sortBy == "alpha") {
        sortedArray = [...preview].sort(sortAlphaHandler);
        if (ascending) return sortedArray;
        if (!ascending) return sortedArray.reverse();
      }

      if (sortBy == "date") {
        sortedArray = [...preview].sort(sortDateHandler);
        if (ascending) return sortedArray;
        if (!ascending) return sortedArray.reverse();
      }

      return preview;
    },
    [preview]
  );

  useEffect(() => {
    setDisplayedPreviews(sortPreview(sortParam, sort));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, sortPreview]);

  const elements = displayedPreviews?.map((showPreview) => {
    const nuweDatum = new Date(showPreview.updated);
    // Get genre titles
    const genreArray = showPreview.genres
      .map((genreID) => {
        const genreTitle = genres[genreID - 1];
        return genreTitle;
      })
      .toString() // Set to comma separated string
      .split(","); // Split at commas for individual genres
    const genreText = genreArray.join(" | "); //

    return (
      <Link to={showPreview.id} key={showPreview.id}>
        <div className="list__item">
          <div className="list__item-title-container">
            <h3 className="list__item-title">{showPreview.title}</h3>
            <img src={showPreview.image} className="list__item-image" />
          </div>
          <div className="list__item-details">
            <p>{nuweDatum.toDateString()}</p>
            <p>{genreText}</p>
            <p>Seasons: {showPreview.seasons}</p>
          </div>
        </div>
      </Link>
    );
  });

  function handleSortSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSort((prevSort) => !prevSort);
  }

  function handleSortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    setSortParam(value);
  }

  // Loader styles
  const override = {
    display: "block",
    margin: "50vh auto",
  };

  return (
    <div className="home_page">
      <PuffLoader
        loading={loading}
        cssOverride={override}
        color="#4fa94d"
        size={150}
        aria-label="Loading Spinner"
      />
      {!loading && <h2 className="home-page__title">Preview</h2>}
      {!loading && (
        <form onSubmit={handleSortSubmit} className="home-page__sort">
          <fieldset>
            <label htmlFor="alphabeteical">Alpha </label>
            <input
              type="radio"
              id="alphaSort"
              name="sort"
              value="alpha"
              onChange={handleSortChange}
            />
            <label htmlFor="dateSort">Date </label>
            <input
              type="radio"
              id="dateSort"
              name="sort"
              value="date"
              onChange={handleSortChange}
            />
            {sort && <button>Sort: &uarr;</button>}
            {!sort && <button>Sort: &darr;</button>}
          </fieldset>
        </form>
      )}
      <div className="list">{elements}</div>
    </div>
  );
}
