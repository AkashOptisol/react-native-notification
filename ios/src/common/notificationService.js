import messaging from '@react-native-firebase/messaging';
import {localNotificaton} from './localNotifications';
import PushNotification, {Importance} from 'react-native-push-notification';
import {Platform} from 'react-native';

const Notification = {
  CHANNEL_ID: 'EDUSPACE__DEFAULTCHANNEL',
  DEFAULT: 'DEFAULT_CHANNEL',
};

async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

async function requestUserPermission(callback: any) {
  console.log('Here');
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
  PushNotification.configure({
    onNotification: function (notification: Object) {
      callback && callback(notification);
    },
    onRegister: async function (token: any) {},
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });
  registerAppWithFCM();
}

const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  console.log('FCMTOKEN--->', fcmToken);
};

// const createNotificationChannel = () => {
//   PushNotification.createChannel({
//     channelId: Notification.CHANNEL_ID,
//     channelName: Notification.DEFAULT,
//     channelDescription: '',
//     playSound: true,
//     soundName: 'default',
//     importance: Importance.HIGH,
//     vibrate: true,
//   });
// };

const notificationListner = async (callback: any) => {
  let onMessage = messaging().onMessage(async receiveMessage => {
    localNotificaton({
      channelId: Notification.CHANNEL_ID,
      messageId: receiveMessage.messageId,
      title: receiveMessage.notification?.title,
      message: receiveMessage.notification?.body,
    });
  });

  let getInitialNotification = messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        callback && callback(remoteMessage);
      }
    })
    .catch(error => {});

  let notificationOpen = messaging().onNotificationOpenedApp(
    async receiveMessage => {
      callback && callback(receiveMessage);
    },
  );
  return () => {
    notificationOpen(), getInitialNotification, onMessage;
  };
};

export {requestUserPermission, getFcmToken, notificationListner};
