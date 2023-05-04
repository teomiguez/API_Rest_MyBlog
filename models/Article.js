const { Schema, model } = require("mongoose");

const ArticleSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
        default: "default.png"
    }
});

module.exports = model("Article", ArticleSchema); // El 3° parametro sería "articles"

/*
    Notas:

    - Explicación de parametros del métoddo module()
    
        1° obligatorio -> es el nombre del modelo que usaremos en nuestro codigo (al hacer el "new").
        2° opcional (recomendable ponerlo) -> es el nombre del modelo que esta en el archivo (el que definimos).
        3° opcional -> el nombre de la colección de la base de datos. En caso de no enviar este tercer parametro mongoose va a interpretar que la colección se llama igual que el String que pasamos en el primer parametro, solo que todo en minisculas y pluralizado (agregando una "s" al final).
    
    - Más información sobre los esquemas (Schema) de mongoose en https://mongoosejs.com/docs/schematypes.html

*/