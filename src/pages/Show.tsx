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
  const [currentShow, setCurrentShow] = useState<Show>();
  const { id } = useParams();

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setCurrentShow(data))
      .catch(() => console.log(`Error fetching show`));
  }, [id]);

  const title = currentShow ? currentShow.title : "no data";
  const seasons: Season[] = currentShow ? currentShow.seasons : [];
  const seasonElements = seasons.map((season) => {
    return (
      <>
        <h4>
          Season {season.season}: {season.episodes.length} Episodes
        </h4>
        <a href={season.episodes[0].file} target="_blank">
          {season.episodes[0].title}
        </a>
      </>
    );
  });

  return (
    <>
      <h1>{title}</h1>
      <h2>Seasons: {seasons?.length}</h2>
      <div>{seasonElements}</div>
    </>
  );
}
