const azure = require('azure-storage');

const queueService = azure.createQueueService();
const queue = process.env.AZURE_STORAGE_QUEUE_NAME;

module.exports = {
  getMessages: () =>
    new Promise((resolve, reject) =>
      queueService.getMessages(queue, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.map(msg => ({
            id: msg.messageId,
            content: JSON.parse(msg.messageText),
            popReceipt: msg.popReceipt,
          })));
        }
      })),
  deleteMessage: (id, popReceipt) =>
    new Promise((resolve, reject) =>
      queueService.deleteMessage(queue, id, popReceipt, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })),
};
