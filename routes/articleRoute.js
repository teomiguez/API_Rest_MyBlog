const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, './images/articles/');
    },
    filename: function (req, file, cb)
    {
        cb(null, "article" + Date.now() + "_" + file.originalname);
    }
})

const uploads = multer({ storage: storage });

const ArticleController = require("../controllers/articleController");

// Rutas de pruebas - misma estructura que antes
router.get("/rutaArticulo_prueba", ArticleController.test);
router.get("/rutaCs", ArticleController.cs);

// Rutas utiles
router.post("/newArticle", ArticleController.newArticle);
router.get("/listArticles", ArticleController.listArticles);
router.get("/listArticles_mostRecent", ArticleController.listArticles_mostRecent);
router.get("/listArticles_cantDefined/:cant?", ArticleController.listArticles_cantDefined); // parametro opcional (?)
router.get("/getArtcle/:id", ArticleController.getArticle);
router.delete("/deleteArtcle/:id", ArticleController.deleteArticle);
router.put("/updateArtcle/:id", ArticleController.updateArticle);
router.post("/uploadImage/:id", [uploads.single("file")], ArticleController.uploadImage);
router.get("/getImage/:fileName", ArticleController.getImage);
router.get("/searchArticle/:search", ArticleController.searchArticle);


module.exports = router;