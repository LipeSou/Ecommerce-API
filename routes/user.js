const router = require("express").Router();


router.get("/usertest", (req, res)=> {
    res.send("teste foi um sucesso!")
})

module.exports = router