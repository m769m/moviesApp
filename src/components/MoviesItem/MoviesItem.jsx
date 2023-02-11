import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import RateStars from "../RateStars";
import Context from "../../context/genres-context";

import "./MoviesItem.css";

export default class MoviesItem extends Component {
  constructor(props, context) {
    super(props);

    const { id } = this.props;
    const { tabPane } = context;

    if (tabPane === "1") {
      this.dataItem = context.movies.find((item) => item.id === id);
    } else {
      this.dataItem = context.ratedFilm.find((item) => item.id === id);
    }

    const { popularity } = this.dataItem;

    this.inputClasses = "card-popularity-count";

    if (popularity >= 3 && popularity < 5) {
      this.inputClasses = classNames(this.inputClasses, "orange");
    } else if (popularity >= 5 && popularity < 7) {
      this.inputClasses = classNames(this.inputClasses, "yellow");
    } else if (popularity >= 7) {
      this.inputClasses = classNames(this.inputClasses, "green");
    }

    this.pruningText = (longText, maxLength) => {
      const pos = longText.indexOf(" ", maxLength);
      return pos === -1 ? longText : `${longText.substr(0, pos)}...`;
    };
  }

  render() {
    const { id, genres, popularity, posterURL, filmTitle, releaseDate, overview, rating } = this.dataItem;
    const { width } = this.context;

    const generesList = (
      <ul className="genres-list">
        {genres.map((genre) => {
          return (
            <li className="genres-item" key={genre}>
              {genre}
            </li>
          );
        })}
      </ul>
    );

    return (
      <div className="item-films">
        {width > 500 ? (
          <>
            <div className="item-films-img">
              <img src={posterURL} alt="1" className="" />
            </div>

            <div className="item-films-information">
              <div className="header-item">
                <h3 className="title-film">{filmTitle}</h3>
                <span className={this.inputClasses}>{popularity}</span>
              </div>

              <div className="date-film">{releaseDate}</div>

              {generesList}

              <div className="descripton-film">{this.pruningText(overview, 100)}</div>

              <RateStars id={id} rating={rating} />
            </div>
          </>
        ) : (
          <>
            <div className="item-films-main-information">
              <div className="item-films-img">
                <img src={posterURL} alt="1" className="" />
              </div>

              <div className="item-films-information">
                <div className="header-item">
                  <h3 className="title-film">{filmTitle}</h3>
                  <span className={this.inputClasses}>{popularity}</span>
                </div>

                <div className="date-film">{releaseDate}</div>

                {generesList}
              </div>
            </div>

            <div className="item-films-secondary-information">
              <div className="descripton-film">{this.pruningText(overview, 100)}</div>
              <RateStars id={id} rating={rating} />
            </div>
          </>
        )}
      </div>
    );
  }
}

MoviesItem.propTypes = {
  id: PropTypes.number.isRequired,
};

MoviesItem.contextType = Context;
