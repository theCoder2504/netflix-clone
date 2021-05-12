import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // snippet of code with runs based on a spesific condition/ variable
    useEffect(() => {
        // if [], run once when the row loads and don't run again
        //useEffect runs every time the second prop changes
        //if a variable from outside of useEffect is used it needs to be included in the second prop

        //async because the request will take time and than it is asyncron
        async function fetchData() {
            //await means that it waits for an answer and after the answer it starts processing
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(
                movie?.name || movie?.title || movie?.original_name || ""
            )
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                })
                .catch((error) => console.log(error));
        }
    };

    //   console.log(movies);

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
                {/* severall row_posters */}

                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${
                            isLargeRow && "row_posterLarge"
                        }`}
                        src={`${baseUrl}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`}
                        alt={
                            movie?.title || movie?.name || movie?.original_name
                        }
                    />
                ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;
