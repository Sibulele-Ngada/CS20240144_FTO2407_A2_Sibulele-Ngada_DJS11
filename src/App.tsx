import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import SeasonDetail from "./pages/SeasonDetail";
import Favourites from "./pages/Favourites";
import { PlaylistItem } from "./types";

export default function App() {
  // Set audio player default state
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([
    {
      name: "Theme",
      writer: "PodcastApp",
      img: "https://cdn.pixabay.com/photo/2021/09/06/16/45/nature-6602056__340.jpg",
      src: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
      id: 1,
    },
  ]);

  function getNewTrack(newTrack: PlaylistItem[]) {
    setPlaylist(newTrack);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout playlist={playlist} />}>
          <Route index element={<Home />} />
          <Route
            path="favourites"
            element={<Favourites play={getNewTrack} />}
          />
          <Route path=":id" element={<ShowDetail />}>
            <Route
              path=":season"
              element={<SeasonDetail play={getNewTrack} />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
