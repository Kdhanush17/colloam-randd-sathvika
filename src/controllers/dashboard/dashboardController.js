const { JobSeekerAccount, Job, DatabaseMapping, roles, JobApplications, CompanyProfile, Recruiter } = require('../../models');
const logger = require('../../../utils/winston');
const { Op } = require('sequelize');


const getDashboardCounts = async (req, res) => {
  try {

    const userDetails = req.userDetails;
    const jobseekerToken = req.Jobseeker;

    // ==============================
    // ✅ 1. JOBSEEKER DASHBOARD
    // ==============================
    if (jobseekerToken) {

      const userId = jobseekerToken.JobseekerId;

      const jobseeker = await JobSeekerAccount.findByPk(userId);

      if (!jobseeker) {
        return res.status(404).json({ message: "Jobseeker not found" });
      }

      const appliedJobs = jobseeker.appliedJobsList || [];
      const favoriteJobs = jobseeker.favoriteJobs || [];

      return res.json({
        appliedJobs: appliedJobs.length,
        shortlistedCount: appliedJobs.filter(j => j?.applicationStatus?.Shortlisted?.status).length,
        rejectedApplications: appliedJobs.filter(j => j?.applicationStatus?.Rejected?.status).length,
        profileViews: appliedJobs.filter(j => j?.applicationStatus?.InReview?.status).length,
        favoriteJobs: favoriteJobs.length,
        totalApplications: appliedJobs.length
      });
    }


    // ==============================
    // ✅ AUTH VALIDATION
    // ==============================
    if (!userDetails) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = userDetails.role;
    const userId = userDetails.id;
    const tenant_id = userDetails.tenant_id; // 🔥 IMPORTANT


    // ==============================
    // ✅ SUPER ADMIN
    // ==============================
    if (userRole === "SUPER_ADMIN") {

      const totalJobs = await Job.count();
      const activeJobsCount = await Job.count({
        where: { jobStatus: "ACTIVE", approvalStatus: "approved" }
      });

      const approvedJobsCount = activeJobsCount;

      const rejectedJobsCount = await Job.count({
        where: { approvalStatus: "rejected" }
      });

      const totalApplications = await JobApplications.count();
      const jobseekerCount = await JobSeekerAccount.count();
      const totalCompanies = await CompanyProfile.count();

      const recruiterCount = await Recruiter.count({
        where: { status: true, approved: true }
      });

      return res.json({
        totalJobs,
        activeJobsCount,
        approvedJobsCount,
        rejectedJobsCount,
        totalApplications,
        jobseekerCount,
        totalCompanies,
        recruiterCount
      });
    }


    // ==============================
    // ✅ ADMIN DASHBOARD
    // ==============================
    if (userRole === "ADMIN") {

      const jobs = await Job.findAll({
        where: { tenant_id }
      });

      const jobCodes = jobs.map(j => j.jobCode);

      const jobsPostedCount = jobs.length;

      const approvedJobsCount = jobs.filter(j => j.approvalStatus === "approved").length;
      const rejectedJobsCount = jobs.filter(j => j.approvalStatus === "rejected").length;

      const totalApplications = await JobApplications.count({
        where: { jobCode: { [Op.in]: jobCodes } }
      });

      const inReviewCount = await JobApplications.count({
        where: {
          jobCode: { [Op.in]: jobCodes },
          applicationStatus: "In Review"
        }
      });

      const interviewCount = await JobApplications.count({
        where: {
          jobCode: { [Op.in]: jobCodes },
          applicationStatus: "Interview"
        }
      });

      const shortlistedCount = await JobApplications.count({
        where: {
          jobCode: { [Op.in]: jobCodes },
          applicationStatus: "Shortlisted"
        }
      });

      const rejectedCount = await JobApplications.count({
        where: {
          jobCode: { [Op.in]: jobCodes },
          applicationStatus: "Rejected"
        }
      });

      const activeRecruitersCount = await Recruiter.count({
        where: { tenant_id, status: true }
      });

      return res.json({
        jobsPostedCount,
        approvedJobsCount,
        rejectedJobsCount,
        totalApplications,
        applicationStatus: {
          inReview: inReviewCount,
          interview: interviewCount,
          shortlisted: shortlistedCount,
          rejected: rejectedCount
        },
        activeRecruitersCount
      });
    }


    // ==============================
    // ✅ RECRUITER DASHBOARD
    // ==============================
    if (userRole === "RECRUITER") {

      const recruiterEmail = userDetails.email;

      const recruiterJobs = await Job.findAll({
        where: { recruiterEmail }
      });

      const jobCodes = recruiterJobs.map(j => j.jobCode);

      const activeJobPostsCount = recruiterJobs.filter(
        j => j.jobStatus === "ACTIVE" && j.approvalStatus === "approved"
      ).length;

      const pendingJobCount = recruiterJobs.filter(
        j => j.approvalStatus === "pending"
      ).length;

      const totalApplications = await JobApplications.count({
        where: { jobCode: { [Op.in]: jobCodes } }
      });

      return res.json({
        activeJobPostsCount,
        pendingJobCount,
        totalApplications
      });
    }


    return res.status(403).json({ message: `Access denied for role: ${userRole}` });

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in dashboard");
  }
};

module.exports = { getDashboardCounts };