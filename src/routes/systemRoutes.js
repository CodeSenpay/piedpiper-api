const express = require("express");
const SystemController = require("../controllers/systemController");
const { middleWare } = require("../utils/middleware");
const router = express.Router();
const SystemModel = require("../models/system");
const system = new SystemController();
const model = new SystemModel();

router.post("/register-student", middleWare, system.registerStudent);
router.post("/get-student-info", system.getStudentInfo);
router.post("/get-student-enrollment", middleWare, system.getStudentEnrollment);
router.post("/getbalance", system.getStudentBalance);
router.post("/setOtherpayments", middleWare, system.setOtherPaymentTransaction);
router.post("/setbalance", middleWare, system.setStudentBalance);
router.post("/otherpayments", middleWare);
router.post("/get-tuition-fees", system.getTuitionFees);
router.post("/get-miscellaneous-fees", system.getMiscellaneousFees);

router.post("/daily-collection", system.getCollection);

router.post("/paybalance", middleWare, system.payBalance);
router.post("/update-current-balance", middleWare, system.updateCurrentBalance);
router.post("/insert-to-ledger", middleWare, system.insertToLedger);

router.post("/get-student-ledger", middleWare, system.getStudentLedger);

router.get("/get-semester", model.getSemester);

router.get("/get-school-year", model.getSchoolYear);

router.get("/get-otherpayments-fees", system.getOtherPaymentsFees);
router.get("/get-degrees", system.getDegrees);
router.post("/get-miscellaneous-fees-total", system.getMiscellaneousFeesTotal);
router.get("/get-enrollments", system.getAllEnrollments);
router.get("/get-all-student", system.getAllStudent);

module.exports = router;
