import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Show from "./pages/Show";

export default function App() {
  // const [preview, setPreview] = useState();
  // const [genre, setGenre] = useState();
  // const [show, setShow] = useState();

  useEffect(() => {
    // fetch("https://podcast-api.netlify.app/genre/1")
    //   .then((res) => {
    //     if (!res.ok) throw new Error();
    //     return res.json();
    //   })
    //   .then((data) => console.log(data))
    //   .catch(() => console.log(`Error fetching genre`));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":id" element={<Show />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
