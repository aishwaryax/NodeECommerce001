const fs = require('fs');
const path = require('path');

const p = path.join(
            path.dirname(process.mainModule.filename), 
            'data',
            'cart.json'
        );

module.exports = class Cart {
    static addProduct (id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                console.log("here");
                updatedProduct.quantity = existingProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else {
                updatedProduct = { id: id, quantity: 1 };
                console.log("there");
                console.log(updatedProduct.id, updatedProduct.quantity);
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct (id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(product => product.id === id);
            if (!product) {
                console.log("we came here");
                return;
            }
            updatedCart.totalPrice = updatedCart.totalPrice - product.quantity*productPrice;
            updatedCart.products = updatedCart.products.filter(product => product.id !== id); 
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }
}