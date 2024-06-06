import PushNotification from 'react-native-push-notification';

export const localNotificaton = (props: any) => {
  PushNotification.localNotification({
    channelId: props.channelId,
    messageId: props.messageId,
    title: props.title,
    message: props.message,
    playSound: true,
  });
};
