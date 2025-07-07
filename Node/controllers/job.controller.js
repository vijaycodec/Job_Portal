import Job from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            company
        } = req.body;

        const userId = req.id; // from authMiddleware

        // Check for missing fields
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !company) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Create job post
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(item => item.trim()),
            salary: Number(salary),
            experienceLevel: experience,
            location,
            jobType,
            position,
            company,
            created_by: userId
        });

        return res.status(201).json({
            message: "Job posted successfully",
            job,
            success: true
        });

    } catch (error) {
        console.error("Post Job Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};


export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";  // default to empty string if undefined
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };
        const job = await Job.find(query).populate({
            path: "company"
        }).sort({ created_at: -1 });

        if (job.length === 0) {
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const Id = req.params.id;  // default to empty string if undefined

        const job = await Job.findById(Id);

        if (!job) {
            return res.status(404).json({
                message: "No Job found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

export const getJobByAdmin = async (req, res) => {
    try {
        const adminId = req.id; // from authMiddleware

        const jobs = await Job.find({ created_by: adminId });

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for this admin.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Error fetching jobs by admin:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};
