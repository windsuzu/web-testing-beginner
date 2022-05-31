import React, { useEffect, useState } from "react";
import "./FollowersList.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function FollowersList() {
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const { data } = await axios.get(
                    "https://randomuser.me/api/?results=5"
                );
                setFollowers(data.results);
            } catch (error) {
                setError("Server Error");
            }
        };

        fetchFollowers();
    }, []);

    return (
        <div className="followerslist-container">
            <div>
                {error && <div>{error}</div>}
                {!error &&
                    followers &&
                    followers.map((follower, index) => (
                        <div
                            key={`${index}`}
                            className="follower-item"
                            data-testid={`follower-item-${index}`}
                        >
                            <img src={follower.picture.large} alt="" />
                            <div className="followers-details">
                                <div className="follower-item-name">
                                    <h4>{follower.name.first}</h4>{" "}
                                    <h4>{follower.name.last}</h4>
                                </div>
                                <p>{follower.login.username}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="todo-footer">
                <Link to="/">Go Back</Link>
            </div>
        </div>
    );
}
