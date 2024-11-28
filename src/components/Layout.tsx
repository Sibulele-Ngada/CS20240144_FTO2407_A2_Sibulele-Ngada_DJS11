import { Outlet } from "react-router";
import NowPlaying from "./NowPlaying";
import Header from "./Header";
import Footer from "./Footer";
import { PlaylistItem } from "../types";

type PlayistProp = {
  playlist: PlaylistItem[];
};

export default function Layout(props: PlayistProp) {
  return (
    <div className="site-wrapper">
      <Header />
      <main>
        <Outlet />
        <NowPlaying playlist={props.playlist} />
      </main>
      <Footer />
    </div>
  );
}
