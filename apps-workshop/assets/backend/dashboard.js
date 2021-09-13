const fetch = require("node-fetch");
const { v1 } = require("@datadog/datadog-api-client");
const WORKSHOP_COMPLETED = process.env.REACT_APP_WORKSHOP_COMPLETED === true;

const TITLE = "Submissions";

exports.createDashboard = async function(configuration, appID) {
  const apiInstance = new v1.DashboardsApi(configuration);
  let response = await apiInstance.listDashboards({});
  const existingDash = response.dashboards.find((d) => d.title === TITLE);

  let method = null;
  let endpoint = null;
  if (existingDash) {
    console.log(`Found an existing dashboard workshop app: ${existingDash.id}`);
    method = "PUT";
    endpoint = `https://app.datadoghq.com/api/v1/dashboard/${existingDash.id}`;
  } else {
    console.log("Creating a new app dashboard for the workshop app.");
    method = "POST";
    endpoint = "https://app.datadoghq.com/api/v1/dashboard";
  }

  const dashBody = {
    title: "Submissions",
    description: "",
    widgets: [
      {
        definition: {
          title: "API Gets",
          title_size: "16",
          title_align: "left",
          show_legend: true,
          legend_layout: "auto",
          legend_columns: ["avg", "min", "max", "value", "sum"],
          type: "timeseries",
          requests: [
            {
              formulas: [{ formula: "query1" }],
              response_format: "timeseries",
              on_right_yaxis: false,
              queries: [
                {
                  query: "sum:tweets.api.gets{*} by {user}.as_rate()",
                  data_source: "metrics",
                  name: "query1",
                },
              ],
              style: {
                palette: "dog_classic",
                line_type: "solid",
                line_width: "normal",
              },
              display_type: "line",
            },
          ],
          yaxis: {
            include_zero: true,
            scale: "linear",
            label: "",
            min: "auto",
            max: "auto",
          },
          markers: [],
        },
        layout: { x: 0, y: 0, width: 8, height: 4 },
      },
      {
        definition: {
          title: "Incoming submissions",
          title_size: "16",
          title_align: "left",
          show_legend: true,
          legend_layout: "auto",
          legend_columns: ["avg", "min", "max", "value", "sum"],
          type: "timeseries",
          requests: [
            {
              formulas: [{ formula: "query1" }],
              response_format: "timeseries",
              on_right_yaxis: false,
              queries: [
                {
                  query: "sum:tweets.posted{*} by {user}.as_count()",
                  data_source: "metrics",
                  name: "query1",
                },
              ],
              style: {
                palette: "dog_classic",
                line_type: "solid",
                line_width: "normal",
              },
              display_type: "bars",
            },
          ],
          yaxis: {
            include_zero: true,
            scale: "linear",
            label: "",
            min: "auto",
            max: "auto",
          },
          markers: [],
        },
        layout: { x: 0, y: 4, width: 8, height: 4 },
      },
    ],
    template_variables: [],
    layout_type: "ordered",
    is_read_only: false,
    notify_list: [],
    reflow_type: "fixed",
    id: appID,
  };

  if (WORKSHOP_COMPLETED) {
    dashBody.widgets.push({
      definition: {
        title: "",
        title_size: "16",
        title_align: "left",
        type: "custom",
        ui_app_id: "6eg-75c-cqe",
        custom_widget_key: "admin-ui",
      },
      layout: { x: 8, y: 0, width: 4, height: 8 },
    });
  }

  response = await fetch(endpoint, {
    headers: {
      "content-type": "application/json",
      "DD-API-KEY": configuration.authMethods.apiKeyAuth.apiKey,
      "DD-APPLICATION-KEY": configuration.authMethods.appKeyAuth.apiKey,
    },
    method: method,
    body: JSON.stringify(dashBody),
  });

  console.log(response);
};
