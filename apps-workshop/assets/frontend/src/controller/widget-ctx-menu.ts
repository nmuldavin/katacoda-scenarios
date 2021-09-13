import { MenuItemType, UiAppEventType, DDClient } from "@datadog/ui-apps-sdk";

function extractHandle(tags: string[]) {
  // event platform tags: user:ivan@dashdogs.com
  const userHandleMatcher = /(user):(?<handle>.*)/g;

  // see if there are tags that have the user handle
  const tagWithUser = tags.find((tag: string) => tag.match(userHandleMatcher));
  if (!tagWithUser) {
    return null;
  }

  // extract handle from the tag
  // note: we're using .* for the email, not 100% accurate
  const handle = userHandleMatcher.exec(tagWithUser)?.groups?.handle;
  if (!handle) {
      return null;
  }

  return handle.replace("_", "@");
}

export const setupWidgetCtxMenu = (client: DDClient) => {
  // provide widget context menu items dynamically
  client.widgetContextMenu.onRequest(({ widgetInteraction }) => {
    const handle = extractHandle(widgetInteraction.groupTags);
    if(!handle){
      return {items: []}
    }

    return {
      items: [
        {
          actionType: MenuItemType.EVENT,
          // this key is used below to determine which action to take upon click
          key: "userinfo-trigger",
          label: `Show history for ${handle}`,
        },
      ],
    };
  });

  client.events.on(UiAppEventType.WIDGET_CONTEXT_MENU_CLICK, ({widgetInteraction, menuItem}) => {
    const handle = extractHandle(widgetInteraction.groupTags);
    if(!handle){
      return;
    }

    if (menuItem.key === "userinfo-trigger") {
      client.sidePanel.open(
        {
          key: "account-panel",
          source: "account-panel",
          title: "Account details",
        },
        {
          account: handle
        }
      );
    }
  });
};
