import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./launch.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { LaunchDetail } from "./LaunchDetail";

export const Launches = ({ searchTerm }) => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  useEffect(() => {
    const fetchLaunches = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.spacexdata.com/v3/launches?limit=10&offset=${
            (page - 1) * 10
          }`
        );
        setLaunches((prevLaunches) => [...prevLaunches, ...response.data]);
        if (page === 1) {
          setFilteredLaunches(response.data);
        } else {
          setFilteredLaunches((prevFiltered) => [
            ...prevFiltered,
            ...response.data,
          ]);
        }

        if (response.data.length < 10) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, [page]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = launches.filter((launch) =>
        launch.mission_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLaunches(filtered);
      setHasMore(filtered.length > 10);
    } else {
      setFilteredLaunches(launches);
      setHasMore(true);
    }
  }, [searchTerm, launches]);

  const lastLaunchRef = useRef();
  useEffect(() => {
    if (loading || !hasMore) return;

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observerInstance = new IntersectionObserver(callback, options);

    const currentRef = lastLaunchRef.current;

    if (currentRef) {
      observerInstance.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observerInstance.unobserve(currentRef);
      }
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (selectedLaunch) {
      const launchDetailsElement = document.querySelector('.launch-details');
      if (launchDetailsElement) {
        launchDetailsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedLaunch]);

  const handleLaunchClick = (launch) => {
    setSelectedLaunch(launch);
  };

  if (loading && page === 1) return <Spinner />;
  if (error) return <p>Error fetching launches: {error.message}</p>;

  return (
    <Router>
      <div className="launches-container">
        <ul>
          <TransitionGroup>
            {filteredLaunches.map((launch, i) => {
              const isLastLaunch = filteredLaunches.length === i + 1;
              return (
                <CSSTransition
                  key={launch.flight_number}
                  timeout={300}
                  classNames="fade "
                >
                  <Link
                    to={`/launch/${launch.flight_number}`}
                    style={{ color: "white" }}
                    onClick={() => handleLaunchClick(launch)}
                  >
                    <li ref={isLastLaunch ? lastLaunchRef : null}>
                      {launch.mission_name}
                    </li>
                  </Link>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
          {loading && <Spinner />}
          {!hasMore && !loading && <p>No more launches to display.</p>}
        </ul>
        <div className="launch-details">
          <Switch>
            <Route
              path={`/launch/:flight_number`}
              children={({ match }) => (
                <CSSTransition
                  in={!!match}
                  timeout={300}
                  classNames="slide"
                  unmountOnExit
                >
                  <div>
                    <LaunchDetail launches={filteredLaunches} />
                  </div>
                </CSSTransition>
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
};
