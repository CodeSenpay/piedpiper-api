const SystemModel = require("../models/system");
const systemModel = new SystemModel();
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Configure file filter to only accept Excel files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed"), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("file");

class SystemController {
  async registerStudent(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    try {
      // Validate request
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: "Content cannot be empty!",
        });
      }

      // Check if student ID already exists
      const existingStudentById = await systemModel.findByStudentId(
        req.body.studentId
      );

      if (existingStudentById) {
        return res.status(409).json({
          success: false,
          message: "Student ID already exists",
        });
      }

      // Check if email already exists
      const existingStudentByEmail = await systemModel.findByEmail(
        req.body.email
      );
      if (existingStudentByEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Save Student in the database
      const data = await systemModel.create({
        studentId: req.body.studentId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        course: req.body.course,
        yearLevel: req.body.yearLevel,
        semester: req.body.semester,
        section: req.body.section,
        emergencyContactName: req.body.emergencyContactName,
        emergencyContactNumber: req.body.emergencyContactNumber,
      });
      res.status(201).json({
        success: true,
        message: "Student registered successfully!",
        data: data,
      });
    } catch (err) {
      console.error("Error during student registration:", err);

      // Handle specific MySQL errors
      if (err.code === "ER_DUP_ENTRY") {
        let message = "Duplicate entry";
        if (err.sqlMessage.includes("student_id")) {
          message = "Student ID already exists";
        } else if (err.sqlMessage.includes("email")) {
          message = "Email already exists";
        }
        return res.status(409).json({
          success: false,
          message,
        });
      }

      res.status(500).json({
        success: false,
        message: "An error occurred while registering the student",
        error: err.message || "Some error occurred during registration",
      });
    }
  }

  async getStudentInfo(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.getStudentInfoToDatabase(req.body);

    res.send(response);
  }

  async getStudentEnrollment(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.getStudentEnrollmentToDatabase(req.body);
    res.send(response);
  }

  async setStudentBalance(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    if (req.user.userEmail === "") {
      res.json({ message: "Error", statuscode: 0 });
    }

    const response = await systemModel.setStudentBalanceOnDatabase(req.body);
    res.send(response);
  }

  async payBalance(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }
    const response = await systemModel.storePayBalanceTransaction(
      req.body.toPayBalanceData
    );
    res.send(response);
  }

  async otherPayments(req, res) {}

  async getAllStudent(req, res) {
    // if (!req.body || Object.keys(req.body).length === 0) {
    //   res.status(404).json({ message: "No Data Sent" });
    // }

    const response = await systemModel.getAllStudentDataOnDatabase();

    res.json(response);
  }

  async getDegrees(req, res) {
    const response = await systemModel.getDegreesOnDatabase();
    res.json(response);
  }

  async getMiscellaneousFees(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }
    const response = await systemModel.getMiscellaneousFeesOnDatabase(req.body);
    res.json(response);
  }
  async getMiscellaneousFeesTotal(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }
    const response = await systemModel.getMiscellaneousFeesTotalOnDatabase(
      req.body
    );
    res.json(response);
  }
  async getTuitionFees(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }
    const response = await systemModel.getTuitionFeesOnDatabase(req.body);
    res.json(response);
  }
  async getAllEnrollments(req, res) {
    const response = await systemModel.getAllEnrollmentsOnDatabase();
    res.json(response);
  }

  async getEnrollment(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }
  }

  async insertToLedger(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.insertToLedgerDatabase(req.body);
    res.json(response);
  }
  async updateCurrentBalance(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.updateStudentCurrentBalanceToDatabase(
      req.body
    );
    res.json(response);
  }

  async getStudentBalance(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }
    const response = await systemModel.getStudentBalanceToDatabase(req.body);

    res.json(response);
  }

  async getOtherPaymentsFees(req, res) {
    const response = await systemModel.getOtherPaymentsFeesToDatabase();
    res.json(response);
  }

  async setOtherPaymentTransaction(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.setOtherPaymentTransactionToDatabase(
      req.body
    );

    res.json(response);
  }

  async getStudentLedger(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.getStudentLedgerToDatabase(req.body);
    res.json(response);
  }

  // Handle bulk student registration from Excel file
  async bulkRegisterStudents(req, res) {
    // Use multer to handle file upload
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(400).json({
          success: false,
          message: `Error: ${err.message}`,
        });
      }

      // Check if file exists
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      try {
        // Check if user is admin
        if (req.user && req.user.userLevel !== "admin") {
          // Delete the uploaded file
          fs.unlinkSync(req.file.path);

          return res.status(403).json({
            success: false,
            message:
              "Only administrators can perform bulk student registration",
          });
        }

        // Read the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Validate the data
        if (!data || data.length === 0) {
          // Delete the uploaded file
          fs.unlinkSync(req.file.path);

          return res.status(400).json({
            success: false,
            message: "Excel file is empty or has invalid format",
          });
        }

        // Process each student record
        const results = {
          success: true,
          registeredCount: 0,
          failedCount: 0,
          errors: [],
        };

        for (const student of data) {
          try {
            // Validate required fields
            if (
              !student.studentId ||
              !student.firstName ||
              !student.lastName ||
              !student.email
            ) {
              results.errors.push({
                studentId: student.studentId || "Unknown",
                error:
                  "Missing required fields (studentId, firstName, lastName, or email)",
              });
              results.failedCount++;
              continue;
            }

            // Check if student ID already exists
            const existingStudentById = await systemModel.findByStudentId(
              student.studentId
            );
            if (existingStudentById) {
              results.errors.push({
                studentId: student.studentId,
                error: "Student ID already exists",
              });
              results.failedCount++;
              continue;
            }

            // Check if email already exists
            const existingStudentByEmail = await systemModel.findByEmail(
              student.email
            );
            if (existingStudentByEmail) {
              results.errors.push({
                studentId: student.studentId,
                email: student.email,
                error: "Email already exists",
              });
              results.failedCount++;
              continue;
            }

            // Save student to database
            await systemModel.create({
              studentId: student.studentId,
              firstName: student.firstName,
              lastName: student.lastName,
              middleName: student.middleName || "",
              gender: student.gender || "male",
              birthDate: student.birthDate || null,
              email: student.email,
              phoneNumber: student.phoneNumber || "",
              address: student.address || "",
              course: student.course || "Computer Science",
              yearLevel: student.yearLevel || "1",
              semester: student.semester || "First",
              section: student.section || "",
              emergencyContactName: student.emergencyContactName || "",
              emergencyContactNumber: student.emergencyContactNumber || "",
            });

            results.registeredCount++;
          } catch (error) {
            results.errors.push({
              studentId: student.studentId || "Unknown",
              error: error.message,
            });
            results.failedCount++;
          }
        }

        // Delete the uploaded file after processing
        fs.unlinkSync(req.file.path);

        // Return results
        return res.status(200).json({
          success: true,
          message: `Processed ${data.length} students: ${results.registeredCount} registered, ${results.failedCount} failed`,
          registeredCount: results.registeredCount,
          failedCount: results.failedCount,
          errors: results.errors.length > 0 ? results.errors : undefined,
        });
      } catch (error) {
        // Delete the uploaded file if it exists
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }

        console.error("Error processing Excel file:", error);
        return res.status(500).json({
          success: false,
          message: `Error processing Excel file: ${error.message}`,
        });
      }
    });
  }

  async getTeachingLoad(req, res) {
    try {
      const { yearLevel, semester } = req.body;

      // Validate required parameters
      if (!yearLevel || !semester) {
        return res.status(400).json({
          success: false,
          message: "Year level and semester are required",
        });
      }

      // Call the model function to get teaching load data
      const teachingLoadData =
        await systemModel.getTeachingLoadByYearAndSemester(yearLevel, semester);

      return res.status(200).json({
        success: true,
        data: teachingLoadData,
      });
    } catch (error) {
      console.error("Error in getTeachingLoad controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getStudentsForSubject(req, res) {
    try {
      const { subjectCode } = req.body;

      // Validate required parameters
      if (!subjectCode) {
        return res.status(400).json({
          success: false,
          message: "Subject code is required",
        });
      }

      // Call the model function to get students data
      const studentsData = await systemModel.getStudentsBySubjectCode(
        subjectCode
      );

      return res.status(200).json({
        success: true,
        data: studentsData,
      });
    } catch (error) {
      console.error("Error in getStudentsForSubject controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async saveStudentGrades(req, res) {
    try {
      const { grades } = req.body;

      // Validate required parameters
      if (!grades || !Array.isArray(grades) || grades.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Grades data is required and must be an array",
        });
      }

      // Validate each grade object
      for (const grade of grades) {
        if (
          !grade.student_number ||
          !grade.subject_code ||
          !grade.score ||
          !grade.semester ||
          !grade.year
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each grade must include student_number, subject_code, score, semester, and year",
          });
        }
      }

      // Call the model function to save grades
      const result = await systemModel.saveGrades(grades);

      return res.status(200).json({
        success: true,
        message: "Grades saved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in saveStudentGrades controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getAllStudentGrades(req, res) {
    try {
      // Extract filter parameters from query
      const { yearLevel, semester, subjectCode } = req.query;

      // Create filters object
      const filters = {
        yearLevel,
        semester,
        subjectCode,
      };

      // Call the model function to get all student grades with filters
      const gradesData = await systemModel.getAllStudentGrades(filters);

      return res.status(200).json(gradesData);
    } catch (error) {
      console.error("Error in getAllStudentGrades controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getStudentGradesByStudentId(req, res) {
    try {
      const { studentId } = req.body;

      // Validate required parameters
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      // Call the model function to get student grades
      const gradesData = await systemModel.getStudentGradesByStudentId(
        studentId
      );

      return res.status(200).json(gradesData);
    } catch (error) {
      console.error("Error in getStudentGradesByStudentId controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getAllSubjects(req, res) {
    try {
      // Call the model function to get all subjects
      const subjectsData = await systemModel.getAllSubjects();

      return res.status(200).json(subjectsData);
    } catch (error) {
      console.error("Error in getAllSubjects controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = SystemController;
