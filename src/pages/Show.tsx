import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { PuffLoader } from "react-spinners";

type Show = {
  description: string;
  genres: number[];
  id: string;
  image: string;
  seasons: Season[];
  title: string;
  updated: string;
};

type Season = {
  episodes: Episode[];
  image: string;
  season: number;
  title: string;
};

type Episode = {
  description: string;
  episode: number;
  file: string;
  title: string;
};

export default function Show() {
  // const currentSeason = document.querySelector("#season") as HTMLSelectElement;
  const [currentShow, setCurrentShow] = useState<Show>();
  const [loading, setLoading] = useState(false);
  // const [season, setSeason] = useState<number>(1);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCurrentShow(data);
        // setSeason(1);
      })
      .catch(() => console.log(`Error fetching show`))
      .finally(() => setLoading(false));
  }, [id]);

  const title = currentShow?.title;
  const seasons = currentShow?.seasons;

  const seasonElements = seasons?.map((season) => {
    return (
      <Link to={season.season.toString()} key={season.season}>
        <div className="show__page-season">
          <h3>{season.title}</h3>
          <img src={season.image} className="show__page-season-image" />
          <p>Episodes: {season.episodes.length}</p>
        </div>
      </Link>
    );
  });

  // const seasonElements = seasons.map((season) => {
  //   return (
  //     <option value={season.season} key={season.season}>
  //       {season.title}: {season.episodes.length} Episodes
  //     </option>
  //   );
  // });

  // function seasonChange() {
  //   const newSeason = currentSeason?.value;
  //   setSeason(Number(newSeason));
  // }

  // const episodeLinks = seasons[season - 1]?.episodes.map((episode) => {
  //   return (
  //     <li key={episode.episode}>
  //       <a href={episode.file} target="_blank">
  //         {episode.title}
  //       </a>
  //       <p>{episode.description}</p>
  //     </li>
  //   );
  // });

  // Loader styles
  const override = {
    display: "block",
    margin: "50vh auto",
  };

  return (
    <div className="show__page">
      <PuffLoader
        loading={loading}
        cssOverride={override}
        color="#4fa94d"
        size={150}
        aria-label="Loading Spinner"
      />
      <div className="show__page-header">
        {!loading && (
          <Link to={`..`} relative="path" className="back-button">
            &larr; <span>Back to shows</span>
          </Link>
        )}
        <h1>{title}</h1>
        <p>{currentShow?.description}</p>
        {/* <h2>Seasons: {seasons?.length}</h2> */}
      </div>
      <div className="show__page-season-container">{seasonElements}</div>
      {/* <select name="seasons" id="season" onChange={seasonChange}>
        {seasonElements}
      </select>
      <ul>{episodeLinks}</ul> */}
    </div>
  );
}
