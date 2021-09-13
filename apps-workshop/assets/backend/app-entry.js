const fetch = require("node-fetch");

const APP_NAME = "Workshop app";

exports.createAppEntry = async function(configuration) {
  let response = await fetch("https://app.datadoghq.com/api/v2/apps", {
    headers: {
      "DD-API-KEY": configuration.authMethods.apiKeyAuth.apiKey,
      "DD-APPLICATION-KEY": configuration.authMethods.appKeyAuth.apiKey,
    },
  });
  response = await response.json();

  const existingApp = response.data.find((app) => {
    return app.attributes.tile.title === APP_NAME;
  });

  let method = null;
  let endpoint = null;
  if (existingApp) {
    console.log(`Found an existing workshop app: ${existingApp.id}`);
    method = "PATCH";
    endpoint = `https://app.datadoghq.com/api/v2/apps/${existingApp.id}`;
  } else {
    console.log("Creating a new app entry for the workshop app.");
    method = "POST";
    endpoint = "https://app.datadoghq.com/api/v2/apps";
  }

  let mainURL = process.env.ADMIN_UI_URL || "http://localhost:3000";
  console.log(`Using ${mainURL} as main admin UI url`);

  response = await fetch(endpoint, {
    headers: {
      "content-type": "application/json",
      "DD-API-KEY": configuration.authMethods.apiKeyAuth.apiKey,
      "DD-APPLICATION-KEY": configuration.authMethods.appKeyAuth.apiKey,
    },
    body: JSON.stringify({
      data: {
        type: "apps",
        attributes: {
          author_info: {
            name: "Ivan Di Lernia",
          },
          terms: {},
          assets: {
            ui_extensions: {
              debug_mode_url: "http://localhost:3000",
              secured: true,
              main_url: mainURL,
              api_version: "v1.0",
              features: [
                {
                  name: "dashboard_custom_widget",
                  options: {
                    widgets: [
                      {
                        source: "widget",
                        options: [],
                        name: "Admin UI",
                        custom_widget_key: "admin-ui",
                        icon: "https://static.datadoghq.com/static/favicon.ico",
                      },
                    ],
                  },
                },
                {
                  name: "widget_context_menu",
                  options: {},
                },
                {
                  name: "modals",
                  options: {},
                },
                {
                  name: "side_panels",
                  options: {},
                },
              ],
            },
          },
          short_name: null,
          support_type: "partner",
          created_at: "2021-08-12T15:47:53.997855+00:00",
          proxy_scopes: [],
          stability: "stable",
          modified_at: "2021-09-08T00:47:03.116381+00:00",
          pricing: [],
          published: false,
          tile: {
            description:
              "A hello-world like application used as a starting point for apps",
            logo_media: {
              light: "https://static.datadoghq.com/static/favicon.ico",
            },
            title: "Workshop app",
          },
        },
      },
    }),
    method: method,
  });
  data = await response.json();
  return data.id;
};
