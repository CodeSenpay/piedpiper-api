const express = require("express");
const SystemController = require("../controllers/systemController");
const router = express.Router();

const system = new SystemController();

router.post("/register-student", system.registerStudent);
router.post("/get-student-info", system.getStudentInfo);

module.exports = router;
