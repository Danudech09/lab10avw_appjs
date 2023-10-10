const expressFunction = require('express');
const mongoose = require('mongoose');
var expressApp = expressFunction();

const url = 'mongodb://127.0.0.1:27017/db_it';
const config = {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

var Schema = require("mongoose").Schema;
const userSchema = Schema({
    type: String,
    id: String,
    name: String,
    detail: String,
    quantity: Number,
    price: Number,
    file: String,
    img: String
}, {
    collection: 'products'
});

let products
try{
    Product = mongoose.model('products')
} catch (error) {
    Product = mongoose.model('products', userSchema);
}

expressApp.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
    return next()
});
expressApp.use(expressFunction.json());
expressApp.use(async (req, res, next) => {
    try {
        await mongoose.connect(url, config);
        console.log('Connected to MongoDB...');
        next();
    } catch (err) {
        console.log('Cannot connect to MongoDB');
        res.status(501).send('Cannot connect to MongoDB');
    }
});

const addProduct = (productData) => {
    return new Promise((resolve, reject) => {
        var new_product = new Product(productData);
        new_product.save()
            .then(data => {
                resolve({ message: 'Product added successfully' });
            })
            .catch(err => {
                reject(new Error('Cannot insert product to DB!'));
            });
    });
}

const getProducts = () => {
    // return new Promise ((resolve, reject) => {
    //     Product.find({}, (err,data) => {
    //         if(err){
    //             reject(new Error('Cannot get product!'));
    //         }else{
    //             if(data){
    //                 resolve(data)
    //             }else{
    //                 reject(new Error('Cannot get products!'));
    //             }
    //         }
    //     })
    // });
    return Product.find({}).exec();
}

expressApp.post('/products/add', async (req, res) => {
    console.log('add');
    try {
        const result = await addProduct(req.body);
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

expressApp.get('/products/get', async (req, res) => {
    console.log('get');
    try {
        const result = await getProducts();
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

expressApp.listen(3000, function(){
    console.log('Listening on port 3000');
});