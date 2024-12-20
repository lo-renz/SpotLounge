import React, { useState, useEffect } from "react";
import NavBar from "../../components/Navbar";
import BarChart from "./nivo_charts/BarChart";
import PieChart from "./nivo_charts/PieChart";

const DataViz = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [artistData, setArtistData] = useState([]); // This variable stores the data of artists.
  const [trackData, setTrackData] = useState([]); // This variable stores the data of tracks.
  const [showChart, setShowChart] = useState(false); // This variable helps with showing the chart.
  const [artistOrTrack, setArtistOrTrack] = useState(true);
  const [timeRange, setTimeRange] = useState("long_term");
  const [chartType, setChartType] = useState("BarChart");

  useEffect(() => {
    if (showChart) {
      if (artistOrTrack) {
        getTopArtists();
      } else {
        getTopTracks();
      }
    }
  }, [showChart]);

  const getTopTracks = () => {
    fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=5`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const tracks = data.items.map((track, index) => {
          return {
            index: index + 1,
            id: track.name,
            artists: track.artists.map((artist) => artist.name).join(", "),
            value: track.popularity,
          };
        });

        console.log(timeRange);
        console.log(tracks);
        setArtistOrTrack(false);
        setTrackData(tracks);
      });
  };

  const getTopArtists = () => {
    fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=5`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const artists = data.items.map((artist, index) => {
          return {
            index: index + 1,
            id: artist.name,
            value: artist.popularity,
          };
        });

        console.log(artists);
        console.log(timeRange);
        setArtistOrTrack(true);
        setArtistData(artists);
      });
  };

  return (
    <div className="p-4">
      <NavBar />

      <h3 className="text-2xl flex justify-center items-center text-green-500">
        SpotViz
      </h3>

      <br />

      <div className="text-white">
        <h4 className="text-2xl flex justify-center items-center">
          First choose a time range
        </h4>

        <br />

        <div className="flex justify-center items-center space-x-2 ">
          <button
            className={`px-4 py-2 border border-gray-300 rounded ${timeRange === "long_term" ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => {
              setTimeRange("long_term");
              setShowChart(false);
            }}
          >
            All Time
          </button>

          <button
            className={`px-4 py-2 border border-gray-300 rounded ${timeRange === "medium_term" ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => {
              setTimeRange("medium_term");
              setShowChart(false);
            }}
          >
            Last 6 Months
          </button>

          <button
            className={`px-4 py-2 border border-gray-300 rounded ${timeRange === "short_term" ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => {
              setTimeRange("short_term");
              setShowChart(false);
            }}
          >
            Last 4 Weeks
          </button>
        </div>

        <br />

        <h4 className="text-2xl flex justify-center items-center">
          Then choose between top artists or top tracks
        </h4>

        <br />

        <div className="flex justify-center items-center space-x-2 ">
          <button
            className={`px-4 py-2 border border-gray-300 rounded ${artistOrTrack ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => {setArtistOrTrack(true)}}
          >
            Top Artists
          </button>

          <button
            className={`px-4 py-2 border border-gray-300 rounded ${!artistOrTrack ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => {setArtistOrTrack(false)}}
          >
            Top Tracks
          </button>
        </div>

        <br />

        <h4 className="text-2xl flex justify-center items-center">
          Then choose a type of graph
        </h4>

        <br />

        <div className="flex justify-center items-center space-x-2 ">
          <button
            className={`px-4 py-2 border border-gray-300 rounded ${chartType === "BarChart" ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => setChartType("BarChart")}
          >
            Barchart Graph
          </button>

          <button
            className={`px-4 py-2 border border-gray-300 rounded ${chartType === "PieChart" ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => setChartType("PieChart")}
          >
            Piechart Graph
          </button>
        </div>

        <br />

        <div className="flex justify-center items-center space-x-2 ">
          <button
            className={`px-4 py-2 border border-gray-300 rounded ${showChart ? "bg-green-900" : "hover:bg-green-900"}`}
            onClick={() => setShowChart(true)}
          >
            Generate Graph
          </button>
        </div>

        {showChart ? (
          chartType === "BarChart" ? (
            <BarChart spotifyData={artistOrTrack ? artistData : trackData} />
          ) : chartType === "PieChart" ? (
            <PieChart spotifyData={artistOrTrack ? artistData : trackData} />
          ) : null
        ) : null}
      </div>
    </div>
  );
};

export default DataViz;
