const express = require("express");
const SystemController = require("../controllers/systemController");
const { middleWare } = require("../utils/middleware");
const router = express.Router();

const system = new SystemController();

router.post("/register-student", middleWare, system.registerStudent);
router.post("/get-student-info", system.getStudentInfo);
router.post("/get-student-enrollment", system.getStudentEnrollment);
router.post("/setbalance", middleWare, system.setStudentBalance);
router.post("/paybalance", middleWare, system.payBalance);
router.post("/otherpayments", middleWare);
router.post("/get-tuition-fees", system.getTuitionFees);
router.post("get-enrollment");
router.get("/get-degrees", system.getDegrees);
router.post("/get-miscellaneous-fees", system.getMiscellaneousFees);
router.post("/get-miscellaneous-fees-total", system.getMiscellaneousFeesTotal);
router.get("/get-enrollments", system.getAllEnrollments);
router.get("/get-all-student", system.getAllStudent);

module.exports = router;
