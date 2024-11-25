import { useState, useEffect } from "react";

function App() {
  // const [preview, setPreview] = useState();
  // const [genre, setGenre] = useState();
  // const [show, setShow] = useState();

  useEffect(() => {
    // fetch("https://podcast-api.netlify.app")
    //   .then((res) => {
    //     if (!res.ok) throw new Error();
    //     return res.json();
    //   })
    //   .then((data) => console.log(data))
    //   .catch(() => console.log(`Error fetching preview`));

    // fetch("https://podcast-api.netlify.app/genre/1")
    //   .then((res) => {
    //     if (!res.ok) throw new Error();
    //     return res.json();
    //   })
    //   .then((data) => console.log(data))
    //   .catch(() => console.log(`Error fetching genre`));

    fetch("https://podcast-api.netlify.app/id/10716")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => console.log(data))
      .catch(() => console.log(`Error fetching show`));
  }, []);

  return <></>;
}

export default App;
