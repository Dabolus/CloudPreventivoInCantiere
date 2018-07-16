const azure = require('azure-storage');

const queueService = azure.createQueueService();
const queue = process.env.AZURE_STORAGE_QUEUE_NAME;

module.exports = {
  sendMessage: (msg) =>
    new Promise((resolve, reject) =>
      queueService.createMessage(queue, typeof msg === 'string' ? msg : JSON.stringify(msg), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })),
};
