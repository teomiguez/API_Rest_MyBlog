const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Iniciar la App
console.log("Arranca mi blog👍");

// Hameos la conexion a la base de datos -> importamos connection
connection(); // connection se podría ejecutar luego de haber creado el servidor (recomendación)

// Creamos el servidor node -> importamos el paquete express
const app = express();
const port = 3900;

// Configuramos cors -> importamos el paquete cors 
app.use(cors()); // -> app.use() ejecuta un middlewear - esté ejecuta el cors antes que ejecute alguna ruta

// Convertimos body a objeto JS
app.use(express.json()); // -> app.use() ejecuta un middlewear - esté lo que hace es que al pasarle datos por POST genera un obj JS usable, sin necesidad de parcearlo
app.use(express.urlencoded({extended:true})); // recibo datos por urlencoded y los parceo a json

// Creamos rutas de prueba
app.get("/prueba", (req, res) => {
    console.log("Ejecutando el endpoint 'prueba'");
    
    /* 
        Notas:
        - siempre se debe devolver algo para mostrar por pantalla, sino el buscador queda cargando y tira error
        - status -> código http que podemos usar (buscar en google)
        - send/json -> lo que queremos devolver (con send devolvemos lo que querramos, incluido obj json, y con json objetos o colecciones)
    */
    
    return res.status(200).json([{
        titulo: "Counter-Strike: Global Offensive",
        genero: "Shooter",
        edad_minima: 18
    },
    {
        titulo: "Counter-Strike: Global Offensive",
        genero: "Shooter",
        edad_minima: 18
    },
    {
        titulo: "Counter-Strike: Global Offensive",
        genero: "Shooter",
        edad_minima: 18
    
    }]);
    
    /* OPCION 2:
    return res.status(200).send(`
        <h1> Ruta de prueba </h1>
        <p>
            Servidor creado por <strong> Teo Miguez </strong>
        </p>
    `);
    */
});

// RUTAS
const rutasArticulo = require("./routes/articleRoute");

// Cargo las rutas, ya creadas, en mi archivo de Rutas
app.use("/api", rutasArticulo); // uso un prefijo "/api" para todas mis rutas

// Creamos servidor y escuchamos peticiones http
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto: " + port)
});