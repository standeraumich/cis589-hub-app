import { useEffect, useState } from 'react';
import Axios from 'axios';
import Popup from "./Components/Popup";
import Widget from "./Components/Widget"

export default function App() {

  const [sensorData, setSensorData] = useState({ sensors: {}, DataisLoaded: false })
  const [tempColor, setTempColor] = useState("temp-cold");
  const [humidColor, setHumidColor] = useState("med-humid")
  const [popUpTrigger, setPopUpTrigger] = useState(false)
  const [graphType, setGraphType] = useState("")
  const [graphTitle, setGraphTitle] = useState("")

  async function updateSensorLatest() {
    await Axios.get(`http://${process.env.REACT_APP_API_HOST}:3001/sensors/latest`)
      .then((res) => {
        const thermistor = res.data['thermistor']
        const humidity = res.data['humidity']
        if (thermistor <= 62) {
          setTempColor("temp-cold")
        } else if (thermistor > 62 && thermistor <= 72) {
          setTempColor("temp-neutral")
        } else {
          setTempColor("temp-hot")
        }

        if (humidity <= 30) {
          setHumidColor("low-humid")
        } else if (humidity > 30 && humidity <= 60) {
          setHumidColor("med-humid")
        } else {
          setHumidColor("high-humid")
        }

        setSensorData({
          sensors: res.data,
          DataisLoaded: true
        })
      });
  }

  function renderThermistor() {
    const { DataisLoaded, sensors } = sensorData;
    if (!DataisLoaded) {
      return <div>Loading...</div>
    }
    else {
      return sensors['thermistor']
    }
  }

  function renderHumidity() {
    const { DataisLoaded, sensors } = sensorData;
    if (!DataisLoaded) {
      return <div>Loading...</div>
    }
    else {
      return sensors['humidity']
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateSensorLatest();
    }, 5000)
    return () => clearInterval(intervalId);
  }, [sensorData.sensors])

  return (
    <div>
      <main>
        <header>
          <h1>Smart Home Hub</h1>
        </header>
        <div className='parent-container'>
          <Widget onClick={() => { setPopUpTrigger(true); setGraphType("thermistor"); setGraphTitle("All Temperature Data") }} color={tempColor} sensorData={renderThermistor()} title={"Temperature"} symbol={"°F"} />
          <Widget onClick={() => { setPopUpTrigger(true); setGraphType("humidity"); setGraphTitle("All Humidity Data") }} color={humidColor} sensorData={renderHumidity()} title={"Humidity"} symbol={"%"} />
        </div>
      </main>
      <Popup trigger={popUpTrigger} title={graphTitle} setTrigger={setPopUpTrigger} sensor={graphType} />
    </div>
  );
}