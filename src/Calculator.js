import React, { useState } from "react";
import {
  fetchSolarIrradianceData,
  getChartData,
  getYearlyPower,
} from "./Methods";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Calculator = () => {
  const performCalc = async (lat, long, area, efficiency, panels) => {
    setKwData();
    setLoading(true);
    const solarData = await fetchSolarIrradianceData(lat, long);
    const yearlyData = getYearlyPower(solarData, area, efficiency, panels);

    const set = [
      yearlyData["01"],
      yearlyData["02"],
      yearlyData["03"],
      yearlyData["04"],
      yearlyData["05"],
      yearlyData["06"],
      yearlyData["07"],
      yearlyData["08"],
      yearlyData["09"],
      yearlyData["10"],
      yearlyData["11"],
      yearlyData["12"],
    ];
    console.log("Set:");
    console.log(set);

    setKwData(set);
    setLoading(false);
  };

  const [pLength, setPLength] = useState(1.651);
  const [pWidth, setPWidth] = useState(0.9906);
  const [pEff, setPEff] = useState(18);
  const [pNum, setPNum] = useState(20);
  const [long, setLong] = useState(-98.491142);
  const [lat, setLat] = useState(29.424349);
  const [loading, setLoading] = useState(false);

  const [kwData, setKwData] = useState();

  return (
    <div id="wrapper">
      <div className="half">
        <div className="input-row">
          <div className="input-box">
            <label>Panel Length (m)</label>
            <input
              className="input-primary input-md rounded-md"
              type="number"
              placeholder="Panel Length (m)"
              value={pLength}
              onChange={(e) => setPLength(e.currentTarget.value)}
            ></input>
          </div>
          <div className="input-box">
            <label>Panel Width (m)</label>
            <input
              className="input-primary input-md rounded-md"
              type="number"
              placeholder="Panel Width (m)"
              value={pWidth}
              onChange={(e) => setPWidth(e.currentTarget.value)}
            ></input>
          </div>
          <div className="input-box">
            <label>Panel Efficiency (%)</label>
            <input
              className="input-primary input-md rounded-md"
              type="number"
              placeholder="Panel Efficiency (%)"
              value={pEff}
              onChange={(e) => setPEff(e.currentTarget.value)}
            ></input>
          </div>
        </div>
        <div className="input-row">
          <div className="input-box">
            <label>Number of Panels</label>
            <input
              className="input-primary input-md rounded-md"
              type="number"
              placeholder="Number of Panels"
              value={pNum}
              onChange={(e) => setPNum(e.currentTarget.value)}
            ></input>
          </div>
          <div className="input-box">
            <label>Longitude</label>
            <input
              className="input-primary input-md rounded-md"
              type="number"
              placeholder="Longitude"
              value={long}
              onChange={(e) => setLong(e.currentTarget.value)}
            ></input>
          </div>
          <div className="input-box">
            <label>Latitude</label>
            <input
              className="input-primary input-md rounded-md"
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.currentTarget.value)}
            ></input>
          </div>
        </div>
        <button
          className="btn btn-primary mb-4"
          onClick={() => {
            performCalc(lat, long, pLength * pWidth, pEff / 100, pNum);
          }}
        >
          Calculate
        </button>
        {loading && <p className="text-base-100">Fetching data...</p>}
      </div>
      <div className="half">
        {kwData && <Line data={getChartData(kwData)} />};
      </div>
    </div>
  );
};

export default Calculator;
