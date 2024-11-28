import { Outlet } from "react-router";
import AudioPlayer, { ActiveUI } from "react-modern-audio-player";
import Header from "./Header";
import Footer from "./Footer";
// import NowPlaying from "./NowPlaying";
import { playlistItem } from "../playlist";

import { playList } from "../playlist";

const activeUI: ActiveUI = {
  playButton: true,
  volume: true,
  volumeSlider: true,
  trackTime: true,
  trackInfo: true,
  artwork: true,
  progress: "bar",
};

type PlayistProp = {
  playlist: playlistItem[];
};

function NowPlaying(props: PlayistProp) {
  return <AudioPlayer playList={props.playlist} activeUI={activeUI} />;
}

export default function Layout() {
  return (
    <div className="site-wrapper">
      <Header />
      <main>
        <Outlet />
        <NowPlaying playlist={playList} />
      </main>
      <Footer />
    </div>
  );
}
