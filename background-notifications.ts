import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { useEffect, useRef, useState } from "react";
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "./src/Utils/notifications";
import * as Notifications from "expo-notifications";
import useInterval from "./src/hooks/useInterval";
import { getNewMessages } from "./src/services/messages";

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  // ** States
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  // ** Refs
  const notificationListener = useRef<null | any>();
  const responseListener = useRef<null | any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useInterval(async () => {
    let newMessages = (await getNewMessages(timestamp)) || [];
    setTimestamp(new Date(Date.now() - 10000).toISOString());
    if (newMessages.length > 0) {
      for (let message of newMessages) {
        const fullName =
          message.sender.senderData.firstName +
          " " +
          message.sender.senderData.lastName;
        schedulePushNotification(fullName, message.subject);
      }
    }
    newMessages = [];
  }, 15000);

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

const toggleFetchTask = async () => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );

  if (isRegistered) {
    await unregisterBackgroundFetchAsync();
  } else {
    await registerBackgroundFetchAsync();
  }
};

toggleFetchTask();
