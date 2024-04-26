import { useEffect, useState } from 'react';
import Axios from 'axios';
import Popup from "./Components/Popup";

export default function App() {

  const [birdData, setBirdData] = useState({ bird: {}, DataisLoaded: false })
  const [imageUrl, setImageUrl] = useState("");
  const [birdHasChanged, setBirdHasChanged] = useState(false);
  const [popUpTrigger, setPopUpTrigger] = useState(false)

  async function updateBirdLatest() {
    await Axios.get(`http://${process.env.REACT_APP_API_HOST}:3001/birds/latest`)
      .then((res) => {
        const birdInfo = res.data.data
        console.log(birdInfo)
        console.log(birdInfo[0])
        console.log(birdInfo[1])
        var birdDict = {}
        birdDict['time'] = birdInfo[0];
        birdDict['bird'] = birdInfo[1];
        birdDict['lat'] = birdInfo[2];
        birdDict['lon'] = birdInfo[3];
        console.log(birdDict)
        if (birdInfo[1] !== birdData['bird']['bird']) {
          setBirdHasChanged(true)
        }
        setBirdData({
          bird: birdDict,
          DataisLoaded: true
        })
      });
  }
  async function getBirdImage() {
    const bird = birdData["bird"]["bird"]
    try {
      const response = await Axios.get(
        `https://api.unsplash.com/photos/random?query=${bird}&client_id=i7RoddcRb7XMxsfWJKJfI1SAuu4m7KPgz5Umdd7d3J4`
      ).then((res) => {
        const data = res.data;
        setImageUrl(data.urls.regular)
      });
    } catch (error) {
      console.error("Error fetching image: ", error)
    }
  }

  function renderBird() {
    const { DataisLoaded, bird } = birdData;
    if (!DataisLoaded) {
      return <div>Loading...</div>
    }
    else {
      if (birdHasChanged) {
        getBirdImage()
        setBirdHasChanged(false)
      }
      return bird["bird"]
    }
  }

  function renderTime() {
    const { DataisLoaded, bird } = birdData;
    if (!DataisLoaded) {
      return <div>Loading...</div>
    } else {
      const utcTime = new Date(bird["time"])
      const convertedTime = utcTime.toLocaleString("en-US", { timeZone: "America/New_York" });
      const timeArray = convertedTime.split(", ")
      const timestring = `${timeArray[1]} on ${timeArray[0]}`
      return timestring
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateBirdLatest();
    }, 5000)
    return () => clearInterval(intervalId);
  }, [birdData.bird])

  return (
    <div>
      <main>
        <header>
          <h1>Heard Bird</h1>
        </header>
        <div className='parent-container'>
          <h1>The latest bird I heard was a {renderBird()} at {renderTime()}</h1>
          <button onClick={() => { setPopUpTrigger(true) }}>Bird History</button>
          <div>
            {imageUrl && <img src={imageUrl} alt="Bird!" />}
          </div>
        </div>
      </main>
      <Popup trigger={popUpTrigger} setTrigger={setPopUpTrigger} />

    </div>
  );
}