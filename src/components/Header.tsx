import { Link } from "react-router";
import imageUrl from "../assets/avatar-icon.png";

export default function Header() {
  return (
    <header>
      <Link className="site-logo" to="/">
        Podcast App
      </Link>
      <Link to="/" className="login-link">
        <img src={imageUrl} className="login-icon" />
      </Link>
    </header>
  );
}
