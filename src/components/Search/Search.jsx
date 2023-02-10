import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import debounce from "lodash.debounce";

import "./Search.css";

export default class Search extends Component {
  constructor(props) {
    super(props);

    const { searchQueryChange, query } = this.props;
    this.searchQueryChange = searchQueryChange;

    this.state = {
      searchQuery: query,
    };

    const delayedQuery = debounce((query) => this.search(query), 1000);

    this.onChange = (e) => {
      const valueInput = e.target.value;

      this.setState({
        searchQuery: valueInput,
      });

      delayedQuery(valueInput);
    };
  }

  search = (value) => {
    this.searchQueryChange(value.replace(/ +/g, " ").trim());
  };

  render() {
    const { searchQuery } = this.state;

    return (
      <Input
        className="serch-movies-input"
        placeholder="Type to search..."
        size="large"
        onChange={this.onChange}
        value={searchQuery}
      />
    );
  }
}

Search.propTypes = {
  searchQueryChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};
