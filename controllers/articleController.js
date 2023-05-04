const { error } = require("console");
const { validateData } = require("../helpers/validateData");
const { validateFile } = require("../helpers/validateData");
const Article = require("../models/Article");
const { json } = require("express");
const fs = require("fs");
const path = require("path");


const test = (req, res) => {

    return res.status(200).json({
        message: "Soy una ruta de prueba"
    });

}

const cs = (req, res) => {

    return res.status(200).json({
        message: "Counter-Strike: Global Offensive"
    });

}

const newArticle = (req, res) => {

    // Recibimos por parametros los datos a guardar
    let parameters = req.body;

    // Validamos los datos
    try {   
        validateData(res, parameters);
    }
    catch (error)
    {
        return res.status(400).json({
            status: "error",
            message: error.message
        });
    }

    // Creamos el objeto a guardar (Articulo)
    const newArticle = new Article(parameters);

    /* 
        Asignamos los valores recibidos al objeto creado
            - Manualmente -> con setters
            - Automaticamente -> pasando la variable parameters por los parametros al crear el obj
    */
    
    // Guardamos el objeto en la base de datos y devolvemos algo
    newArticle.save();

    return res.status(200).json({
        status: "success",
        message: "El articulo SI se guardo"
    });
}


// FORMA DE TRABAJAR NUEVA - MONGOOSE SE ACTUALIZO Y NO PERMITE ENVIAR POR PARAMETROS UNA FUNCION CALLBACK EN METODOS COMO FIND O SAVE
const listArticles = async (req, res) => {

    try {
        const articles = await Article.find({}) // en el "find()" puedo pasar las condiciones para la consulta

        return res.status(200).send({
            status: "success",
            articles
        });
    }
    catch (error) {
        return res.status(404).json({
            status: "error",
            message: "No se han encontrado articulos"
        });
    }
}

const listArticles_mostRecent = async (req, res) => {

    try {
        const articles = await Article.find({}).sort({ date: -1 });

        return res.status(200).send({
            status: "success",
            contador: articles.length,
            articles
        });
    }
    catch (error) {
        return res.status(404).json({
            status: "error",
            message: "No se han encontrado articulos"
        });
    }
}

const listArticles_cantDefined = async (req, res) => {
    
    try {
        const articles = await Article.find({}).limit(req.params.cant).sort({ date: -1 });

        return res.status(200).send({
            status: "success",
            parametro_recibido: req.params.cant,
            articles
        });
    }
    catch (error) {
        return res.status(404).json({
            status: "error",
            message: "No se han encontrado articulos"
        });
    }
}

const getArticle = async (req, res) => {
    let id = req.params.id;

    try {
        const article = await Article.findById(id);

        if (!article)
        {
            throw new Error("El articulo no existe");
        } else {
            return res.status(200).send({
                status: "success",
                parametro_recibido: id,
                article
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            status: "error",
            message: "No se han encontrado articulos"
        });
    }
}

const deleteArticle = async (req, res) => {
    let id = req.params.id;

    try {
        const article = await Article.findOneAndDelete({ _id: id });

        if (!article)
        {
            throw new Error("El articulo no existe");
        } else {
            return res.status(200).send({
                status: "success",
                parametro_recibido: id,
                articulo_borrado: article
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al borrar el articulo"
        });
    }
}

const updateArticle = async (req, res) => {
    let id = req.params.id;
    let parameters = req.body;

    try {
        // Validamos los datos
        validateData(res, parameters);

        // Buscamos y modificamos el articulo
        const article = await Article.findOneAndUpdate({ _id: id }, parameters, {new: true}); // new: true -> devuelve el article actualizado - new: false -> es por defecto y devuelve el pisado 
    
        if (!article)
        {
            throw new Error("El articulo no existe");
        } else {
            return res.status(200).send({
                status: "success",
                parametro_recibido: id,
                articulo_actualizado: article
            });
        }
    }
    catch (error)
    {
        return res.status(400).json({
            status: "error",
            message: error.message
        });
    }
}

const uploadImage = async (req, res) => {
    
    // Corroboramos si se envió algo
    if ((!req.file) && (!req.files))
    {
        return res.status(404).json({
            status: "error",
            message: "Petición invalida"
        });
    }

    // Id del articulo enviada por parametros
    let id = req.params.id;
    
    // Variables del archivo
    let fileOriginalName = req.file.originalname;
    let fileNameSaved = req.file.filename;
    let fileSplit = fileOriginalName.split("\.");
    let fileExtension = fileSplit[1];
    let filePath = req.file.path;

    if (validateFile(fileExtension))
    {
        // Si la validación fue exitosa (true) ->
        try {
            // 1. Actualizamos la imagen del articulo
            const article = await Article.findOneAndUpdate({ _id: id }, {img: fileNameSaved}, {new: true}); // new: true -> devuelve el article actualizado - new: false -> es por defecto y devuelve el pisado 
            // 2. Devolvemos una respuesta (exitosa o no)
            if (!article)
            {
                throw new Error("El articulo no existe");
            } else {
                return res.status(200).send({
                    status: "success",
                    parametro_recibido: id,
                    articulo_actualizado: article
                });
            }
        }
        catch (error)
        {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }
    else
    {
        // Sino -> Borramos el archivo y enviamos un error
        fs.unlink(filePath, (error) => {
            return res.status(400).json({
                status: "error",
                message: "Archivo invalido"
            });
        })
    }
}

const getImage = (req, res) => {
    let fileName = req.params.fileName;
    let filePath = "./images/articles/" + fileName;

    fs.stat(filePath, (error, exist) => {
        if (exist)
        {
            return res.sendFile(path.resolve(filePath));    
        }
        else
        {
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe"
            });
        }
    })
}

const searchArticle = async (req, res) => {
    // sacar el string de la busqueda
    let search = req.params.search;

    try
    {
        const articles = await Article.find({
            $or: [
                { "title": { "$regex": search, "$options": "i" } },
                { "content": { "$regex": search, "$options": "i" } },
            ]
        }).sort({ date: -1 });

        if (articles.length <= 0) {
            throw new Error("No se han encontrado articulos");
        }
        else
        {    
            return res.status(200).send({
                status: "success",
                contador: articles.length,
                articulos: articles
            });
        }
    }
    catch (error)
    {
        return res.status(404).json({
            status: "error",
            message: "No se han encontrado articulos"
        });
    }

}

module.exports = {
    test,
    cs,
    newArticle,
    listArticles,
    listArticles_mostRecent,
    listArticles_cantDefined,
    getArticle,
    deleteArticle,
    updateArticle,
    uploadImage,
    getImage,
    searchArticle
}

/*
    --------------------------------------------------------------------
    | OPCIÓN 1 PARA TRABAJAR CON CONTROLADORES: Programación Funcional |
    --------------------------------------------------------------------

        OPCIÓN 1:
    
            nombreMetodo1 = () => {
                    
                acá hacemos algo...

            }

            nombreMetodo2 = () => {
                    
                acá hacemos algo...

            }

            al final:

            module.exports = {
            
                nombreMetodo1,
                nombreMetodo2
            
            };

        OPCIÓN 2:

            function nombreFuncion1()
            {
                acá hacemos algo...
            }

            function nombreFuncion2()
            {
                acá hacemos algo...
            }

            al final:

            module.exports = {
            
                nombreFuncion1,
                nombreFuncion2
            
            };

        ---------------------------------------------

        Y despues al usarlo funcionan como métodos/funciones.

    -------------------------------------------------------------------------------
    |  OPCIÓN 2 PARA TRABAJAR CON CONTROLADORES: Programación Orientada a Objetos  |
    -------------------------------------------------------------------------------

        const NombreController = {
            
            nombreMetodo1 = () => {
                
                acá hacemos algo...

            }

            nombreMetodo2 = () => {
                
                acá hacemos algo...

            }

        }

        al final:

        module.exports = NombreController;

        ---------------------------------------------

        Y despues al usarlo funciona como una Clase. Es decir, creo el NombreController y accedo (con el ".") a los métodos.
*/