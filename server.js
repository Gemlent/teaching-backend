const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());

// 路由
app.use('/users', userRoutes);
app.use('/topics', topicRoutes);

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 