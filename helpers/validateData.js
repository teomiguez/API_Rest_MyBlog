const validator = require("validator");

const validateData = (res, parameters) => {
    let valTitle = (!validator.isEmpty(parameters.title)) && (validator.isLength(parameters.title, {min: 5, max: undefined}));
    let valContent = (!validator.isEmpty(parameters.content)) && (validator.isLength(parameters.content, {min: 5, max: undefined}));

    if ((!valTitle) || (!valContent))
    {
        throw new Error("Error en validación")    
    }
}

const validateFile = (fileExtension) => {
    if ((fileExtension != "png") && (fileExtension != "jpg") && (fileExtension != "jpeg") && (fileExtension != "gif"))
    {
        return false;
    }
    else
    {
        return true;
    }
}

module.exports = {
    validateData,
    validateFile
}