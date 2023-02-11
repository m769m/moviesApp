import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rate } from "antd";

import MoviesService from "../../services/movies-sevice";
import Context from "../../context/genres-context";

import "./RateStars.css";

export default class RateStars extends Component {
  constructor(props, context) {
    super(props);

    this.guestSessionId = context.guestSessionId;

    this.state = {
      ratingValue: props.rating || 0,
    };
  }

  setMovieRating = (rate) => {
    const { id } = this.props;
    const callMovieDbService = new MoviesService();

    this.setState({
      ratingValue: rate,
    });

    if (rate === 0) {
      callMovieDbService.deleteRateMovie(id, this.guestSessionId);
    } else {
      callMovieDbService.setMovieRating(id, this.guestSessionId, rate);
    }

    localStorage.setItem(`${id}`, `${rate}`);
  };

  render() {
    const { ratingValue } = this.state;
    return <Rate count={10} value={ratingValue} onChange={this.setMovieRating} />;
  }
}

RateStars.propTypes = {
  id: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
};

RateStars.contextType = Context;
