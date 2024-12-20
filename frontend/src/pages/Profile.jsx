import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Profile = () => {
    const [userId, setId] = useState(null);
    const [mypics, setPics] = useState([]);
    const username = window.location.href.split('/')[4]

    useEffect(() => {
        getPosts(username)
    }, [])

    const getPosts = async (username) => {
        axios.get(`/posts/myposts/${username}`, {
        }).then(data => setPics(data.data.mypost))
            .catch(error => console.log(error))
    }

    return (
        <div className='p-4'>
            <Navbar />
            <div style={{ maxWidth: "550px", margin: "0px auto", color: 'white' }}>
                <div style={{
                    margin: "18px 0px",
                    borderBottom: "1px solid grey"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",

                    }}>
                        <div>
                            <h4>{username ? username : "loading"}</h4>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{mypics.length} posts</h6>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="gallery">
                    {mypics && (
                        mypics.map(item => {
                            return (
                                <div>
                                    <h1>{item.title}</h1>
                                    <h1>{item.message}</h1>
                                    <img key={item._id} className="item" src={item.file} />
                                    <br />
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile