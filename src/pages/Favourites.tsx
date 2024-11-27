import { useState, useEffect } from "react";
import { favs } from "../favs";
import { showData } from "../showData";
import { Show } from "../types";
import { PuffLoader } from "react-spinners";

export default function Favourites() {
  const [favShows, setFavShows] = useState<Show[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const showAccumulator: Show[] = [];
    const faveIDs = new Set(favs.map((fave) => fave.showID));
    showData.forEach((show) => {
      if ([...faveIDs].includes(show.id)) showAccumulator.push(show);
    });
    setFavShows(showAccumulator);
    setLoading(false);
  }, []);

  const favedShows = favShows?.map((show) => {
    return <h2 key={show.id}>{show.title}</h2>;
  });

  // Loader styles
  const override = {
    display: "block",
    margin: "50vh auto",
  };

  return (
    <div className="favs-page">
      <PuffLoader
        loading={loading}
        cssOverride={override}
        color="#4fa94d"
        size={150}
        aria-label="Loading Spinner"
      />
      <div className="favs-page__header">{!loading && <h1>Favourites</h1>}</div>
      <div className="favs-page__items">{favedShows}</div>
    </div>
  );
}
