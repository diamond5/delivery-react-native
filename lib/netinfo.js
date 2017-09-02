const ReactNative = require('react-native');
const {NetInfo} = ReactNative;

export async function isConnected() {

    let connection = '';
    await NetInfo.addEventListener('change',
        (networkType) => {
            return networkType;
        })
}
