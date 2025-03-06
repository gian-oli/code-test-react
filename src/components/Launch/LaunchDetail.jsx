import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./launch.scss";

export const LaunchDetail = ({ launches }) => {
  const { flight_number } = useParams();
  const [loading, setLoading] = useState(true);
  const launch = launches.find(
    (launch) => launch.flight_number === parseInt(flight_number)
  );

  useEffect(() => {
    setLoading(true);
  }, [launch]);

  if (!launch) {
    return <p>Launch not found.</p>;
  }

  return (
    <div className="launch-details-container">
      <div className="text-content">
        <img src={launch.links.mission_patch_small} alt="Mission Patch" />
        <h2>{launch.mission_name}</h2>
        <p>Launch Year: {launch.launch_year}</p>
        <p>{launch.details}</p>
        <p>Launch Success: {launch.launch_success ? "Yes" : "No"}</p>
        <p>
          Launch Date: {new Date(launch.launch_date_local).toLocaleString()}
        </p>
      </div>
      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${launch.links.video_link.split('v=')[1]}`}
          allow="encrypted-media"
          allowFullScreen
          title={`${launch.title}`}
          onLoad={() => setLoading(false)}
          >

          </iframe>
          {loading && <p>Loading video...</p>}
      </div>
    </div>
  );
};