import { AsyncStorage } from 'react-native';

export async function set(key, value) {
  return await AsyncStorage.setItem(key, value);
}

export async function get(key) {
  return await AsyncStorage.getItem(key);
}

export async function remove(key) {
  return await AsyncStorage.removeItem(key);
}

export async function multiSet(object) {
  return await AsyncStorage.multiSet(object);
}

export async function multiGet(object) {
  return await AsyncStorage.multiGet(object);
}
