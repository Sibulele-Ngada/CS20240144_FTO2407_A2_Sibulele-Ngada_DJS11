import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import NowPlaying from "./NowPlaying";

export default function Layout() {
  return (
    <div className="site-wrapper">
      <Header />
      <main>
        <Outlet />
        <NowPlaying />
      </main>
      <Footer />
    </div>
  );
}
