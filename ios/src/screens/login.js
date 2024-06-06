import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {requestUserPermission} from '../common/notificationService';
export const LoginScreen = () => {
  useEffect(() => {
    requestUserPermission();
  }, []);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text> Hello </Text>
    </View>
  );
};
