import { useState, useEffect, useCallback } from "react";
import { showData } from "../showData";
import { Show, Season, Episode, PlaylistItem, Fav } from "../types";
import { PuffLoader } from "react-spinners";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

type NewTrack = {
  play: (newTrack: PlaylistItem[]) => void;
};

export default function Favourites(props: NewTrack) {
  const [localFaves, setLocalFaves] = useState(
    localStorage.getItem("faveShowsInfo")
  );
  const [favShows, setFavShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [favouriting, setFavouriting] = useState<Fav[]>();
  const [sortParam, setSortParam] = useState<string>("alpha");
  const [sort, setSort] = useState(true);

  const handleDelete = (unFave: Fav) => {
    const deletingArray = favouriting;

    if (!deletingArray) {
      localStorage.clear();
    } else {
      for (const fave of deletingArray) {
        if (fave.favID === unFave.favID) {
          const i = deletingArray?.indexOf(fave);
          deletingArray.splice(i, 1);
        }
      }
    }

    if (deletingArray?.length === undefined) {
      localStorage.clear();
    } else {
      localStorage.setItem("faveShowsInfo", JSON.stringify(deletingArray));
      setFavouriting(deletingArray);
      setLocalFaves(localStorage.getItem("faveShowsInfo"));
    }
  };

  useEffect(() => {
    if (!localFaves) {
      localStorage.clear();
    } else {
      setFavouriting(JSON.parse(localFaves));
    }
  }, [localFaves]);

  useEffect(() => {
    setLoading(true);

    try {
      const faveIDs = new Set(favouriting?.map((fave) => fave.showID));
      const showAccumulator: Show[] = showData.filter((show) => {
        if ([...faveIDs].includes(show.id)) {
          return show;
        }
      });
      setFavShows(showAccumulator);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [favouriting, loading]);

  const sortFavourites = useCallback(
    (sortBy: string, ascending: boolean) => {
      let sortedArray: Show[];
      function sortAlphaHandler(a: Show, b: Show) {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      }

      function sortDateHandler(a: Show, b: Show) {
        if (new Date(a.updated) > new Date(b.updated)) {
          return -1;
        }
        if (new Date(a.updated) < new Date(b.updated)) {
          return 1;
        }
        return 0;
      }

      if (sortBy == "alpha") {
        sortedArray = [...favShows].sort(sortAlphaHandler);
        if (ascending) return sortedArray;
        if (!ascending) return sortedArray.reverse();
      }

      if (sortBy == "date") {
        sortedArray = [...favShows].sort(sortDateHandler);
        if (ascending) return sortedArray;
        if (!ascending) return sortedArray.reverse();
      }

      return favShows;
    },
    [favShows]
  );

  const displayedShows = sortFavourites(sortParam, sort);

  const favedShows = displayedShows?.map((show) => {
    const favedSeasons = favouriting
      ?.filter((faveShow) => faveShow.showID === show.id)
      .map((fave) => fave.season);

    const episodeArray: { episode: Episode; season: number }[] = [];

    const seasonArray: Season[] = show.seasons.filter((singleSeason) => {
      if (!favedSeasons) return;
      for (const season of favedSeasons) {
        if (season === singleSeason.season) {
          singleSeason.episodes.forEach((episode) => {
            favouriting?.forEach((fave) => {
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

      let dateAdded: Date;
      //   const deletingArray = favouriting;
      const episodeElements = seasonEpisodes.map((episode) => {
        let index: number = -2;
        favouriting?.forEach((fave) => {
          if (
            fave.favID ===
            show.id + season.season.toString() + episode.episode.toString()
          ) {
            index = favouriting?.indexOf(fave);
          }
        });

        if (favouriting) dateAdded = favouriting[index].dateFaved;
        const displayDate = new Date(dateAdded);
        return (
          <Card
            raised={true}
            className="favs-page__item"
            sx={{
              backgroundColor: "#213547",
              color: "white",
              alignItems: "center",
            }}
            key={episode.title}
          >
            <CardContent>
              <h4>{episode.title}</h4>
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
                        writer: show.title,
                        img: season.image,
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
                  endIcon={<DeleteIcon />}
                  onClick={() => {
                    const deleteFave = {
                      showID: show.id,
                      season: season.season,
                      episode: episode.episode,
                      favID:
                        show.id +
                        season.season.toString() +
                        episode.episode.toString(),
                      dateFaved: new Date(),
                    };

                    handleDelete(deleteFave);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </CardActions>
            <h6>Date added: {displayDate.toDateString()}</h6>
          </Card>
        );
      });
      return (
        <div key={season.season + season.title}>
          {" "}
          <h3>{season.title}</h3>
          <div className="favs-page__episodes">{episodeElements}</div>
        </div>
      );
    });

    return (
      <div key={show.id}>
        <h2>{show.title}</h2>
        <div className="favs-page__season">{seasonElements}</div>
      </div>
    );
  });

  function handleSortSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSort((prevSort) => !prevSort);
  }

  function handleSortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    setSortParam(value);
  }

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
      <div className="favs-page__header">
        {!loading && <h1>Your Favourites</h1>}
        {!loading && (
          <Stack
            spacing={2}
            direction="row"
            component="form"
            onSubmit={handleSortSubmit}
            className="home-page__sort"
          >
            <FormControl>
              <RadioGroup
                row
                name="sort-radio-group"
                value={sortParam}
                onChange={handleSortChange}
              >
                <FormControlLabel
                  value="alpha"
                  control={<Radio />}
                  label="A - Z"
                />
                <FormControlLabel
                  value="date"
                  control={<Radio />}
                  label="Date"
                />
              </RadioGroup>
            </FormControl>
            {sort && (
              <Button type="submit" variant="contained">
                Sort: &uarr;
              </Button>
            )}
            {!sort && (
              <Button type="submit" variant="contained">
                Sort: &darr;
              </Button>
            )}
          </Stack>
        )}
        <Button
          disabled={!favouriting}
          className="clear-favourites"
          endIcon={<DeleteIcon />}
          variant="contained"
          onClick={() => {
            localStorage.removeItem("faveShowsInfo");
            setFavouriting(undefined);
            setLocalFaves(localStorage.getItem("faveShowsInfo"));
          }}
        >
          Clear favourites
        </Button>
      </div>
      <div className="favs-page__show">{favedShows}</div>
    </div>
  );
}
