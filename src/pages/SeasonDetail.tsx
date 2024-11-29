import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { PuffLoader } from "react-spinners";
import { getShow } from "../api";
import { Show, Season, PlaylistItem, Fav } from "../types";
import { Card, CardActions, CardContent, Button, Stack } from "@mui/material";

type SeasonProps = {
  play: (newTrack: PlaylistItem[]) => void;
};

// Handle adding to favourites
let newFaves: Fav[] = [];
const handleAdd = (newFave: Fav) => {
  const localFaves = localStorage.getItem("faveShowsInfo");
  if (localFaves !== null) {
    newFaves = JSON.parse(localFaves);
  }

  // Check for duplicates
  let dupe = false;
  for (const fave of newFaves) {
    if (fave.favID === newFave.favID) {
      alert(
        `This episode was added to favourites on ${fave.dateFaved.toDateString()}`
      );
      dupe = true;
    }
  }

  if (!dupe) {
    newFaves.push(newFave);
    alert(`Added to favourites`);
  }
  localStorage.setItem("faveShowsInfo", JSON.stringify(newFaves));
  newFaves.splice(0, newFaves.length); // Clear the array after commiting to local storage
};

export default function SeasonDetail(props: SeasonProps) {
  const [currentShow, setCurrentShow] = useState<Show>();
  const [currentSeason, setCurrentSeason] = useState<Season>();
  const [loading, setLoading] = useState(false);
  const { id, season } = useParams();

  // Load shows
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
      <Card
        raised={true}
        sx={{
          backgroundColor: "#213547",
          color: "white",
          alignItems: "center",
        }}
        key={episode.episode}
        className="season__page-item"
      >
        <CardContent>
          <h3>{episode.title}</h3>
          <p>{episode.description}</p>
        </CardContent>
        <CardActions>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
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
            </Button>
            <Button
              variant="contained"
              onClick={() => {
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
              }}
            >
              Favourite
            </Button>
          </Stack>
        </CardActions>
      </Card>
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
