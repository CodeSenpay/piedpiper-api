const pool = require("../config/db");

class SystemModel {
  async registerStudentToDatabase(data) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO student_information (student_id,firstname,lastname,email,address) VALUES (?,?,?,?,?)",
        [
          data.student_id,
          data.firstname,
          data.lastname,
          data.email,
          data.address,
        ]
      );

      if (result.affectedRows === 1) {
        return { message: "Student Registered Successfully", statuscode: 200 };
      }
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return { message: "Student ID already exists", statuscode: 400 };
      } else {
        return { message: err.message, statuscode: 500 };
      }
    }
  }

  async getStudentInfoToDatabase(data) {
    try {
      const [result] = await pool.execute(
        "SELECT * FROM student_information WHERE student_id = ?",
        [data.student_id]
      );

      if (result.length === 0) {
        return { message: "No Result Found", statuscode: 404 };
      }

      return { message: "Student Found!", statuscode: 200, data: result[0] };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getStudentEnrollmentToDatabase(data) {
    try {
      const [result] = await pool.execute("CALL Get_Pay_Balance_Info(?)", [
        data,
      ]);

      if (result[0].length === 0) {
        return { message: "Student Not Enrolled Yet", statuscode: 404 };
      }
      return { message: "Student Found!", statuscode: 200, data: result[0] };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async setStudentBalanceOnDatabase(data) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO enrollments(student_id,degree_id,units,total_tuition,total_miscellaneous,total_amount,current_amount) VALUES (?,?,?,?,?,?,?)",
        [
          data.student_id,
          data.degree_id,
          data.units,
          data.tuition_fee,
          data.miscellaneous_fee,
          data.total_amount,
          data.current_amount,
        ]
      );

      if (result.affectedRows != 1) {
        return { message: "Failed to set Balance", statuscode: 0 };
      }
      return { message: "Balance is Set Successfuly", statuscode: 1 };
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return { message: "Enrollment already exists", statuscode: 0 };
      }
      console.log(err.message);
    }
  }
  async storePayBalanceTransaction(data) {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Outputs: 'YYYY-MM-DD'

    try {
      const [result] = await pool.execute(
        "INSERT INTO paybalance_transaction (transaction_id,student_id,fullname,degree_id,amount,payment_method,payment_type,cashier,payment_at) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          data.transaction_id ?? null,
          data.student_id ?? null,
          data.fullname ?? null,
          data.degree_id ?? null,
          data.amount ?? null,
          data.payment_method ?? null,
          data.payment_type ?? null,
          data.cashier ?? null,
          formattedDate ?? null,
        ]
      );

      if (result.affectedRows != 1) {
        return { message: "Error Inserting Transaction", statuscode: 0 };
      }

      return { message: "Successfully Inserted Transaction", statuscode: 1 };
    } catch (err) {
      return {
        message: err.message,
        statuscode: 0,
      };
    }
  }

  async getAllStudentDataOnDatabase() {
    try {
      const [result] = await pool.execute("SELECT * FROM student_information");
      if (result.code === "ETIMEDOUT") {
        return { message: "Connection Error", statuscode: 0 };
      }
      return {
        message: "Successfully Get All Student data",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      console.log(err.message);
    }
  }

  async getDegreesOnDatabase() {
    try {
      const [result] = await pool.execute("SELECT * FROM degrees");
      if (result.code === "ETIMEDOUT") {
        return { message: "Connection Error", statuscode: 0 };
      }
      return {
        message: "Successfully Get All Degrees data",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      console.log(err.message);
    }
  }

  async getMiscellaneousFeesOnDatabase(data) {
    try {
      const [result] = await pool.execute(
        "SELECT * FROM miscellaneous_fees WHERE degree_id = ?",
        [data.degree_id]
      );
      if (result.code === "ETIMEDOUT") {
        return { message: "Connection Error", statuscode: 0 };
      }

      return {
        message: "Successfully Get All Miscellaneous Fees Data",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      console.log(err.message);
    }
  }
  async getMiscellaneousFeesTotalOnDatabase(data) {
    try {
      let total = 0;
      const [result] = await pool.execute(
        "SELECT * FROM miscellaneous_fees WHERE degree_id = ?",
        [data.degree_id]
      );
      if (result.code === "ETIMEDOUT") {
        return { message: "Connection Error", statuscode: 0 };
      }

      result.forEach((num) => {
        total += parseInt(num.amount);
      });

      return {
        message: "Successfully Get Miscellaneous Fees Total Data",
        statuscode: 1,
        data: total,
      };
    } catch (err) {
      console.log(err.message);
    }
  }

  async create(newStudent) {
    try {
      const query = `
        INSERT INTO students (
          student_id, first_name, last_name, middle_name, gender, birth_date,
          email, phone_number, address, course, year_level, semester, section,
          emergency_contact_name, emergency_contact_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [
        newStudent.studentId ?? "",
        newStudent.firstName ?? "",
        newStudent.lastName ?? "",
        newStudent.middleName ?? "",
        newStudent.gender ?? "",
        newStudent.birthDate ?? "",
        newStudent.email ?? "",
        newStudent.phoneNumber ?? "",
        newStudent.address ?? "",
        newStudent.course ?? "",
        newStudent.yearLevel ?? "",
        newStudent.semester ?? "",
        newStudent.section ?? "",
        newStudent.emergencyContactName ?? "",
        newStudent.emergencyContactNumber ?? "",
      ]);

      return { id: result.insertId, ...newStudent };
    } catch (err) {
      console.log("Error: ", err);
      throw err;
    }
  }

  async getTuitionFeesOnDatabase(data) {
    try {
      const [result] = await pool.execute(
        "SELECT * FROM tuition_fees WHERE degree_id = ?",
        [data.degree_id]
      );

      if (result.code === "ETIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }

      return {
        message: "Successfully Get All Tuition Fees Data",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      console.log(err.message);
    }
  }
  async getAllEnrollmentsOnDatabase() {
    try {
      const [result] = await pool.execute("SELECT * FROM enrollments");
      if (result.code === "ETIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }
      return {
        message: "Successfully Get All Enrollments Data",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      console.log(err.message);
    }
  }

  async insertToLedgerDatabase(data) {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Outputs: 'YYYY-MM-DD'
    try {
      const [result] = await pool.execute(
        "INSERT INTO student_ledger(student_id,transaction_id,fullname,payment_type,debit,credit,balance,payment_method,posted_by,date) VALUES(?,?,?,?,?,?,?,?,?,?)",
        [
          data.student_id,
          data.transaction_id,
          data.fullname,
          data.payment_type,
          data.debit,
          data.amount,
          data.balance,
          data.payment_method,
          data.posted_by,
          formattedDate,
        ]
      );

      if (result.code === "TIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }

      return {
        message: "Successfully Inserted Data to Ledger",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      return {
        message: err.message,
        statuscode: 0,
      };
    }
  }

  async getStudentBalanceToDatabase(data) {
    try {
      const [result] = await pool.execute(
        "SELECT total_amount, current_amount FROM enrollments WHERE student_id = ?",
        [data.student_id]
      );

      if (result.code === "TIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }

      return {
        message: "Successfully Get Student Balance",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      return {
        message: err.message,
        statuscode: 0,
      };
    }
  }

  async updateStudentCurrentBalanceToDatabase(data) {
    try {
      const [result] = await pool.execute(
        "UPDATE enrollments SET current_amount = ? WHERE student_id = ?",
        [data.current_amount, data.student_id]
      );

      if (result.code === "TIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }

      return {
        message: "Successfully Inserted Data to Ledger",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      return {
        message: err.message,
        statuscode: 0,
      };
    }
  }

  async getStudentLedgerToDatabase(data) {
    try {
      const [result] = await pool.execute(
        "SELECT * FROM student_ledger WHERE student_id = ? ",
        [data.student_id]
      );

      if (result.code === "TIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }
      if (result.length === 0) {
        return {
          message: "No Student Transaction Yet",
          statuscode: 0,
          data: result,
        };
      }
      return {
        message: "Successfully Get Student's Ledger",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      return {
        message: err.message,
        statuscode: 0,
      };
    }
  }

  async setOtherPaymentTransactionToDatabase(data) {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Outputs: 'YYYY-MM-DD'
    try {
      const [result] = await pool.execute(
        "INSERT INTO otherpayment_transaction(transaction_id,student_id,payment_type,amount,fullname,posted_by,date) VALUES(?,?,?,?,?,?,?)",
        [
          data.transaction_id,
          data.student_id,
          data.payment_type,
          data.amount,
          data.fullname,
          data.posted_by,
          formattedDate,
        ]
      );

      if (result.code === "TIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }

      return {
        message: "Success",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      return {
        message: err.message,
        statuscode: 0,
      };
    }
  }

  async getOtherPaymentsFeesToDatabase() {
    try {
      const [result] = await pool.execute("SELECT * FROM other_fees");

      if (result.code === "TIMEDOUT") {
        return {
          message: "Connection Error",
          statuscode: 0,
        };
      }
      return {
        message: "Success",
        statuscode: 1,
        data: result,
      };
    } catch (err) {
      return {
        message: err.message,
        statuscode: 0,
      };
    }
  }

  async findByStudentId(studentId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM students WHERE student_id = ?",
        [studentId]
      );

      return rows.length ? rows[0] : null;
    } catch (err) {
      console.log("Error: ", err);
      throw err;
    }
  }

  async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM students WHERE email = ?",
        [email]
      );

      return rows.length ? rows[0] : null;
    } catch (err) {
      console.log("Error: ", err);
      throw err;
    }
  }

  async getAll() {
    try {
      const [rows] = await pool.execute("SELECT * FROM students");
      return rows;
    } catch (err) {
      console.log("Error: ", err);
      throw err;
    }
  }

  async getTeachingLoadByYearAndSemester(yearLevel, semester) {
    try {
      // SQL query with prepared statement
      const query = `
        SELECT 
          s.subject_code, 
          s.subject_name, 
          s.lec_units, 
          s.lab_units, 
          s.course_code, 
          c.course_name, 
          s.category, 
          s.semester, 
          s.year_level 
        FROM subjects s 
        JOIN course c ON s.course_code = c.course_code 
        WHERE s.year_level = ? AND s.semester = ?
      `;

      // Execute the query with parameters
      const [results] = await pool.execute(query, [yearLevel, semester]);

      return results;
    } catch (error) {
      console.error("Error in getTeachingLoadByYearAndSemester model:", error);
      throw error;
    }
  }

  async getStudentsBySubjectCode(subjectCode) {
    try {
      // SQL query with prepared statement
      const query = `
    SELECT 
    e.subject_code,
    s.subject_name,
    e.student_id,
    st.first_name,
    st.last_name,
    st.year_level,
    st.semester,
    st.section,
    COALESCE(g.score, 'N/A') AS score
    FROM enrollments e
    JOIN subjects s ON e.subject_code = s.subject_code
    JOIN students st ON e.student_id = st.student_id
    LEFT JOIN grades g ON e.student_id = g.student_number AND e.subject_code = g.subject_code
    WHERE e.subject_code = ?;
      `;

      // Execute the query with parameters
      const [results] = await pool.execute(query, [subjectCode]);

      // Format the results to include full name
      const formattedResults = results.map((student) => ({
        ...student,
        name: `${student.first_name} ${student.last_name}`,
      }));

      return formattedResults;
    } catch (error) {
      console.error("Error in getStudentsBySubjectCode model:", error);
      throw error;
    }
  }
  async saveGrades(grades) {
    let connection;
    try {
      // Start a transaction
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Prepare the insert query
      const insertQuery = `
        INSERT INTO grades (student_number, subject_code, score, semester, year)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        score = VALUES(score)
      `;

      // Insert each grade
      const results = [];
      for (const grade of grades) {
        const [result] = await connection.execute(insertQuery, [
          grade.student_number,
          grade.subject_code,
          grade.score,
          grade.semester,
          grade.year,
        ]);

        results.push(result);
      }

      // Commit the transaction
      await connection.commit();
      connection.release();

      return {
        totalSaved: results.length,
        results: results,
      };
    } catch (error) {
      // Rollback the transaction in case of error
      if (connection) {
        await connection.rollback();
        connection.release();
      }
      console.error("Error in saveGrades model:", error);
      throw error;
    }
  }

  async getAllStudentGrades(filters = {}) {
    try {
      // Start with the base query
      let query = `
        SELECT 
          g.student_number,
          CONCAT(st.first_name, ' ', COALESCE(st.middle_name, ''), ' ', st.last_name) AS full_name,
          g.subject_code,
          s.subject_name,
          g.score,
          g.semester,
          st.year_level
        FROM grades g
        JOIN students st ON g.student_number = st.student_id
        JOIN subjects s ON g.subject_code = s.subject_code
      `;

      // Initialize parameters array
      const params = [];

      // Add WHERE clause conditions based on filters
      const conditions = [];

      if (filters.yearLevel) {
        conditions.push("st.year_level = ?");
        params.push(filters.yearLevel);
      }

      if (filters.semester) {
        conditions.push("g.semester = ?");
        params.push(filters.semester);
      }

      if (filters.subjectCode) {
        conditions.push("g.subject_code = ?");
        params.push(filters.subjectCode);
      }

      // Add the WHERE clause if there are conditions
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      // Add the ORDER BY clause
      query += " ORDER BY st.year_level ASC, g.semester DESC, st.last_name ASC";

      const [results] = await pool.execute(query, params);

      return results;
    } catch (error) {
      console.error("Error in getAllStudentGrades model:", error);
      throw error;
    }
  }

  async getStudentGradesByStudentId(studentId) {
    try {
      const query = `
        SELECT 
          st.student_id,
          CONCAT(st.first_name, ' ', st.middle_name, ' ', st.last_name) AS full_name,
          g.subject_code,
          s.subject_name,
          g.score,
          g.semester,
          st.year_level
        FROM grades g
        JOIN subjects s ON g.subject_code = s.subject_code
        JOIN students st ON g.student_number = st.student_id
        WHERE g.student_number = ?
      `;

      const [results] = await pool.execute(query, [studentId]);

      return results;
    } catch (error) {
      console.error("Error in getStudentGradesByStudentId model:", error);
      throw error;
    }
  }

  async getAllSubjects() {
    try {
      const query = `
        SELECT * FROM subjects
      `;

      const [results] = await pool.execute(query);

      return {
        message: "Successfully retrieved all subjects",
        statuscode: 1,
        data: results,
        count: results.length,
      };
    } catch (error) {
      console.error("Error in getAllSubjects model:", error);
      throw error;
    }
  }

  async getGradesForClustering() {
    try {
      // Query to get all grades with student and subject information
      const query = `
        SELECT 
          g.student_number,
          st.first_name,
          st.last_name,
          g.subject_code,
          s.subject_name,
          g.score,
          g.semester,
          g.year,
          st.year_level,
          st.section
        FROM grades g
        JOIN students st ON g.student_number = st.student_id
        JOIN subjects s ON g.subject_code = s.subject_code
        ORDER BY g.student_number, g.subject_code
      `;

      const [results] = await pool.execute(query);

      // Add a default course field since it's expected by the Python ML API
      return results.map((record) => ({
        ...record,
        course: record.year_level ? `Year ${record.year_level}` : "Unknown",
      }));
    } catch (error) {
      console.error("Error in getGradesForClustering model:", error);
      throw error;
    }
  }
}

module.exports = SystemModel;
