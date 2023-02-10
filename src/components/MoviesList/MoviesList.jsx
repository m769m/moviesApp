import React from "react";

import MoviesItem from "../MoviesItem";
import Context from "../../context/genres-context";

import "./MoviesList.css";

const MoviesList = () => {
  const createElements = (tabPane, movies, ratedFilm) => {
    const movieDataFromBase = tabPane === "1" ? movies : ratedFilm;
    const elements = movieDataFromBase.map((movie) => {
      const itemId = movie.id;

      return (
        <li key={itemId}>
          <MoviesItem id={itemId} />
        </li>
      );
    });

    return elements;
  };

  return (
    <Context.Consumer>
      {({ tabPane, movies, ratedFilm }) => <ul className="list-films">{createElements(tabPane, movies, ratedFilm)}</ul>}
    </Context.Consumer>
  );
};

export default MoviesList;
