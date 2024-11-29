import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { PuffLoader } from "react-spinners";
import { getShow } from "../api";
import { Show, Season, PlaylistItem, Fav } from "../types";

type NewTrack = {
  play: (newTrack: PlaylistItem[]) => void;
};

let newFaves: Fav[] = [];
const localFaves = localStorage.getItem("faveShowsInfo");
if (localFaves) {
  newFaves = [];
  newFaves = JSON.parse(localFaves);
}

const handleAdd = (newFave: Fav) => {
  let dupe = false;
  for (const fave of newFaves) {
    if (fave.favID === newFave.favID) {
      console.log(`Same`);
      dupe = true;
    }
  }
  if (!dupe) {
    newFaves.push(newFave);
  }
  localStorage.setItem("faveShowsInfo", JSON.stringify(newFaves));
};

export default function SeasonDetail(props: NewTrack) {
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

  useEffect(() => {
    setCurrentSeason(currentShow?.seasons[Number(season) - 1]);
  }, [season, currentShow?.seasons]);

  const episodes = currentSeason?.episodes.map((episode) => {
    return (
      <div key={episode.episode} className="season__page-item">
        <h3>{episode.title}</h3>
        <p>{episode.description}</p>
        <button
          onClick={() =>
            props.play([
              {
                name: episode.title,
                writer: currentShow?.title,
                img: currentSeason.image,
                src: episode.file,
                id: 1,
              },
            ])
          }
        >
          Play
        </button>
        <button
          onClick={() => {
            console.log(newFaves.length);

            const addFave = {
              showID: currentShow?.id,
              season: currentSeason.season,
              episode: episode.episode,
              favID:
                currentShow?.id +
                currentSeason.season.toString() +
                episode.episode.toString(),
              dateFaved: new Date(),
            };
            handleAdd(addFave);

            console.log(newFaves.length);
          }}
        >
          Add to favourites
        </button>
      </div>
    );
  });

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
        <h2>{currentSeason?.title}</h2>
      </div>
      <div className="season__page-season-container">{episodes}</div>
    </div>
  );
}
