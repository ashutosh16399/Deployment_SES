import { useState, useEffect } from "react";
import axios from "axios";
import TypeCharts from "./TypeCharts.js";
import ComparisonGraphs from "./ComparisonGraphs";
import GlobalSentiment from "./GlobalSentiment.js";
import CSVView from "./CsvDataView.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import "./App.css";
import TopicsChart from "./TopicsChart";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

function App() {
  const [data, setData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [subtopicData, setSubTopicData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState([]);
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  const [subTopicChartData, setSubTopicChartData] = useState({});
  const [showSubTopicChart, setShowSubTopicChart] = useState(false);
  const [SubTopicSelected, setSubTopicSelected] = useState("");
  const [hasTableData, sethasTableData] = useState(false);
  const [showSubTopicColumn, setShowSubTopicColumn] = useState(false);
  const [speedometerValue, setSpeedometerValue] = useState(0);
  const [positiveVal, setPositiveVal] = useState(0);
  const [negativeVal, setNegativeVal] = useState(0);
  const [neutralVal, setNeutralVal] = useState(0);
  const [PositiveAni, setPositiveAni] = useState(false);
  const [NegativeAni, setNegativeAni] = useState(false);
  const [NeutralAni, setNeutralAni] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const maxJumpCount = 5;

  useEffect(() => {
    const fetchData = async () => {
      // Get the query string from the window location
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      // Get the value of a specific query parameter
      const resultId = urlParams.get("result");

      console.log(resultId); // Output the value to the console

      try {
        // Fetch the data from the backend using Axios
        const response = await axios.get(
          `http://localhost:5000/result/${resultId}`
        );
        const data = response.data.csv_data;
        if (data) {
          setData(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    
  }, []);

  // parse CSV data & store it in the component state

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   Papa.parse(file, {
  //     header: true,
  //     complete: function (results) {
  //       setData(results.data);
  //     },
  //   });
  // };

  useEffect(() => {
    const interval = setInterval(startJumpAnimation, 2000);
    return () => clearInterval(interval);
  }, []);

  const startJumpAnimation = () => {
    setJumpCount(0);
    jumpAnimation();
  };

  const jumpAnimation = () => {
    setJumpCount((prevJumpCount) => prevJumpCount + 1);

    if (jumpCount < maxJumpCount) {
      setTimeout(jumpAnimation, 500);
    }
  };
  return (
    <>
      <div className="App">
        {/* <input type="file" accept=".csv" onChange={handleFileUpload} /> */}

        {/* Global Sentiment */}
        <div>
          <GlobalSentiment message={data} />
        </div>

        {/* Plot Graphs */}
        <div>
          <ComparisonGraphs />
        </div>


        {/* outer component */}

        <div className="outer-component">
          <div>
            <TopicsChart message={data} />
          </div>
        </div>

        <div className="graphs-component">
          <div>
            <TypeCharts message={data} />
          </div>
        </div>

        <div>
          <CSVView  data = {data}/>
        </div>
      </div>
    </>
  );
}

export default App;