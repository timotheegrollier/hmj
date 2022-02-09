import axios from 'axios';
import { useEffect } from 'react'
import Clock from '../components/Clock'
import { useNavigate } from "react-router-dom";
import { useStateIfMounted } from 'use-state-if-mounted';

function Home() {
    const [spleefNumber, setSpleefNumber] = useStateIfMounted()
    const [lastSpleef, setLastSpleef] = useStateIfMounted()
    const [id, setId] = useStateIfMounted()
    const [loaded, setLoaded] = useStateIfMounted(false)
    let navigate = useNavigate();



    const dateParser = (date) => {
        let newDate = new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
        return newDate;
    };



    const recolorizeButton = (button) => {
        button.classList.add('selectedBtn')
        setTimeout(() => {
            button.classList.remove('selectedBtn')
        }, 300)
    }


    const fecthSpleef =  () => {
        setTimeout(() => {
         axios.get('/api/number')
            .then(res => {
                    setSpleefNumber(res.data[0].number);
                    setLastSpleef(dateParser(res.data[0].lastSpleef))
                    setId(res.data[0]._id)
                    setLoaded(true)
                })
                .catch(() => {
                    setSpleefNumber(0)
                    setId("")
                    setLastSpleef("")
                    setLoaded(true)
                })
            }, 500)

    }

    const handleRestart = async () => {
        recolorizeButton(document.getElementById('restart'))
        await axios.delete('/api/reset')
        document.getElementById('firstSpleef').style.display = "flex"
        document.getElementById('otherSpleefs').style.display = "none"
        setSpleefNumber(0)
    }

    const handleFirstSpleef = async () => {
        recolorizeButton(document.getElementById('firstSpleef'))
        await axios.post('/api/spleef').then(() => {
            document.getElementById('firstSpleef').style.display = "none"
            document.getElementById('otherSpleefs').style.display = "flex"
            fecthSpleef()
        })

    }




    const handleOtherSpleefs = async () => {
        recolorizeButton(document.getElementById('otherSpleefs'))
        const data = {
            number: spleefNumber + 1,
            lastSpleef: new Date()
        }
        await axios.put(`/api/spleef/${id}`, data)
        fecthSpleef()
    }


    const leaderboardButton = async () => {
        recolorizeButton(document.getElementById('leaderboardButton'))
        setTimeout(() => {
            navigate("/leaderboard")
        }, 100)
    }

    useEffect(() => {
            fecthSpleef()
            if(spleefNumber === 0 ){
                setTimeout(()=>{
                    setLoaded(true)
                },500)
            }
            if(loaded){

                if (spleefNumber !== 0) {
                    document.getElementById('firstSpleef').style.display = "none"
                    document.getElementById('otherSpleefs').style.display = "flex"
                } else {
                    document.getElementById('firstSpleef').style.display = "flex"
                    document.getElementById('otherSpleefs').style.display = "none"
                }
            }
    })

    return (
        <div className="App">
            <div id="app">
                <div className="drugBox">
                    <h1>How many joints ?</h1>
                    {spleefNumber || spleefNumber === 0 ? 
                    <div className='dataZone'>
                    <p className="spleefNumber">
                        {spleefNumber}
                    </p>
                    <p>
                        {lastSpleef && (
                            `Last joint on the : ${lastSpleef}`
                            )}
                    </p>
                    <Clock />
                    </div>
                :<div id="homeLoader" />}
                {loaded ? 
                    <div id="btnBlock">
                        <div className="btn" id="firstSpleef" onClick={handleFirstSpleef} type="submit">Smoke</div>
                        <div className="btn" style={{ display: "none" }} id="otherSpleefs" onClick={handleOtherSpleefs} type="submit">Smoke</div>
                        <div className="btn" id="restart" onClick={handleRestart}>Restart</div>
                    </div>
                    :""}
                    <div className="btn" id="leaderboardButton" onClick={leaderboardButton}>
                        Leaderboard
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
