const { default: mongoose } = require("mongoose");

const connection = async () => {
    try
    {
        await mongoose.connect("mongodb://localhost:27017/my_blog");

        /*
            NOTAS POSIBLES ERRORES O AVISOS:
        
            1.  Si la conexion tira un aviso, se le deben pasar unos parametros junto al String en forma de objeto.
                Esto en versiones anteriores era parte de los parametros obligatorios, en esta versión ya no lo es.

                Parametros en objeto
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
                }

                En caso de usarlos quedaría así: "await mongoose.connect("", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});""
        
            2.  En las ultimas versiones de node puede dar un error de conexión, se soluciona cambiando "localhost" por 127.0.0.1
                Quedando así: "await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");"
            
            3.  Puede salir algun waring en consola relacionado a "strictQuery" que sera seteado o algo así, en ese caso luego de llamar a
                a la función 'connect' agregamos la siguiente linea:

                mongoose.set("strictQuery", true);
        */

        console.log("Conexion exitosa🚀");
    }
    catch(error)
    {
        console.log(error);
        throw new Error("No se ha podido establecer la conexion con la base de datos⛔");
    }
}

module.exports = {
    connection
}