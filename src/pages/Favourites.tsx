import { useState, useEffect } from "react";
import { favs } from "../favs";
import { showData } from "../showData";
import { Show, Season, Episode } from "../types";
import { PuffLoader } from "react-spinners";

export default function Favourites() {
  const [favShows, setFavShows] = useState<Show[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const showAccumulator: Show[] = [];
    const faveIDs = new Set(favs.map((fave) => fave.showID));
    showData.forEach((show) => {
      if ([...faveIDs].includes(show.id)) {
        showAccumulator.push(show);
      }
    });
    setFavShows(showAccumulator);
    setLoading(false);
  }, []);

  const favedShows = favShows?.map((show) => {
    const favedSeasons = favs
      .filter((faveShow) => faveShow.showID === show.id)
      .map((fave) => fave.season);

    const episodeArray: { episode: Episode; season: number }[] = [];

    const seasonArray: Season[] = show.seasons.filter((singleSeason) => {
      for (const season of favedSeasons) {
        if (season === singleSeason.season) {
          singleSeason.episodes.forEach((episode) => {
            favs.forEach((fave) => {
              if (
                fave.showID === show.id &&
                fave.season === season &&
                fave.episode === episode.episode
              ) {
                episodeArray.push({ episode: episode, season: season });
              }
            });
          });
          return singleSeason;
        }
      }
    });

    const seasonElements = seasonArray.map((season) => {
      const seasonEpisodes = episodeArray
        .filter((ep) => season.season === ep.season)
        .map((episode) => episode.episode);

      const episodeElements = seasonEpisodes.map((episode) => {
        return (
          <div className="favs-page__item">
            <p>{episode.title}</p>
            <p>{episode.description}</p>
            <audio controls src={episode.file}></audio>
          </div>
        );
      });
      return (
        <div>
          {" "}
          <h3>{season.title}</h3>
          <div className="favs-page__episodes">{episodeElements}</div>
        </div>
      );
    });

    return (
      <div>
        <h2 key={show.id}>{show.title}</h2>
        <div className="favs-page__season">{seasonElements}</div>
      </div>
    );
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
      <div className="favs-page__show">{favedShows}</div>
    </div>
  );
}
