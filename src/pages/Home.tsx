import { useState, useEffect } from "react";
import { Link } from "react-router";

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

    fetch("https://podcast-api.netlify.app")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setPreview(data.sort(compare));
      })
      .catch(() => console.log(`Error fetching preview`));
  }, []);

  let sortedPreview;
  if (sort === "A-Z") {
    sortedPreview = preview;
  } else {
    sortedPreview = [...preview].reverse();
  }
  const elements = sortedPreview?.map((showPreview) => {
    return (
      <Link to={showPreview.id} key={showPreview.id}>
        <div className="list__item">
          <div className="list__item-title-container">
            <h3 className="list__item-title">{showPreview.title}</h3>
            <img src={showPreview.image} className="list__item-image" />
          </div>
          {/* <p>{showPreview.description}</p> */}
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

  return (
    <div className="home_page">
      <h2 className="home_page__title">Preview</h2>
      <button onClick={toggleSort}>Sort: {sort}</button>
      <div className="list">{elements}</div>
    </div>
  );
}
