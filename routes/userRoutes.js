const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 创建数据库连接
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// 注册用户
router.post('/sign', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log(username, password);
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        console.log('注册');
        res.json({ result: true, username });
        await connection.end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: false, message: '注册失败' });
    }
});

// 登录用户
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET);
            res.json({ result: true, username, token });
        } else {
            res.status(401).json({ result: false, message: '用户名或密码错误' });
        }
        await connection.end();
    } catch (error) {
        res.status(500).json({ result: false, message: '登录失败' });
    }
});

// 更改密码
router.put('/updatepwd', async (req, res) => {
    const { username, newpwd } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE users SET password = ? WHERE username = ?', [newpwd, username]);
        res.json({ result: true, username, message: '密码更改成功' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ result: false, message: '更改密码失败' });
    }
});

module.exports = router; 