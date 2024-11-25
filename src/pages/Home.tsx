import { useState, useEffect } from "react";

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
      <li key={showPreview.id}>
        <h3>{showPreview.title}</h3>
      </li>
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
    <>
      <h2>Preview</h2>
      <button onClick={toggleSort}>Sort: {sort}</button>
      <ol>{elements}</ol>
    </>
  );
}
