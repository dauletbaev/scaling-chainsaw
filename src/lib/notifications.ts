import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export async function onCreateTriggerNotification() {
  // Request permissions (required for iOS)
  // await notifee.requestPermission();

  const date = new Date(Date.now());
  date.setHours(9, 0, 0, 0);

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: 'Hey there! New word of the day!',
      body: `It's ${date.toLocaleDateString()}`,
      android: {
        channelId,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger,
  );
}
