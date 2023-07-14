import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import TypeCharts from "./TypeCharts.js";
import ComparisonGraphs from "./ComparisonGraphs";
import GlobalSentiment from "./GlobalSentiment.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import TopicsChart from "./TopicsChart";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

const UIDashboard = () => {
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
  const [hasTableData, setHasTableData] = useState(false);
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
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const resultId = urlParams.get("result");
  console.log(resultId);

  useEffect(() => {
    const fetchData = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/result${resultId}`);
    const data = response.data;
    setData(data);
  } catch (error) {
    console.error(error);
  }
};


    fetchData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        setData(results.data);
      },
    });
  };

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
    <div className="App">
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <div>
        <GlobalSentiment message={data} />
      </div>

      <div>
        <ComparisonGraphs />
      </div>

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

      <br />
      <br />
    </div>
  );
};

export default UIDashboard;
