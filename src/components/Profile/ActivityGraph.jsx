import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ActivityGraph = ({ graphData, onBarClick }) => {
  const isValidGraphData =
    graphData &&
    graphData.labels &&
    graphData.labels.length > 0 &&
    graphData.datasets &&
    graphData.datasets.length > 0;

  const handleClick = (event, elements) => {
    if (!elements.length) return;

    // Get the index of the clicked bar
    const datasetIndex = elements[0].datasetIndex;
    const dataIndex = elements[0].index;

    // Extract the question title from the graph data
    const questionTitle = graphData.labels[dataIndex];
    const questionId = graphData.meta[dataIndex].questionId;

    // Call the passed click handler with question info
    onBarClick(questionId, questionTitle);
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      _dark={{ bg: "gray.700", boxShadow: "dark-lg" }}
      mt={10}
    >
      {isValidGraphData ? (
        <Bar
          data={graphData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: "top" },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
                  footer: (tooltipItems) => {
                    const questionTitle =
                      graphData.meta[tooltipItems[0].dataIndex].title;
                    return `Question: ${questionTitle}`;
                  },
                },
              },
              datalabels: {
                display: true,
                color: "white",
                font: {
                  weight: "bold",
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                  color: "#319795",
                  font: { weight: "bold" },
                },
                grid: { display: false },
                stacked: false,
              },
              y: {
                title: {
                  display: true,
                  text: "Count",
                  color: "#319795",
                  font: { weight: "bold" },
                },
                grid: { color: "#E2E8F0" },
                beginAtZero: true,
              },
            },
            onClick: handleClick, // Handle bar clicks
          }}
        />
      ) : (
        <Text
          fontSize="lg"
          color="gray.500"
          _dark={{ color: "gray.300" }}
          textAlign="center"
        >
          No data available for the graph.
        </Text>
      )}
    </Box>
  );
};

export default React.memo(ActivityGraph);
