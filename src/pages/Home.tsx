import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import RecommendedCarousel from "../components/Carousel";
import { getPreviews } from "../api";
import { Preview } from "../types";
import { PuffLoader } from "react-spinners";
import { v4 as getUUID } from "uuid";
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Button,
  ButtonGroup,
} from "@mui/material";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [titleSearch, setTitleSearch] = useState("");
  const [preview, setPreview] = useState<Preview[]>([]);
  const [displayedPreviews, setDisplayedPreviews] = useState<Preview[]>([]);
  const [sortParam, setSortParam] = useState<string>("alpha");
  const [sort, setSort] = useState(true);
  const [loading, setLoading] = useState(false);

  // Manually code in genre title as per recommendation
  const genres = [
    "Personal Growth",
    "Investigative Journalism",
    "History",
    "Comedy",
    "Entertainment",
    "Business",
    "Fiction",
    "News",
    "Kids and Family",
  ];

  const genreFilter = searchParams.get("genre");

  // Load preview data
  useEffect(() => {
    setLoading(true);
    async function loadPreviews() {
      setLoading(true);

      try {
        const previews = await getPreviews();
        setPreview(previews);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadPreviews();
  }, []);

  // Sort logic handler
  const sortPreview = useCallback(
    (sortBy: string, ascending: boolean) => {
      let sortedArray: Preview[];

      function sortAlphaHandler(a: Preview, b: Preview) {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      }

      function sortDateHandler(a: Preview, b: Preview) {
        if (new Date(a.updated) > new Date(b.updated)) {
          return -1;
        }
        if (new Date(a.updated) < new Date(b.updated)) {
          return 1;
        }
        return 0;
      }

      if (sortBy == "alpha") {
        sortedArray = [...preview].sort(sortAlphaHandler);
        if (ascending) return sortedArray;
        if (!ascending) return sortedArray.reverse();
      }

      if (sortBy == "date") {
        sortedArray = [...preview].sort(sortDateHandler);
        if (ascending) return sortedArray;
        if (!ascending) return sortedArray.reverse();
      }

      return preview;
    },
    [preview]
  );

  // Re-render when sorting
  useEffect(() => {
    setDisplayedPreviews(sortPreview(sortParam, sort));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, sortPreview]);

  // Filter and search previews
  const filteredPreviews = genreFilter
    ? displayedPreviews.filter((preview) =>
        preview.genres.includes(genres.indexOf(genreFilter) + 1)
      )
    : displayedPreviews;
  const searchTitle = filteredPreviews.filter((preview) =>
    preview.title.toLowerCase().includes(titleSearch.toLowerCase())
  );

  // Genre selction buttons
  const genreButtons = genres.map((genre) => {
    return (
      <Button
        onClick={() => {
          handleFilterChange("genre", genre);
        }}
        key={getUUID()}
      >
        {genre}
      </Button>
    );
  });

  // Generate preview cards
  const elements = searchTitle.map((showPreview) => {
    const nuweDatum = new Date(showPreview.updated);
    // Get genre titles
    const genreArray = showPreview.genres
      .map((genreID) => {
        const genreTitle = genres[genreID - 1];
        return genreTitle;
      })
      .toString() // Set to comma separated string
      .split(","); // Split at commas for individual genres
    const genreText = genreArray.join(" | ");

    return (
      <Link to={showPreview.id} key={showPreview.id}>
        <Card
          raised={true}
          sx={{
            backgroundColor: "#213547",
            color: "white",
            textDecoration: "none",
            textDecorationLine: "none",
          }}
          className="list__item"
        >
          <CardContent>
            <div className="list__item-title-container">
              <h3 className="list__item-title">{showPreview.title}</h3>
              <img src={showPreview.image} className="list__item-image" />
            </div>
            <div className="list__item-details">
              <p>{nuweDatum.toDateString()}</p>
              <p>{genreText}</p>
              <p>Seasons: {showPreview.seasons}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  });

  function handleFilterChange(key: string, value: string | null) {
    setSearchParams((prevParams) => {
      if (value === null) {
        prevParams.delete(key);
      } else {
        prevParams.set(key, value);
      }
      return prevParams;
    });
  }

  function handleSortSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSort((prevSort) => !prevSort);
  }

  function handleSortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    setSortParam(value);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.currentTarget;
    setTitleSearch(form.value);
  };

  // Loader styles
  const override = {
    display: "block",
    margin: "50vh auto",
  };

  return (
    <div className="home_page">
      <PuffLoader
        loading={loading}
        cssOverride={override}
        color="#4fa94d"
        size={150}
        aria-label="Loading Spinner"
      />
      {!loading && (
        <TextField
          size="small"
          id="outlined-search"
          label="Search"
          type="search"
          margin="normal"
          onChange={handleSearchChange}
          value={titleSearch}
          sx={{
            backgroundColor: "white",
            width: "20vw",
            alignSelf: "center",
            borderRadius: ".25rem",
          }}
        />
      )}
      {!loading && (
        <ButtonGroup
          sx={{ alignSelf: "center", marginBottom: ".6rem" }}
          variant="contained"
        >
          {genreButtons}
          <Button
            variant="contained"
            disabled={!genreFilter}
            onClick={() => handleFilterChange("genre", null)}
          >
            Clear
          </Button>
        </ButtonGroup>
      )}
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
              <FormControlLabel value="date" control={<Radio />} label="Date" />
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
      <div className="">
        <div className="carousel">
          {!loading && <RecommendedCarousel elements={filteredPreviews} />}
        </div>
      </div>
      <div className="list">{elements}</div>
    </div>
  );
}
