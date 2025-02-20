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
  async setStudentBalanceOnDatabase(data) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO enrollments(student_id,degree_id,units,total_tuition,total_miscellaneous,total_amount) VALUES (?,?,?,?,?,?)",
        [
          data.student_id,
          data.degree_id,
          data.units,
          data.tuition_fee,
          data.miscellaneous_fee,
          data.total_amount,
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
}

module.exports = SystemModel;
