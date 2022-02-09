import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useStateIfMounted } from 'use-state-if-mounted';
import spinner from '../styles/leaderBoard.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
// import $ from 'jquery'
import { Dropdown } from 'react-bootstrap';

library.add(fas)


const Leaderboard = () => {
    let navigate = useNavigate()

    const [currentNumber, setCurrentNumber] = useStateIfMounted()
    const [currentDate, setCurrentDate] = useStateIfMounted()
    const [lastDayId, setLastDayId] = useStateIfMounted()
    const [bests, setBests] = useStateIfMounted([])
    const [loaded, setLoaded] = useStateIfMounted(false)



    const dateParser = (date) => {
        let newDate = new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        return newDate;
    };


    const fetchJoints = () => {
        axios.get('api/number/')
            .then(res => {
                setCurrentNumber(res.data[0].number)
                setCurrentDate(new Date())
            })
            .catch(res => {
                setCurrentNumber(0)
                setCurrentDate(new Date())
            })
    }

    const fetchBests = () => {
        axios.get('/api/leaderboard')
            .then((res) => {
                setBests(res.data)
                setLoaded(true)
            })
    }

    const recolorizeButton = (button) => {
        button.classList.add('selectedBtn')
        setTimeout(() => {
            button.classList.remove('selectedBtn')
        }, 300)
    }

    const handleBack = () => {
        recolorizeButton(document.getElementById('backButton'))
        setTimeout(() => {
            navigate("/")
        }, 100)
    }

    const handleSave = async () => {
        recolorizeButton(document.getElementById('saveButton'))
        const data = {
            number: currentNumber,
            date: currentDate
        }
        await axios.post('/api/leaderboard', data).then(() => {
            fetchBests()
        })
    }

    const handleReSave = async () => {
        recolorizeButton(document.getElementById('resaveButton'))
        const data = await {
            number: currentNumber,
        }
        axios.put('/api/leaderboard/' + lastDayId, data).then(() => {
            fetchBests()
            setTimeout(() => {
                document.getElementById("resaveButton").style.display = "none"
            }, 300)
        })
    }


    const handleDel = async () => {
        await axios.delete('/api/leaderboard').then(() => {
            fetchBests()
            setTimeout(() => {
                document.getElementById("resaveButton").style.display = "none"
                document.getElementById("resetLeaderboard").style.display = "none"
                document.getElementById('saveButton').style.display = "flex"
            }, 450)
        })
    }




    useEffect(() => {
        if (!loaded) {
            fetchJoints()
            fetchBests()
        }


        if (bests.length !== 0 && loaded) {
            document.getElementById("leaderboardSettings").style.display = "flex"
            if (dateParser(bests.slice(-1)[0].date).includes(dateParser(new Date()))) {
                document.getElementById('saveButton').style.display = "none"
                if (bests.slice(-1)[0].number < currentNumber) {
                    document.getElementById("resaveButton").style.display = "flex"
                    setLastDayId(bests.slice(-1)[0]._id)
                }
            }
        } else if (bests.length === 0 && loaded){
            document.getElementById("leaderboardSettings").style.display = "none"
        }
    })



    return (
        <div id="leaderboard">
            <div className="leaderBox">
                {loaded && (
                    <div id="leaderboardSettings">

                    <Dropdown >
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        <FontAwesomeIcon icon="fa-solid fa-gear"  />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                            <Dropdown.Item onClick={handleDel} id="resetLeaderboard">Reset leaderboard</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                        </div>
                        )}
                {loaded ?
                    <h2>Leaderboard</h2>
                    : <div ><img src={spinner} alt="loader" /></div>}
                <ul>
                    {bests && (
                        bests.map((best) => {
                            return <li key={best._id}>{best.number} joints on the {dateParser(best.date)}</li>
                        })
                    )}
                </ul>
                {loaded ?
                    <div className="leaderboardButtons">
                        <div onClick={handleBack} className="btn" id="backButton">Back</div>
                        <div onClick={handleSave} className="btn" id="saveButton">Save</div>
                        <div onClick={handleReSave} className="btn" id="resaveButton">Save</div>
                    </div>
                    : ""}
            </div>
        </div>
    );
};

export default Leaderboard;