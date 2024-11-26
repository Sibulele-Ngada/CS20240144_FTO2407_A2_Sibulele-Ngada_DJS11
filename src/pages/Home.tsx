import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ScaleLoader } from "react-spinners";

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
  const [sort, setSort] = useState("A-Z");
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
    // Default sort logic
    function compare(a: Preview, b: Preview) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    }

    setLoading(true);

    fetch("https://podcast-api.netlify.app")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setPreview(data.sort(compare));
      })
      .catch(() => console.log(`Error fetching preview`))
      .finally(() => setLoading(false));
  }, []);

  let sortedPreview;
  if (sort === "A-Z") {
    sortedPreview = preview;
  } else {
    sortedPreview = [...preview].reverse();
  }
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

  function toggleSort() {
    if (sort === "A-Z") {
      setSort("Z-A");
    } else if (sort === "Z-A") {
      setSort("A-Z");
    }
  }

  // Loader styles
  const override = {
    display: "block",
    margin: "auto auto",
  };

  return (
    <div className="home_page">
      <ScaleLoader
        loading={loading}
        cssOverride={override}
        color="#4fa94d"
        // size={20}
        aria-label="Loading Spinner"
      />
      {!loading && <h2 className="home_page__title">Preview</h2>}
      {!loading && <button onClick={toggleSort}>Sort: {sort}</button>}
      <div className="list">{elements}</div>
    </div>
  );
}
