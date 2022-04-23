const User = require("../models/User");
const {  verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res)=> {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
            ).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true})
        
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Usuário foi deletado")
    } catch (error) {
        res.status(500).json(error)
    }
})

// get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query 
        ? await User.find().sort({ _id: -1 }).limit(1) 
        : await User.find()

        res.status(200).json( users )
    } catch (error) {
        res.status(500).json(error)
    }
})

// get user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...dadosWithoutPassword } = user._doc

        res.status(200).json( dadosWithoutPassword )
    } catch (error) {
        res.status(500).json(error)
    }
})

// get users status
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router