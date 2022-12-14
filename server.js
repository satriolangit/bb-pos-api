const express = require("express");
const cors = require("cors");

const db = require("./dbconfig");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

const authorizeRoute = require("./authorize");
//app.use(authorizeRoute);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.get("/itempos", async (req, res) => {
  console.log("enter itempos endpoint");

  try {
    const sql = `SELECT distinct a.ItemParentID,a.ItemID,a.ItemName,a.ItemCode,Barcode,a.QuantityID
                  ,'' as ItemParentName
                  ,0 as Stock
                  ,'Pcs' as QuantityCode
                  ,ifnull(p.SellPrice,a.SellPrice) as SellPrice
                  ,ifnull(p.Currency,a.Currency) as Currency
                FROM ms_itm_item a
                  left join ms_itm_itemstock b
                  on a.ItemID=b.ItemID
                  left join ms_itm_itemprice p
                  on a.ItemID=p.ItemID
                  and a.Currency=p.Currency
                  and b.InventoryID=p.InventoryID
                WHERE a.Active=1
                AND b.Stock>0
                AND b.InventoryID=?
                AND a.Currency =?`;

    const data = await db.query(sql, [
      req.query.InventoryID,
      req.query.Currency,
    ]);

    res.json({ dataItem: data });
  } catch (error) {
    res.json(error);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
