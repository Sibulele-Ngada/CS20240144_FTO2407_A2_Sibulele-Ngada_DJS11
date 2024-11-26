import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { PuffLoader } from "react-spinners";
import { getShow } from "../api";
import { Show } from "../types";

export default function ShowDetail() {
  const [currentShow, setCurrentShow] = useState<Show>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

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
      </div>
      <div className="show__page-season-container">{seasonElements}</div>
    </div>
  );
}