const pool = require("../config/db");

class SystemModel {
  async registerStudentToDatabase(data) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO student_information (student_id,firstname,lastname,email,course) VALUES (?,?,?,?,?)",
        [
          data.student_id,
          data.firstname,
          data.lastname,
          data.email,
          data.course,
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
  async setStudentBalanceOnDatabase(data) {
    try {
      const [result] = await pool.execute(
        "UPDATE student_information SET balance = ? WHERE student_id = ?",
        [data.balance, data.student_id]
      );

      if (result.changedRows === 0) {
        return { message: "Failed to set Balance", statuscode: 0 };
      }
      return { message: "Balance is Set Successfuly", statuscode: 1 };
    } catch (err) {
      console.log(err.message);
    }
  }
  async storePayBalanceTransaction(data) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO paybalance_transaction (student_id,fullname,course,amount,payment_method) VALUES(?,?,?,?,?)",
        [
          data.student_id,
          data.fullname,
          data.course,
          data.amount,
          data.payment_method,
        ]
      );
    } catch (err) {
      console.log(err.message);
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
}

module.exports = SystemModel;
