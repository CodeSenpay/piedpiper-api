const SystemModel = require("../models/system");

const systemModel = new SystemModel();

class SystemController {
  async registerStudent(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.registerStudentToDatabase(req.body);
    res.status(response.statuscode).send(response);
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

  async getTransactionDetails(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({ message: "No Data Sent", statuscode: 400 });
    }

    try {
      const response = await systemModel.getTransactionDetailsFromDatabase(
        req.body
      );
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message, statuscode: 500 });
    }
  }

  async insertTransactionAdjustment(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({ message: "No Data Sent", statuscode: 400 });
    }

    try {
      const response = await systemModel.insertTransactionAdjustmentToDatabase(
        req.body
      );
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message, statuscode: 500 });
    }
  }

  async updateTransactionAmount(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({ message: "No Data Sent", statuscode: 400 });
    }

    try {
      const response = await systemModel.updateTransactionAmountInDatabase(
        req.body
      );
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message, statuscode: 500 });
    }
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

  async getCollection(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }

    const response = await systemModel.getDailyCollectionToDatabase(req.body);

    res.json(response);
  }

  async getOtherTransactionsByCashier(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({ message: "No Data Sent", statuscode: 400 });
    }

    try {
      const response = await systemModel.getOtherTransactionsByCashier(
        req.body
      );
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message, statuscode: 500 });
    }
  }

  async getPaybalanceTransactionsByCashier(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({ message: "No Data Sent", statuscode: 400 });
    }

    try {
      const response = await systemModel.getPaybalanceTransactionsByCashier(
        req.body
      );
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message, statuscode: 500 });
    }
  }
}

module.exports = SystemController;
