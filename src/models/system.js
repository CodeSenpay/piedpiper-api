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
}

module.exports = SystemModel;
