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
app.get("/user-room", async (req, res) => {
    console.log(req.body)
    res.sendFile(getFilePath("user.html"));
})
app.get("/already-room", async (req, res) => {
    console.log(req.body)
    res.sendFile(getFilePath("AlreadyRoom.html"));
})
app.get("/admin", async (req, res) => {
    console.log(req.body)
    res.sendFile(getFilePath("Admin.html"));
})
app.get("/add-candidates", async (req, res) => {
    console.log(req.body)
    res.sendFile(getFilePath("Add.html"));
})
app.get("/delete-candidates", async (req, res) => {
    console.log(req.body)
    res.sendFile(getFilePath("Delete.html"))
})
app.get("/update-candidates", async (req, res) => {
    console.log(req.body)
    res.sendFile(getFilePath("Update.html"))
})
app.get("/vote-count",async(req, res) => {
    console.log(req.body)
    res.sendFile(getFilePath("VoteCount.html"))
})
app.get("/user-interface", async (req, res) =>{
    console.log(req.body);
    res.sendFile(getFilePath("UserINT.html"))
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
