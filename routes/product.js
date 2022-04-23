const Product = require("../models/Product");
const {  verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res)=> {
    const newProduct = new Product(req.body)
    console.log(newProduct)
    try {
        console.log('ele entra no acerto')
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (error) {
        console.log('ele entra no erro')

        res.status(500).json(error)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res)=> {
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true})
        
        res.status(200).json(updatedProduct);

    } catch (error) {
        res.status(500).json(err)
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Usuário foi deletado")
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET PRODUCT
router.get("/find/:id",async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        res.status(200).json( product )
    } catch (error) {
        res.status(500).json(errpr)
    }
})

//GET ALL PRODUCT
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category

    try {
        let products

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(1)
        }else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }})
        }else{
            products = await Product.find()
        }

        res.status(200).json( products )
    } catch (error) {
        res.status(500).json(errpr)
    }
})

module.exports = router
