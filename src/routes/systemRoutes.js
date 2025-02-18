const express = require("express");
const SystemController = require("../controllers/systemController");
const router = express.Router();

const system = new SystemController();

router.post("/register-student", system.registerStudent);
router.post("/get-student-info", system.getStudentInfo);
router.post("/setbalance", system.setStudentBalance);
router.post("/paybalance", system.payBalance);
router.get("/get-all-student", system.getAllStudent);

module.exports = router;
