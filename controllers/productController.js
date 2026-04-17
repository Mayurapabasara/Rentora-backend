import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {
    try{
        const productData = req.body;

        const product = new Product(productData);

        await product.save()

        res.json({
            message: "Product created successfully",
            product: product
        });

    }catch(err){
        console.error(err);
        res.status(500).send("Error creating product");
    }
}

export async function getProducts(req, res) {
    try{
        const products = await Product.find();
        res.json(products);
    }catch{
        console.error(err);
        res.status(500).json({
            message: "Error fetching products"
        });
    }
    
}

export async function deleteProduct(req, res) {

    // if(!isAdmin(req)){
    //     res.status(403).json({
    //         message: "Access denied. Admins only."
    //     });
    //     return;
    // }


    try{
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }
        await Product.deleteOne({
            productId: productId
        })
        res.json({
            message: "Product deleted successfully"
        });
        
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error deleting product"
        });
    }
}

export async function updateProduct(req, res) {

    try{
        const productId = req.params.productId;
        const updateData = req.body;

        await Product.updateOne(
            {productId: productId},
            {$set: updateData}
        );
        res.json({
            message: "Product updated successfully"
        });


    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error updating product"
        });
    }
}

export async function getProductById(req, res) {
    try{
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: productId });

        if(product == null){
            res.status(404).json({
                message: "Product not found"
            });
            return res.json(product);
        }
        res.json(product);
    }catch(err){
        console.error(err);
        res.status(500).json({
                message: "Error fetching product"
            });
        }
}