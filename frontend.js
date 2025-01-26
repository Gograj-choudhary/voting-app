const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

const getFilePath = (relativeFilePath) => {
    return path.join(__dirname, 'public', relativeFilePath);
}

// Proxy configuration
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000/api', // Replace with the actual server URL
    changeOrigin: true,
    pathRewrite: { '^/api': '' }, // Optional: rewrite the path
    hostRewrite: 'localhost:3000',
    protocolRewrite: 'http',
    logLevel: 'debug'
}));

// Serve static files if needed
app.get("/", async(req,res) =>{
    res.sendFile(getFilePath("index.html"))
})

app.get("/login", async (req, res) =>{
    res.sendFile(getFilePath('login.html'));
});

app.get("/signup", async(req,res) =>{
    res.sendFile(getFilePath("signup.html"));
})

app.get("/admin-room", async(req,res) =>{
    console.log(req.body)
    res.sendFile(getFilePath("adminRoom.html"));
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
