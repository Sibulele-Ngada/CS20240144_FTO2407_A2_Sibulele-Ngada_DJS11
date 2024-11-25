import { useState, useEffect } from "react";
import { useParams } from "react-router";

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
  const currentSeason: HTMLSelectElement | null =
    document.querySelector("#season");
  const [currentShow, setCurrentShow] = useState<Show>();
  const [season, setSeason] = useState<number>(1);
  const { id } = useParams();

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCurrentShow(data);
        setSeason(1);
      })
      .catch(() => console.log(`Error fetching show`));
  }, [id]);

  const title = currentShow ? currentShow.title : "no data";
  const seasons: Season[] = currentShow ? currentShow.seasons : [];
  const seasonElements = seasons.map((season) => {
    return (
      <option value={season.season} key={season.season}>
        {season.title}: {season.episodes.length} Episodes
      </option>
    );
  });

  function seasonChange() {
    const newSeason = currentSeason?.value;
    setSeason(Number(newSeason));
  }

  const episodeLinks = seasons[season - 1]?.episodes.map((episode) => {
    return (
      <li key={episode.episode}>
        <a href={episode.file} target="_blank">
          {episode.title}
        </a>
        <p>{episode.description}</p>
      </li>
    );
  });

  return (
    <>
      <h1>{title}</h1>
      <h2>Seasons: {seasons?.length}</h2>
      <select name="seasons" id="season" onChange={seasonChange}>
        {seasonElements}
      </select>
      <ul>{episodeLinks}</ul>
    </>
  );
}
