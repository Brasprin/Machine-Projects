const { Company } = require("../payrollSchema.js");

const sampleAccounts = [];

async function createSampleAccounts() {
    sampleAccounts.length = 0; 
    try {
        const dlsuCompanyID = await getCompanyID("DLSU");
        const openAICompanyID = await getCompanyID("OpenAI");

        sampleAccounts.push(
            {
                username: "DLSU admin",
                passwordHash: "123",
                role: "Administrator",
                company: dlsuCompanyID,
                isDeleted: false
            },
            {
                username: "OpenAI admin",
                passwordHash: "123",
                role: "Administrator",
                company: openAICompanyID,
                isDeleted: false
            }
        );
    } catch (error) {
        console.error("Error creating sample accounts:", error);
    }
}

async function getCompanyID(company) {
    try {
        const cID = await Company.findOne({ name: company });
        return cID ? cID._id : null;
    } catch (error) {
        console.error("Error finding company:", error);
        return null;
    }
}

async function initializeAccount() {
    await createSampleAccounts();
    return sampleAccounts;
}

module.exports = { initializeAccount, getCompanyID };
