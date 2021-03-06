/**
 * name : cloud-services/azure/validator/v1.js
 * author : Deepa
 * created-date : 03-Apr-2020
 * Description : Azure service input validator.
 */

module.exports = (req) => {

    let azureInputValidator = {
        upload: function () {
            req.checkBody('filePath').exists().withMessage("required filePath field");
            req.checkBody('bucketName').exists().withMessage("required bucketName field");
        },
        
        getDownloadableUrl: function () {
            req.checkBody('filePaths').exists().withMessage("required filePaths field");
            req.checkBody('bucketName').exists().withMessage("required bucketName field");
        }, 
        getSignedUrls : function() {
            req.checkBody('fileNames').exists().withMessage("required file names");
            req.checkBody('bucket').exists().withMessage("required bucket name");
        }
    }

    if (azureInputValidator[req.params.method]) {
        azureInputValidator[req.params.method]();
    }

};