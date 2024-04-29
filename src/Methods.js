import axios from "axios";

export async function fetchSolarIrradianceData(latitude, longitude) {
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${longitude}&latitude=${latitude}&start=20230101&end=20231231&format=JSON`;
  try {
    const response = await axios.get(url);
    const data = response.data.properties.parameter.ALLSKY_SFC_SW_DWN;
    console.log("Data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Function to calculate daily power output
export function calculateDailyPower(irradiance, area, efficiency) {
  const dailyPowerOutput = irradiance * area * efficiency; // kWh/day
  return dailyPowerOutput;
}

export function getChartData(kwData) {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ], // X-axis labels
    datasets: [
      {
        label: "Average kWh Generated per Day",
        data: kwData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  return data;
}

export function getYearlyPower(solarData, area, efficiency, panels) {
  const dates = Object.keys(solarData);

  const months = {
    "01": [],
    "02": [],
    "03": [],
    "04": [],
    "05": [],
    "06": [],
    "07": [],
    "08": [],
    "09": [],
    10: [],
    11: [],
    12: [],
  };

  dates.forEach((date) => {
    const m = date.substring(4, 6);
    const irradiance = solarData[date];

    const kwh = calculateDailyPower(irradiance, area, efficiency) * panels;

    months[m] = [...months[m], kwh];
  });

  let monthAverages = {};
  Object.keys(months).forEach((m) => {
    const avg = average(months[m]);
    monthAverages[m] = avg;
  });

  console.log(monthAverages);

  return monthAverages;
}

export function average(nums) {
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    total += nums[i];
  }

  return total / nums.length;
}
