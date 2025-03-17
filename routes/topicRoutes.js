const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// 创建数据库连接
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// 查询用户的所有试题
router.get('/get-topic', async (req, res) => {
    const { username } = req.query;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [topics] = await connection.execute('SELECT * FROM topic_set WHERE user_id = (SELECT _id FROM users WHERE username = ?)', [username]);
        res.json({ result: true, topics });
        await connection.end();
    } catch (error) {
        res.status(500).json({ result: false, message: '查询试题失败' });
    }
});

// 增加试题
router.post('/post-topic', async (req, res) => {
    const { newContext, isCorrect, remarks } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('INSERT INTO topic_set (context, isCorrect, remarks) VALUES (?, ?, ?)', [newContext, isCorrect, remarks]);
        res.json({ result: true, insertedId: result.insertId });
        await connection.end();
    } catch (error) {
        res.status(500).json({ result: false, message: '增加试题失败' });
    }
});

// 删除试题
router.delete('/delete-topic', async (req, res) => {
    const { id } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM topic_set WHERE _id = ?', [id]);
        res.json({ result: true, message: '试题删除成功' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ result: false, message: '删除试题失败' });
    }
});

// 获取单个试题详情
router.get('/get-topic-detail', async (req, res) => {
    const { id } = req.query;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM topic_set WHERE _id = ?', [id]);
        if (rows.length > 0) {
            res.json({ result: true, topic: rows[0] });
        } else {
            res.status(404).json({ result: false, message: '试题未找到' });
        }
        await connection.end();
    } catch (error) {
        res.status(500).json({ result: false, message: '查询试题详情失败' });
    }
});

// 更新试题信息
router.put('/update-topic', async (req, res) => {
    const { id, context, isCorrect, remarks } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE topic_set SET context = ?, isCorrect = ?, remarks = ? WHERE _id = ?', [context, isCorrect, remarks, id]);
        res.json({ result: true, message: '试题更新成功' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ result: false, message: '更新试题失败' });
    }
});

module.exports = router; 