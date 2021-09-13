import { init } from "@datadog/ui-apps-sdk";
import { setupWidgetCtxMenu } from "./widget-ctx-menu";

export default function setup() {
  const client = init({ debug: true });
  setupWidgetCtxMenu(client);

  const root = document.getElementById("root");
  if (!root) {
    return;
  }
  root.innerHTML = `
    <div>
      The application controller is running in the background.
    </div>
    <a href='/widget'> Click here to open your widget </a>
  `;
}
