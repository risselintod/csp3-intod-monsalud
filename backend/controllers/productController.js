// controllers/productController.js

//[SECTION] Activity: Dependencies and Modules
const Product = require("../models/Product.js");
const { errorHandler } = require("../auth.js");

//[SECTION] create-product
module.exports.addProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(409).send({ message: "Product already exists" });
        }

        const newProduct = new Product({ name, description, price });
        const result = await newProduct.save();

        res.status(201).send(result);

    } catch (error) {
        errorHandler(error, req, res);
    }
};

//[SECTION] retrieve-all-products
module.exports.getAllProducts = async (req, res) => {
    try {

        if (!req.user || !req.user.isAdmin) {
            return res.status(403).send({ 
                auth: "Failed",
                message: "Action forbidden"
            });
        }

        const products = await Product.find({});

        if (products.length > 0) {
            return res.status(200).send(products);
        } else {
            return res.status(404).send({ message: "No product found" });
        }

    } catch (error) {
        errorHandler(error, req, res);
    }
};

//[SECTION] retrieve-all-active-products
module.exports.getAllActiveProducts = async (req, res) => {
    try {
        const activeProducts = await Product.find({ isActive: true });

        if (activeProducts.length > 0) {
            return res.status(200).send(activeProducts);
        } else {
            return res.status(404).send({ message: "No products available" });
        }

    } catch (error) {
        errorHandler(error, req, res);
    }
};

//[SECTION] retrieve-single-product
module.exports.getProduct = (req, res) => {
    return Product.findById(req.params.productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        return res.status(200).send(product);
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] update-product-info
module.exports.updateProduct = (req, res) => {
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    };

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(product => {
        if (product) {
            res.status(200).send({ success: true, message: "Product updated successfully" });
        } else {
            res.status(404).send({ error: "Product not found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] archive-product
module.exports.archiveProduct = (req, res) => {
    return Product.findById(req.params.productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if (product.isActive === false) {
            return res.status(200).send({ message: "Product already archived", archivedProduct: product });
        }
        return Product.findByIdAndUpdate(req.params.productId, { isActive: false }, { new: true })
            .then(updatedProduct => {
                if (updatedProduct) {
                    res.status(200).send({ success: true, message: "Product archived successfully" });
                } else {
                    res.status(404).send({ error: "Product not found" });
                }
            })
            .catch(error => errorHandler(error, req, res));
    })
    .catch(error => errorHandler(error, req, res));
};

// [SECTION] activate-product
module.exports.activateProduct = (req, res) => {
    return Product.findById(req.params.productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if (product.isActive === true) {
            return res.status(200).send({ message: "Product already active", activateProduct: product });
        }
        return Product.findByIdAndUpdate(req.params.productId, { isActive: true }, { new: true })
            .then(updatedProduct => {
                if (updatedProduct) {
                    res.status(200).send({ success: true, message: "Product activated successfully" });
                } else {
                    res.status(404).send({ error: "Product not found" });
                }
            })
            .catch(error => errorHandler(error, req, res));
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] search-by-name
module.exports.searchProductByName = (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).send({ message: "Input product name" });
    }

    return Product.find({ name: { $regex: name, $options: 'i' } })
    .then(matchedProducts => {
        if (matchedProducts.length > 0) {
            res.status(200).send(matchedProducts);
        } else {
            res.status(404).send({ message: "No matching products found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] search-by-price-range
module.exports.searchProductsByPrice = (req, res) => {
    const { minPrice, maxPrice } = req.body;

    if (minPrice == null || maxPrice == null) {
        return res.status(400).send({
            message: "Both minPrice and maxPrice are required"
        });
    }

    return Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
    })
    .then(products => {
        if (products.length > 0) {
            res.status(200).send(products);
        } else {
            res.status(404).send({ message: "No products found in the given price range" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};
