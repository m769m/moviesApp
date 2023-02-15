import React, { Component } from "react";
import { Alert, Empty, Layout, Pagination, Space, Spin } from "antd";
import { format, parseISO } from "date-fns";

import MoviesService from "../../services/movies-sevice";
import Context from "../../context/genres-context";
import MoviesList from "../MoviesList";
import Search from "../Search";
import Header from "../Header";
import outOfPosterImg from "../../assets/images/Out_Of_Poster.jpg";

import "./App.css";
import "antd/dist/antd.min.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.refWidth = React.createRef();

    this.resizeHandler = () => {
      const { clientWidth } = this.refWidth.current || 769;

      this.setState({
        width: clientWidth,
      });
    };

    this.state = {
      guestSessionId: "",
      searchQuery: "",
      tabPane: "1",
      movies: [],
      ratedFilm: [],
      genresList: [],
      isLoading: true,
      isError: false,
      notFound: false,
      numberPageMovies: 1,
      numberPageRateMovies: 1,
      totalPagesMovies: 0,
      totalPagesRateMovies: 0,
      changeTab: this.changeTab,
      width: 769,
    };

    this.errorSetState = () => {
      this.setState({
        isLoading: false,
        notFound: false,
        isError: true,
      });
    };

    this.notFoundSetState = () => {
      this.setState({
        isLoading: false,
        notFound: true,
      });
    };

    this.cancelSearchSetState = () => {
      this.setState({
        isLoading: false,
        notFound: false,
        isError: false,
      });
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeHandler);
    this.resizeHandler();

    if (typeof localStorage.getItem("guestSessionId") !== "string") {
      this.createGuestSession();
    } else {
      this.setState({
        guestSessionId: localStorage.getItem("guestSessionId"),
      });

      this.cancelSearchSetState();
    }

    this.getGenresList();
  }

  createGuestSession = () => {
    const callMovieDbService = new MoviesService();

    callMovieDbService
      .createGuestSession()
      .then((body) => {
        localStorage.setItem("guestSessionId", `${body.guest_session_id}`);

        this.setState({
          guestSessionId: body.guest_session_id,
        });

        this.cancelSearchSetState();
      })
      .catch(() => {
        this.errorSetState();
      });
  };

  changeTab = (key) => {
    if (key === "2") {
      this.setState(
        {
          tabPane: key,
          numberPageRateMovies: 1,
        },
        () => {
          this.getRatedMovies();
        },
      );
    } else {
      this.setState({
        tabPane: key,
        notFound: false,
      });
    }

    this.cancelSearchSetState();
  };

  searchQueryChange = (searchQuery) => {
    this.setState(
      {
        searchQuery,
        numberPageMovies: 1,
      },
      () => {
        this.searchMovies();
      },
    );
  };

  getGenresList = () => {
    const callMovieDbService = new MoviesService();

    callMovieDbService
      .getGenersList()
      .then((body) => {
        this.setState({
          genresList: [...body.genres],
        });
      })
      .catch(() => {
        this.errorSetState();
      });
  };

  getGenresFilm = (genresIds) => {
    const filmGenres = [];
    const { genresList } = this.state;

    genresIds.forEach((genreId) => {
      genresList.forEach((el) => {
        if (el.id === genreId) {
          filmGenres.push(el.name);
        }
      });
    });

    return filmGenres;
  };

  searchMovies = () => {
    const { searchQuery, numberPageMovies } = this.state;
    const callMovieDbService = new MoviesService();

    this.setState({
      movies: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    if (searchQuery === "") {
      this.cancelSearchSetState();

      this.setState({
        totalPagesMovies: 0,
      });

      return;
    }

    callMovieDbService
      .searchMovies(searchQuery, numberPageMovies)
      .then((item) => {
        this.setState({
          totalPagesMovies: item.total_pages,
        });

        if (item.results.length === 0) {
          this.notFoundSetState();
        }

        item.results.forEach((elm) => {
          this.addItemToList(elm);
        });
      })
      .catch(() => {
        this.errorSetState();
      });
  };

  getRatedMovies = () => {
    const { guestSessionId, numberPageRateMovies } = this.state;
    const callMovieDbService = new MoviesService();

    this.setState({
      ratedFilm: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    callMovieDbService
      .getRatedMovies(guestSessionId, numberPageRateMovies)
      .then((item) => {
        this.setState({
          totalPagesRateMovies: item.total_pages,
        });

        if (item.results.length === 0) {
          this.notFoundSetState();
        }

        item.results.forEach((elm) => {
          this.addRatedItemToList(elm);
        });
      })
      .catch(() => {
        this.errorSetState();
      });
  };

  createItem = (item) => {
    const itemDate = item.release_date;
    const createDate = itemDate !== "" ? format(parseISO(itemDate), "MMMM dd, yyyy") : "No date";
    const createPopularity = item.vote_average.toFixed(1) || 0;

    const releaseDate = item.release_date ? createDate : "no release date";
    const filmTitle = item.title || "Movie title not specified";
    const overview = item.overview || "Movie overview not specified";

    const popularity = createPopularity === "0.0" ? 0 : createPopularity;
    const rating = Number(localStorage.getItem(`${item.id}`)) || item.rating || 0;
    let posterURL = `${outOfPosterImg}`;

    if (item.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/original${item.poster_path}`;
    }

    const genres = this.getGenresFilm(item.genre_ids);

    return {
      id: item.id,
      filmTitle,
      posterURL,
      releaseDate,
      overview,
      popularity,
      rating,
      genres,
    };
  };

  addItemToList = (item) => {
    const newItem = this.createItem(item);

    this.setState(({ movies }) => {
      return {
        movies: [...movies, newItem],
        isLoading: false,
      };
    });
  };

  addRatedItemToList = (item) => {
    const newItem = this.createItem(item);

    this.setState(({ ratedFilm }) => {
      return {
        ratedFilm: [...ratedFilm, newItem],
        isLoading: false,
      };
    });
  };

  changePage = (page) => {
    const { tabPane } = this.state;

    if (tabPane === "1") {
      this.setState(
        {
          numberPageMovies: page,
        },
        () => {
          this.searchMovies();
        },
      );
    } else {
      this.setState(
        {
          numberPageRateMovies: page,
        },
        () => {
          this.getRatedMovies();
        },
      );
    }
  };

  render() {
    const {
      movies,
      isLoading,
      isError,
      notFound,
      numberPageMovies,
      numberPageRateMovies,
      totalPagesMovies,
      totalPagesRateMovies,
      guestSessionId,
      tabPane,
      ratedFilm,
      searchQuery,
      changeTab,
      width,
    } = this.state;

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const contextValue = {
      movies,
      ratedFilm,
      tabPane,
      guestSessionId,
      changeTab,
      width,
    };

    const numberPage = tabPane === "1" ? numberPageMovies : numberPageRateMovies;
    const totalPages = tabPane === "1" ? totalPagesMovies : totalPagesRateMovies;

    const foundMovies = notFound ? <Empty /> : <MoviesList />;
    const errorMessage = isError ? (
      <Alert message="Error" description="Rick and Morty stole movies" type="error" showIcon />
    ) : null;

    const searchComponent = <Search query={searchQuery} searchQueryChange={this.searchQueryChange} />;
    const search = tabPane === "1" ? searchComponent : null;

    const spinner =
      isLoading && !isError ? (
        <div className="example">
          <Spin size="large" />
        </div>
      ) : null;
    const pagination =
      totalPages > 0 && !isLoading ? (
        <Pagination
          defaultCurrent={1}
          current={numberPage}
          total={totalPages * 10}
          showSizeChanger={false}
          onChange={this.changePage}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        />
      ) : null;

    return (
      <div className="container" ref={this.refWidth}>
        <Layout>
          <Context.Provider value={contextValue}>
            <Header />

            {search}

            <Space direction="vertical" size="middle">
              {spinner}

              {foundMovies}
              {errorMessage}

              {pagination}
            </Space>
          </Context.Provider>
        </Layout>
      </div>
    );
  }
}
