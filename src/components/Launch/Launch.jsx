import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import './launch.scss';

export const Launches = ({ searchTerm }) => {
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filteredLaunches, setFilteredLaunches] = useState([]);

    useEffect(() => {
        const fetchLaunches = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.spacexdata.com/v3/launches?limit=10&offset=${(page - 1) * 10}`);
                setLaunches(prevLaunches => [...prevLaunches, ...response.data]);
                if (page === 1) {
                    setFilteredLaunches(response.data);
                } else {
                    setFilteredLaunches(prevFiltered => [...prevFiltered, ...response.data]);
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
            const filtered = launches.filter(launch =>
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
            rootMargin: '20px',
            threshold: 1.0,
        };

        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        };

        const observerInstance = new IntersectionObserver(callback, options);

        if (lastLaunchRef.current) {
            observerInstance.observe(lastLaunchRef.current);
        }

        return () => {
            if (lastLaunchRef.current) {
                observerInstance.unobserve(lastLaunchRef.current);
            }
        };
    }, [loading, hasMore]);

    if (loading && page === 1) return <Spinner />;
    if (error) return <p>Error fetching launches: {error.message}</p>;

    return (
        <div className="launches-container">
            <ul>
                {filteredLaunches.map((launch, i) => {
                    const isLastLaunch = filteredLaunches.length === i + 1;
                    return (
                        <li key={launch.flight_number} ref={isLastLaunch ? lastLaunchRef : null}>
                            <h2>{launch.mission_name}</h2>
                            <p>Launch Year: {launch.launch_year}</p>
                            <p>Launch Success: {launch.launch_success ? 'Yes' : 'No'}</p>
                            <p>Launch Date: {new Date(launch.launch_date_local).toLocaleString()}</p>
                        </li>
                    );
                })}
            </ul>
            {loading && <Spinner />}
            {!hasMore && !loading && <p>No more launches to display.</p>}
        </div>
    );
}