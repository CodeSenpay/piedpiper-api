const express = require("express");
const SystemController = require("../controllers/systemController");
const { middleWare } = require("../utils/middleware");
const router = express.Router();

const system = new SystemController();

router.post("/register-student", middleWare, system.registerStudent);
router.post("/get-student-info", system.getStudentInfo);
router.post("/get-student-enrollment", middleWare, system.getStudentEnrollment);
router.post("/getbalance", system.getStudentBalance);
router.post("/setbalance", middleWare, system.setStudentBalance);
router.post("/otherpayments", middleWare);
router.post("/get-tuition-fees", system.getTuitionFees);
router.post("get-enrollment");
router.post("/get-miscellaneous-fees", system.getMiscellaneousFees);

router.post("/paybalance", middleWare, system.payBalance);
router.post("/update-current-balance", middleWare, system.updateCurrentBalance);
router.post("/insert-to-ledger", middleWare, system.insertToLedger);

router.post("/get-student-ledger", system.getStudentLedger);

router.get("/get-degrees", system.getDegrees);
router.post("/get-miscellaneous-fees-total", system.getMiscellaneousFeesTotal);
router.get("/get-enrollments", system.getAllEnrollments);
router.get("/get-all-student", system.getAllStudent);

module.exports = router;
