const sandboxUrl = 'http://vdrapi.yourdataprocessor.com/VDR/';
// const prodUrl = 'http://stockholdingdmsvdr.com/vdrwebapi/VDR/';
// const prodUrl = 'http://223.31.219.244:8030/VDR/';
const prodUrl = 'http://223.31.103.159:8012/VDR/';
const userUrl = `${prodUrl}User/`;
const documentUrl = `${prodUrl}Document/`;

module.exports = {
    LOGIN_URL: userUrl + 'Validate',
    forgotpassword_URL: userUrl + 'ForgotPassword',
    GetAllVdr_URL: documentUrl + 'GetAllVdr',
    GetAllDepartments_URL: documentUrl + 'GetAllVdrDepartments',
    GetAllVdrMetaTemplates_URL: documentUrl + 'GetAllVdrMetaTemplates',
    GetAllVdrMetaTemplateFoldersAndFiles_URL: documentUrl + 'GetAllVdrMetaTemplateFoldersAndFiles',
    GetAllVdrMetaTemplateFoldersAndFiles_URL2: documentUrl + 'GetAllFoldersAndFiles',
    GetPendingRequest: documentUrl+'GetPendingRequests',
    CreateRequest: documentUrl+'CreateRequest',
    CreateRequestSubmit: documentUrl+'CreateRequestSubmit',
    UpdateTask: documentUrl+'UpdateHumanTask',
    GetMyRequest: documentUrl+'GetMyRequests',
    Copy_URL : documentUrl + "Copy",
    Move_URL : documentUrl + "Move",
    Delete_URL : documentUrl + "Delete",
    Upload_URL : documentUrl + "Upload",
    View_URL : documentUrl + "view",
    Rename_URL : documentUrl + "Rename"
};
