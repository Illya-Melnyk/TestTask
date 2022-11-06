const express = require('express')
const signature = require('./genSig')

const HOST = "localhost";
const PORT = 8080;

const api = express() 
api.get("/", (req, res) => {
    res.send(
    console.log(signature.generateSignature("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))
    )
})

api.listen(PORT, () => {
    console.log(`Server running at http://localhost:8080/`);
});