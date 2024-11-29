import { useState, useEffect, useCallback } from "react";
import { showData } from "../showData";
import { Show, Season, Episode, PlaylistItem, Fav } from "../types";
import { PuffLoader } from "react-spinners";

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
      console.log(`Nothing to delete`);
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
  console.log(`Load? ${favouriting?.length}`);

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
      console.log(`FaveIDs at line 48 in Favourites - They say ${err}`);
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
          <div className="favs-page__item" key={episode.title}>
            <p>{episode.title}</p>
            <p>{episode.description}</p>
            <button
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
            </button>
            <button
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
                // localStorage.clear();
                // let index: number = -2;
                // deletingArray?.forEach((fave) => {
                //   if (
                //     fave.favID ===
                //     show.id +
                //       season.season.toString() +
                //       episode.episode.toString()
                //   ) {
                //     index = deletingArray.indexOf(fave);
                //   }
                // });
                // // only splice array when item is found
                // if (index > -1) {
                //   if (deletingArray?.length === 1) {
                //     localStorage.removeItem("faveShowsInfo");
                //     setFavouriting(undefined);
                //   } else {
                //     localStorage.setItem(
                //       "faveShowsInfo",
                //       JSON.stringify(deletingArray?.splice(index, 1))
                //     );
                //     setFavouriting(deletingArray);
                //   }
                // }
              }}
            >
              Remove from favourites
            </button>
            <h6>Date added: {displayDate.toDateString()}</h6>
          </div>
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
        {!loading && <h1>Favourites</h1>}
        {!loading && (
          <form onSubmit={handleSortSubmit} className="home-page__sort">
            <fieldset>
              <label htmlFor="alphabeteical">Alpha </label>
              <input
                type="radio"
                id="alphaSort"
                name="sort"
                value="alpha"
                onChange={handleSortChange}
              />
              <label htmlFor="dateSort">Date </label>
              <input
                type="radio"
                id="dateSort"
                name="sort"
                value="date"
                onChange={handleSortChange}
              />
              {sort && <button>Sort: &uarr;</button>}
              {!sort && <button>Sort: &darr;</button>}
            </fieldset>
          </form>
        )}
        {!favouriting && <h1>No faves to display</h1>}
      </div>
      <div className="favs-page__show">{favedShows}</div>
    </div>
  );
}
