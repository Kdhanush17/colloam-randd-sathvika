const { Tax, StateMapping, State } = require("../../models");
const logger = require("../../../utils/winston");
const { Op } = require("sequelize");


// ✅ Get single tax
let gettax = async (req, res) => {
  try {
    const taxdata = await Tax.findOne({
      where: {
        id: req.query.tax_id,
        active: true
      },
      attributes: [
        "tax_name", "type", "value",
        "created_by", "updated_by",
        "createdat", "updatedat"
      ]
    });

    return logger.success(res, "Tax data retrieved successfully", taxdata);
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in tax List");
  }
};


// ✅ Create tax
const taxCreate = async (req, res) => {
  try {
    const taxData = await Tax.create({
      tax_name: req.body.tax_name,
      type: req.body.type,
      value: req.body.value,
      country_code: req.body.country_code,
      state: req.body.state || null,
      description: req.body.description || "",
      active: req.body.active ?? true,
      created_by: req.userDetails?.superAdminId || null,
      updated_by: req.userDetails?.superAdminId || null,
      createdat: new Date(),
      updatedat: new Date(),
    });

    return logger.success(res, "Tax created successfully", taxData);
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in insert tax");
  }
};


// ✅ Update tax
const updateTax = async (req, res) => {
  try {
    await Tax.update({
      tax_name: req.body.tax_name,
      type: req.body.type,
      value: req.body.value,
      country_code: req.body.country_code,
      state: req.body.state || null,
      description: req.body.description || "",
      active: req.body.active ?? true,
      updated_by: req.userDetails?.superAdminId || null,
      updatedat: new Date(),
    }, {
      where: { id: req.body.tax_id }
    });

    return logger.success(res, "Tax updated successfully");
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in Tax update");
  }
};


// ✅ Soft delete
let deleteTax = async (req, res) => {
  try {
    await Tax.update(
      { active: false },
      { where: { id: req.body.tax_id } }
    );

    return logger.success(res, "Tax deleted successfully");
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in delete Tax");
  }
};


// ✅ Get state mapping
let getstatemaping = async (req, res) => {
  try {
    const data = await StateMapping.findAll({
      where: { state_id: req.query.state_id },
      attributes: ["state_id", "tax_id"]
    });

    if (data.length > 0) {
      const taxIds = data.map(i => i.tax_id).flat();
      return logger.success(res, "State mappings retrieved", { taxIds });
    }

    return res.status(404).json({ message: "No data found" });

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in statemap List");
  }
};


// ✅ Create / Update mapping
const stateMapCreate = async (req, res) => {
  try {
    const { state_id, tax_id } = req.body;

    const existing = await StateMapping.findOne({
      where: { state_id }
    });

    if (existing) {
      await StateMapping.update(
        { tax_id },
        { where: { state_id } }
      );
    } else {
      await StateMapping.create({ state_id, tax_id });
    }

    return logger.success(res, "State mappings updated");
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in state mapping");
  }
};


// ✅ Delete mapping
let statemapDelete = async (req, res) => {
  try {
    await StateMapping.destroy({
      where: { id: req.body.statemap_id }
    });

    return logger.success(res, "State mapping deleted");
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in delete statemap_id");
  }
};


// ✅ Get all taxes
let getTaxes = async (req, res) => {
  try {
    const taxes = await Tax.findAll({
      where: { active: true },
      attributes: ["id", "tax_name"],
      order: [["id", "DESC"]]
    });

    return logger.success(res, "Taxes retrieved", taxes);
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in get taxes");
  }
};


// ✅ State-wise taxes (JOIN instead of populate)
let getstatewisetaxes = async (req, res) => {
  try {
    const data = await StateMapping.findAll({
      include: [
        {
          model: State,
          as: "state",
          attributes: ["state_name"]
        },
        {
          model: Tax,
          as: "tax",
          attributes: ["tax_name"]
        }
      ],
      order: [["id", "DESC"]]
    });

    const taxData = await Tax.findAll({
      where: { active: true },
      attributes: ["id", "tax_name"]
    });

    return logger.success(res, "State-wise taxes retrieved", {
      tax_data: data,
      tax_master: taxData
    });

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in get statewise taxes");
  }
};


// ✅ Get single mapping
let getstatetax = async (req, res) => {
  try {
    const data = await StateMapping.findOne({
      where: { id: req.query.id },
      attributes: ["state_id", "tax_id"]
    });

    return logger.success(res, "State Tax retrieved", data);
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in get state tax");
  }
};


module.exports = {
  getstatetax,
  getstatewisetaxes,
  getTaxes,
  gettax,
  taxCreate,
  updateTax,
  deleteTax,
  stateMapCreate,
  statemapDelete,
  getstatemaping,
};