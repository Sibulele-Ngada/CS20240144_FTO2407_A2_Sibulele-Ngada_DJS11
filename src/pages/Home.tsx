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
  const [preview, setPreview] = useState<null | Preview[]>(null);

  useEffect(() => {
    fetch("https://podcast-api.netlify.app")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setPreview(data);
      })
      .catch(() => console.log(`Error fetching preview`));
  }, []);

  const display = preview
    ? preview.map((showPrev) => {
        return (
          <li>
            <h3>{showPrev.title}</h3>
          </li>
        );
      })
    : `No shows to preview`;

  return (
    <>
      <h2>Preview</h2>
      <ol>{display}</ol>
    </>
  );
}
