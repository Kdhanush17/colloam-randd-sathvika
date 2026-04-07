const { Plans } = require('../../models');
const AWS = require('aws-sdk');
const statusHelper = require('../../../helpers/statusHelper');
const { gets3details } = require('../../controllers/lib/systemSettings');
const { Op } = require('sequelize');


// ==============================
// 🔹 Generate Plan Code
// ==============================
async function generatePlanCode() {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(2)}`;
  const randomCode = generateRandomCode(6);
  return `JP-${formattedDate}-${randomCode}`;
}

function generateRandomCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}


// ==============================
// 🔹 Validation
// ==============================
function validatePlanData(data) {
  const { planName, planDescription, planFeatures, planIconFile, planDuration, recruiterLimit } = data;

  if (!planName?.trim()) return 'Plan Name is required';
  if (!planDescription?.trim()) return 'Plan Description is required';
  if (!planFeatures?.trim()) return 'Plan Features are required';
  if (!planIconFile) return 'Plan Icon is required';

  if (isNaN(planDuration) || planDuration < 0 || planDuration > 12) {
    return 'Plan Duration must be between 0 and 12';
  }

  if (isNaN(recruiterLimit) || recruiterLimit < 0) {
    return 'Recruiter Limit must be >= 0';
  }

  return null;
}


// ==============================
// ✅ CREATE PLAN
// ==============================
const createPlan = async (req, res) => {
  try {
    const {
      planName, planDescription, planFeatures,
      planDisplay, salePrice, regularPrice,
      planDuration, recruiterLimit
    } = req.body;

    const planIconFile = req.file ? req.file.buffer.toString('base64') : null;

    const error = validatePlanData({
      planName,
      planDescription,
      planFeatures,
      planIconFile,
      planDuration: Number(planDuration),
      recruiterLimit: Number(recruiterLimit)
    });

    if (error) return statusHelper.ErrorResponse(res, error);

    // 🔥 Sequelize check
    const existingPlan = await Plans.findOne({
      where: { planName: { [Op.iLike]: planName } }
    });

    if (existingPlan) {
      return statusHelper.ErrorResponse(res, 'Plan already exists');
    }

    // 🔹 Upload to S3
    const imageExtension = req.file.originalname.split('.').pop();
    const planIconKey = `planIcons/plans-${Date.now()}.${imageExtension}`;

    let s3details = await gets3details();
    if (!s3details.status) throw new Error(s3details.errorMessage);

    const s3 = new AWS.S3(s3details.data);

    const upload = await s3.upload({
      Bucket: s3details.data.bucketname,
      Key: planIconKey,
      Body: Buffer.from(planIconFile, 'base64'),
      ContentEncoding: 'base64',
      ContentType: req.file.mimetype
    }).promise();

    const savedPlan = await Plans.create({
      planCode: await generatePlanCode(),
      planName,
      planDescription,
      planFeatures,
      planDisplay,
      salePrice,
      regularPrice,
      planDuration,
      recruiterLimit,
      planIcon: upload.Location,
      planStatus: 'ACTIVE'
    });

    return statusHelper.successResponse(res, 'Plan Created', savedPlan);

  } catch (error) {
    console.error(error);
    return statusHelper.ErrorResponse(res, 'Error creating plan');
  }
};


// ==============================
// ✅ UPDATE PLAN
// ==============================
const updatePlan = async (req, res) => {
  try {
    const { planCode } = req.query;

    const existingPlan = await Plans.findOne({ where: { planCode } });
    if (!existingPlan) return statusHelper.ErrorResponse(res, "Plan not found");

    let planIconUrl = existingPlan.planIcon;

    if (req.file) {
      let s3details = await gets3details();
      if (!s3details.status) throw new Error(s3details.errorMessage);

      const s3 = new AWS.S3(s3details.data);

      const upload = await s3.upload({
        Bucket: s3details.data.bucketname,
        Key: `planIcons/${Date.now()}.png`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      }).promise();

      planIconUrl = upload.Location;
    }

    await Plans.update({
      ...req.body,
      planIcon: planIconUrl
    }, {
      where: { planCode }
    });

    const updated = await Plans.findOne({ where: { planCode } });

    return statusHelper.successResponse(res, "Plan updated", updated);

  } catch (error) {
    console.error(error);
    return statusHelper.ErrorResponse(res, "Update failed");
  }
};


// ==============================
// ✅ DELETE PLAN
// ==============================
const deletePlan = async (req, res) => {
  try {
    const { planCode } = req.query;

    const updated = await Plans.update(
      { planStatus: "DEACTIVE" },
      { where: { planCode } }
    );

    return statusHelper.successResponse(res, "Plan deleted", updated);

  } catch (error) {
    console.error(error);
    return statusHelper.ErrorResponse(res, "Delete failed");
  }
};


// ==============================
// ✅ GET PLANS
// ==============================
const getPlans = async (req, res) => {
  try {
    const { planCode } = req.query;

    const where = { planStatus: "ACTIVE" };
    if (planCode) where.planCode = planCode;

    const plans = await Plans.findAll({ where });

    return statusHelper.successResponse(res, "Plans fetched", plans);

  } catch (error) {
    console.error(error);
    return statusHelper.ErrorResponse(res, "Fetch failed");
  }
};


module.exports = {
  createPlan,
  updatePlan,
  deletePlan,
  getPlans
};