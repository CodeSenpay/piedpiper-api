const express = require("express");
const SystemController = require("../controllers/systemController");
const router = express.Router();

const system = new SystemController();

router.post("/register-student", system.registerStudent);
router.post("/get-student-info", system.getStudentInfo);
router.post("/setbalance", system.setStudentBalance);
router.post("/paybalance", system.payBalance);
router.post("/get-tuition-fees", system.getTuitionFees);
router.post("get-enrollment");
router.get("/get-degrees", system.getDegrees);
router.get("/get-miscellaneous-fees", system.getMiscellaneousFees);
router.get("/get-enrollments", system.getAllEnrollments);
router.get("/get-all-student", system.getAllStudent);

module.exports = router;
