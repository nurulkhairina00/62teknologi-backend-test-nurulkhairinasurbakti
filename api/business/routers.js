const { Router } = require("express");
const controller = require("./controller");
const router = Router();

router.post("/", controller.addBusiness);
router.put("/:id", controller.updateBusiness);
router.delete("/:id", controller.deleteBusiness);
router.get("/search", controller.searchBusiness);

module.exports = router;
