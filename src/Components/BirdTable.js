
import Axios from 'axios';
import { useState, useEffect } from 'react';

function BirdTable() {
  const [birdData, setBirdData] = useState({ birds: [], DataisLoaded: false })

  async function getAllSensor() {
    await Axios.get(`http://${process.env.REACT_APP_API_HOST}:3001/birds`)
      .then((res) => {

        const allData = res.data.data
        var arrDataRaw = []

        for (let i = 0; i < allData.length; i++) {
          let item = allData[i]
          const utcTime = new Date(item["created"])
          const convertedTime = utcTime.toLocaleString("en-US", { timeZone: "America/New_York" });
          const timeArray = convertedTime.split(", ")
          const timestring = `${timeArray[1]} on ${timeArray[0]}`
          let entry = { "id": item["id"], "time": timestring, "bird": item["bird"], "lat": item["lat"], "lon": item["lon"] }
          arrDataRaw.push(entry)
        }
        console.log(arrDataRaw)
        setBirdData({
          birds: arrDataRaw,
          DataisLoaded: true
        }
        );

      });
  }
  useEffect(() => {
    getAllSensor()
  }, [])

  function renderTable() {
    let htmlTable = `
    <tr>
      <th>Time</th>
      <th>Bird</th>
      <th>Lat</th>
      <th>Lon</th>
    </tr>
    `;
    birdData["birds"].forEach(item => {
      htmlTable += `
      <tr>
        <td>${item.time}</td>
        <td>${item.bird}</td>
        <td>${item.lat}</td>
        <td>${item.lon}</td>
      </tr>
      `;
    });
    return htmlTable
  }


  return (birdData['DataisLoaded']) ? (
    <div>
      <table>{renderTable()}</table>
    </div>
  ) : (<h3>Loading...</h3>);
}
export default BirdTable