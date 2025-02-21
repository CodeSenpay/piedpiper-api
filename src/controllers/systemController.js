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
    const response = await systemModel.setStudentBalanceOnDatabase(req.body);
    res.send(response);
  }

  async payBalance(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.json({ message: "No Data Sent" });
    }
    const response = await systemModel.storePayBalanceTransaction(req.body);
    res.send(response);
  }

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
}

module.exports = SystemController;
