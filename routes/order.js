const router = require("express").Router();

router.get("/", (req, res) => {
  res.end("Ruta conectada");
});

module.exports = router;
