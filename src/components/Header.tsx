import { Link } from "react-router";
import "@coreui/coreui/dist/css/coreui.min.css";
import imageUrl from "../assets/avatar-icon.png";

export default function Header() {
  return (
    <header>
      <nav className="nav">
        <Link className="site-title" to="/">
          Podcast App
        </Link>
        <ul>
          <li>Favourites</li>
          <li>
            <Link to="/" className="login-link">
              <img src={imageUrl} className="login-icon" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
