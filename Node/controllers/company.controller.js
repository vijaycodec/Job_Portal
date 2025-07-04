import Company from "../models/company.model.js";

export const registerCompany = async (req, res) => {
    try {
        console.log(req.id);
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company Name Is Required ",
                success: false

            });
        };

        const trimmedName = companyName.trim();
        const company = await Company.findOne({ name: trimmedName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company twice",
                success: false
            });
        }

        const Id = req.id;
        // Create new company
        const newCompany = await Company.create({
            name: trimmedName,
            UserId: req.id,
        });

        return res.status(201).json({
            message: "company registered Successfully",
            company: newCompany,
            success: true
        });

    } catch (error) {
        console.error("Register Company Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }

}

// get All companies by user logged in Id
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ UserId: userId });

        if (!companies) {
            return res.status(404).json({
                message: "No companies found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            companies
        });

    } catch (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};


// Get company by MongoDB ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            company
        });

    } catch (error) {
        console.error("Error fetching company by ID:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { name, description, website, location } = req.body;
        const companyData = { name, description, website, location };

        const company = await Company.findByIdAndUpdate(companyId, companyData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully",
            success: true,
            company
        });

    } catch (error) {
        console.error("Error updating company by ID:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

