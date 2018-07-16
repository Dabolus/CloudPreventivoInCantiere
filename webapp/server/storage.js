const azure = require('azure-storage');

const blobService = azure.createBlobService();
const container = process.env.AZURE_STORAGE_CONTAINER_NAME;

module.exports = {
  uploadImage: (name, image) =>
    new Promise((resolve, reject) =>
      blobService.createBlockBlobFromText(container, name, image, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(`https://cloudpicg.blob.core.windows.net/${container}/${res.name}`);
        }
      })),
};
