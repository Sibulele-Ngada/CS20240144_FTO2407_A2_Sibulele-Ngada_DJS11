import { useState, useEffect } from "react";
import { Link } from "react-router";
import { PuffLoader } from "react-spinners";

type Preview = {
  description: string;
  genres: number[];
  id: string;
  image: string;
  seasons: number;
  title: string;
  updated: string;
};

export default function Home() {
  const [preview, setPreview] = useState<Preview[]>([]);
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

    fetch("https://podcast-api.netlify.app")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setPreview(data);
      })
      .catch(() => console.log(`Error fetching preview`))
      .finally(() => setLoading(false));
  }, []);

  function sortPreview(sortBy: string, ascending: boolean) {
    let sortedArray;
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
      if (new Date(a.updated) < new Date(b.updated)) {
        return -1;
      }
      if (new Date(a.updated) > new Date(b.updated)) {
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
  }

  const sortedPreview = sortPreview(sortParam, sort);
  // if (sort === "A-Z") {
  //   sortedPreview = preview;
  // } else {
  //   sortedPreview = [...preview].reverse();
  // }
  const elements = sortedPreview?.map((showPreview) => {
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
    event.currentTarget.reset();
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
              id="alphabetical"
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
            <button>Sort</button>
          </fieldset>
        </form>
      )}
      <div className="list">{elements}</div>
    </div>
  );
}
