var config = require("../../database/config");
const pgp = require("pg-promise")();
const db = pgp(config.db);

// API to add business
const addBusiness = async (req, res) => {
  let input = req.body;

  let insertColumns = Object.keys(input).join(", ");
  let insertValues = Object.values(input);

  let sqlInsert = `INSERT INTO business (${insertColumns}) VALUES (${insertValues
    .map((_, i) => `$${i + 1}`)
    .join(", ")})`;

  await db
    .any(sqlInsert, insertValues)
    .then(() => {
      res.status(201).json({ message: "Data berhasil dimasukkan" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// API to update business
const updateBusiness = async (req, res) => {
  let { id } = req.params;
  let updateData = req.body;

  // Check id in table business
  let sqlCheckId = `SELECT * FROM business WHERE id = '${id}'`;
  let checkId = await db
    .oneOrNone(sqlCheckId)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });

  if (!checkId) {
    res.status(404).json({ error: `Data dengan id ${id} tidak ditemukan` });
  } else {
    // Update data business
    let updateColumns = Object.keys(updateData);
    let updateValues = Object.values(updateData);

    let setClause = updateColumns.map((col, index) => `${col} = $${index + 1}`);

    let sqlUpdate = `UPDATE business SET ${setClause.join(", ")} WHERE id = $${
      updateColumns.length + 1
    }`;

    db.any(sqlUpdate, [...updateValues, id])
      .then(() => {
        res.status(201).json({ message: "Data berhasil diperbarui" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
};

// API to delete business
const deleteBusiness = async (req, res) => {
  let { id } = req.params;

  // Check id in table business
  let sqlCheckId = `SELECT * FROM business WHERE id = '${id}'`;
  let checkId = await db
    .oneOrNone(sqlCheckId)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });

  if (!checkId) {
    res.status(404).json({ error: `Data dengan id ${id} tidak ditemukan` });
  } else {
    // Delete data business
    let sqlDelete = `DELETE FROM business WHERE id = '${id}'`;
    db.any(sqlDelete)
      .then(() => {
        res.status(201).json({ message: "Data berhasil dihapus" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
};

// API to search data business
const searchBusiness = async (req, res) => {
  let location = req.query.location;
  let price = req.query.price;
  let sort_by = req.query.sort_by;
  let limit = parseInt(req.query.limit);
  let offset = parseInt(req.query.offset);

  let sqlSearch = `
    SELECT * FROM business 
    ${location ? `WHERE city = '${location}'` : ``}
    ${price ? `AND price = '${price}'` : ``}
    ${sort_by ? `ORDER BY ${sort_by} DESC` : ``}
    ${limit ? `LIMIT ${limit}` : ``}
    ${offset ? `OFFSET ${offset}` : ``}
  `;
  await db
    .any(sqlSearch)
    .then((data) => {
      if (data.length > 0) {
        res.status(201).json(data);
      } else {
        res.status(404).json({ error: `Data yang dicari tidak ditemukan` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  addBusiness,
  updateBusiness,
  deleteBusiness,
  searchBusiness,
};
