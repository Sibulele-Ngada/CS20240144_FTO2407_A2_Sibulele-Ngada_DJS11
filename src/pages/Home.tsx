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
  const sortStatus: HTMLOptionElement | null = document.querySelector("#sort");

  const [preview, setPreview] = useState<null | Preview[]>(null);
  const [sort, setSort] = useState(sortStatus?.value);
  const [previewDisplay, setPreviewDisplay] = useState<
    JSX.Element[] | undefined
  >();

  useEffect(() => {
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

  const displayPreviews =
    sort === "A-Z" ? preview : sort === "Z-A" ? preview?.reverse() : preview;

  const elements = displayPreviews?.map((showPreview) => {
    return (
      <li key={showPreview.id}>
        <h3>{showPreview.title}</h3>
      </li>
    );
  });
  //     setPreviewDisplay(elements);

  //   setTimeout(() => {
  //     setSort("Z-A");
  //   }, 10000);

  return (
    <>
      <h2>Preview</h2>
      <label htmlFor="sort">Sort: </label>
      <select name="sort" id="sort">
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
      </select>
      <ol>{elements}</ol>
    </>
  );
}
