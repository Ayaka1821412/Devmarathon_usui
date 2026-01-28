const express = require("express");
const app = express();
const port = 5440;

const cors = require("cors");

// 🔴 必ずルーティングより前
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_ayaka_usui", // PostgreSQLのユーザー名に置き換えてください
  host: "db",
  database: "db_ayaka_usui", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_5440", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "顧客が見つかりません" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 顧客削除
app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM customers WHERE customer_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "顧客が見つかりません" });
    }

    res.json({ success: true, message: "削除完了" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 顧客情報更新
app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { companyName, industry, contact, location } = req.body;

  try {
    await pool.query(
      `UPDATE customers
       SET company_name = $1,
           industry = $2,
           contact = $3,
           location = $4
       WHERE customer_id = $5`,
      [companyName, industry, contact, location, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

//app.use(express.static("public"));
