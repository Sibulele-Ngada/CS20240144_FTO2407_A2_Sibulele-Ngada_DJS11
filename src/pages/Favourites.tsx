import { useState, useEffect, useCallback } from "react";
import { favs } from "../favs";
import { showData } from "../showData";
import { Show, Season, Episode } from "../types";
import { PuffLoader } from "react-spinners";

export default function Favourites() {
  const [favShows, setFavShows] = useState<Show[]>([]);
  const [displayedShows, setDisplayedShows] = useState<Show[]>();
  const [loading, setLoading] = useState(false);
  const [favouriting, setFavouriting] = useState(favs);
  const [sortParam, setSortParam] = useState<string>("alpha");
  const [sort, setSort] = useState(true);

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
  }, [favouriting]);

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

  useEffect(() => {
    setDisplayedShows(sortFavourites(sortParam, sort));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, sortFavourites]);

  const favedShows = displayedShows?.map((show) => {
    const favedSeasons = favouriting
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
        let index: number = -2;
        favs.forEach((fave) => {
          if (
            fave.favID ===
            show.id + season.season.toString() + episode.episode.toString()
          ) {
            index = favs.indexOf(fave);
          }
        });
        const dateAdded = favs[index].dateFaved;

        return (
          <div className="favs-page__item" key={episode.title}>
            <p>{episode.title}</p>
            <p>{episode.description}</p>
            <audio controls src={episode.file}></audio>
            <button
              onClick={() => {
                let index: number = -2;
                favs.forEach((fave) => {
                  if (
                    fave.favID ===
                    show.id +
                      season.season.toString() +
                      episode.episode.toString()
                  ) {
                    index = favs.indexOf(fave);
                  }
                });
                // only splice array when item is found
                if (index > -1) {
                  favs.splice(index, 1);
                }
                setFavouriting([...favs]);
              }}
            >
              Remove from favourites
            </button>
            <h6>Date added: {dateAdded?.toDateString()}</h6>
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
      </div>
      <div className="favs-page__show">{favedShows}</div>
    </div>
  );
}
