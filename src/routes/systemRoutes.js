const express = require("express");
const SystemController = require("../controllers/systemController");
const { middleWare } = require("../utils/middleware");

const router = express.Router();

const system = new SystemController();

router.post("/register-student", system.registerStudent);
router.post("/bulk-register-students", middleWare, system.bulkRegisterStudents);

router.post("/get-student-info", system.getStudentInfo);
router.post("/get-student-enrollment", middleWare, system.getStudentEnrollment);
router.post("/getbalance", system.getStudentBalance);
router.post("/setOtherpayments", middleWare, system.setOtherPaymentTransaction);
router.post("/setbalance", middleWare, system.setStudentBalance);
router.post("/otherpayments", middleWare);
router.post("/get-tuition-fees", system.getTuitionFees);
router.post("/get-miscellaneous-fees", system.getMiscellaneousFees);

router.post("/paybalance", middleWare, system.payBalance);
router.post("/update-current-balance", middleWare, system.updateCurrentBalance);
router.post("/insert-to-ledger", middleWare, system.insertToLedger);

router.post("/get-student-ledger", middleWare, system.getStudentLedger);

router.get("/get-otherpayments-fees", system.getOtherPaymentsFees);
router.get("/get-degrees", system.getDegrees);
router.post("/get-miscellaneous-fees-total", system.getMiscellaneousFeesTotal);
router.get("/get-enrollments", system.getAllEnrollments);
router.get("/get-all-student", system.getAllStudent);

router.post("/teaching-load", system.getTeachingLoad);
router.post("/subject-students", system.getStudentsForSubject);
router.post("/save-grades", system.saveStudentGrades);
router.get("/all-student-grades", system.getAllStudentGrades);
router.post("/student-grades", system.getStudentGradesByStudentId);
router.get("/get-all-subjects", system.getAllSubjects);
router.get("/all-subjects", system.getAllSubjects);
module.exports = router;
