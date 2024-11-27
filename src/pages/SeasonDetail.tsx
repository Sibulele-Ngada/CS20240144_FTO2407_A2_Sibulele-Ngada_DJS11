import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { PuffLoader } from "react-spinners";
import { getShow } from "../api";
import { Show, Season } from "../types";

export default function SeasonDetail() {
  const [currentShow, setCurrentShow] = useState<Show>();
  const [currentSeason, setCurrentSeason] = useState<Season>();
  const [loading, setLoading] = useState(false);
  const { id, season } = useParams();

  useEffect(() => {
    async function getNewShow() {
      setLoading(true);

      try {
        if (!id) throw new Error(`No show ID`);
        const newShow = await getShow(id);
        setCurrentShow(newShow);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getNewShow();
  }, [id]);

  const title = currentShow?.title;

  const seasonsElements = currentShow?.seasons.map((season) => {
    return (
      <option
        key={season.season}
        value={season.season}
      >{`${season.title}: ${season.episodes.length} Episodes`}</option>
    );
  });

  useEffect(() => {
    setCurrentSeason(currentShow?.seasons[Number(season) - 1]);
  }, [season, currentShow?.seasons]);

  const episodes = currentSeason?.episodes.map((episode) => {
    return (
      <div key={episode.episode} className="season__page-item">
        <a href={episode.file} target="_blank">
          <h3>{episode.title}</h3>
          <p>{episode.description}</p>
        </a>
      </div>
    );
  });

  function handleSeasonChange() {
    const seasonSelector = document.querySelector(
      "#seasonSelect"
    ) as HTMLSelectElement;
    const newSeason = seasonSelector.value;
    setCurrentSeason(currentShow?.seasons[Number(newSeason) - 1]);
  }

  // Loader styles
  const override = {
    display: "block",
    margin: "50vh auto",
  };

  return (
    <div className="season__page">
      <PuffLoader
        loading={loading}
        cssOverride={override}
        color="#4fa94d"
        size={150}
        aria-label="Loading Spinner"
      />
      <div className="season__page-header">
        {!loading && (
          <Link to={`..`} relative="path" className="back-button">
            &larr; <span>Back to show</span>
          </Link>
        )}
        {!loading && (
          <img src={currentSeason?.image} className="season__page-banner" />
        )}
        <h1>{title}</h1>
        <h2>{currentSeason?.title}</h2>
        {!loading && (
          <label htmlFor="seasonSelect">
            Select Season:{" "}
            <select
              name="seasonSelect"
              id="seasonSelect"
              onChange={handleSeasonChange}
            >
              {seasonsElements}
            </select>
          </label>
        )}
      </div>
      <div className="season__page-season-container">{episodes}</div>
    </div>
  );
}
