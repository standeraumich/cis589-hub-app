import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  CategoryScale
} from 'chart.js';
import Axios from 'axios';
import { useState, useEffect } from 'react';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  CategoryScale
)

function Graph(props) {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: props.title,
      },
    },
  };
  const [sensorData, setSensorData] = useState({ sensor: { labels: [], datasets: [] }, DataisLoaded: false })

  /**
 * Function which accepts a data array and a list of whitelisted
 * keys to find the average of each key after grouping
 */
  function getGroupedData(data, whitelist) {
    // Calculate the sums and group data (while tracking count)
    const reduced = data.reduce(function (m, d) {
      if (!m[d.created]) {
        m[d.created] = {
          ...d,
          count: 1
        };
        return m;
      }
      whitelist.forEach(function (key) {
        m[d.created][key] += d[key];
      });
      m[d.created].count += 1;
      return m;
    }, {});

    // Create new array from grouped data and compute the average
    return Object.keys(reduced).map(function (k) {
      const item = reduced[k];
      const itemAverage = whitelist.reduce(function (m, key) {
        m[key] = item[key] / item.count;
        return m;
      }, {})
      return {
        ...item, // Preserve any non white-listed keys
        ...itemAverage // Add computed averege for whitelisted keys
      }
    })
  }


  async function getAllSensor(sensor) {
    await Axios.get(`http://${process.env.REACT_APP_API_HOST}:3001/sensors`)
      .then((res) => {

        const allData = res.data
        var arrDataRaw = []

        for (let i = 0; i < allData.length; i++) {
          let item = allData[i]
          let entry = {}
          if (item['sensor'] == sensor) {
            entry['created'] = item.created.split("T")[0]
            entry['data'] = item.data
            arrDataRaw.push(entry)
          }
        }
        console.log(arrDataRaw)
        var arrData = getGroupedData(arrDataRaw, ['data'])
        console.log(arrData)
        setSensorData({
          sensor: {
            labels: arrData.map((data) => data.created),
            datasets: [
              {
                label: "Historical Data",
                data: arrData.map((data) => data.data),
                backgroundColor: [
                  "#0b2235"
                ],
                borderColor: [
                  "#696969"
                ],
                borderWidth: 5
              }
            ]
          },
          DataisLoaded: true
        }
        );

        console.log(sensorData['sensor'])
      });
  }
  useEffect(() => {
    getAllSensor(props.sensor)
  }, [])



  return (sensorData['DataisLoaded']) ? (
    <Line options={options} data={sensorData['sensor']} />
  ) : (<h3>Loading...</h3>);
}
export default Graph