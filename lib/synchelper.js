import { AsyncStorage } from 'react-native';
import Api from './api'

class SyncHelper {

  static addItemsToQueue(queueKey, value) {

    let queue = null;

    AsyncStorage.getItem(queueKey).then((items) => {

      if (items == null) {
        queue = new Array();
      }
      else {
        queue = JSON.parse(items)
      }

      queue.push(value)

      AsyncStorage.setItem(queueKey, JSON.stringify(queue));

    })

  }
  
  static Sync() {

    // this function needs to be called from somewhere which will then sync all items to server
    // for now, we are simply copy pasting functions here. These should be refactored to a common place

    // STEP 1 : sync all queues

    let itemsToSync = [{ queue: 'messageQueue', apiEndPoint: 'sendmessage' },
    { queue: 'pocQueue', apiEndPoint: 'pob' },
    { queue: 'podQueue', apiEndPoint: 'pod' },
    { queue: 'waitingQueue', apiEndPoint: 'waiting' }]

    let that = this;

    itemsToSync.forEach(function (syncItem) {

      AsyncStorage.getItem(syncItem.queue).then((items) => {

        let model;
        if (items == null) {

        }
        else {
          model = JSON.parse(items);

          model.forEach(function (modelItem, index) {

            that._syncItem(syncItem.apiEndPoint, modelItem).then(() => {
              // success
              model.splice(index, 1);
              if (model.length == 0) {
                AsyncStorage.removeItem(syncItem.queue).then(() => {
                  console.log('cleared -' + syncItem.queue);
                })
              }
            }).catch(err => {
              console.log('error occurred while syncing');
            })

          })

        }

      })

    })

  }

  static _syncItem(type, model) {

    return Api.post(type, model).then(function (data) {
      return data;
    }).catch((err) => {
      console.log('err occurred while syncing ' + type + '-' + model);
      throw err;
    });
  }

}

export default SyncHelper
