const { getCompanyID } = require("./sampleAccounts");
const sampleRates = [];


async function createSampleRates() {
    sampleRates.length = 0; 
    try {
        const dlsuCompanyID = await getCompanyID("DLSU");
        const openAICompanyID = await getCompanyID("OpenAI");

        sampleRates.push(
            {
                company: dlsuCompanyID,
                standardRate: 645,
                holidayRate: 800,
                weekendRate: 700
            },
            {
                company: openAICompanyID,
                standardRate: 1000,
                holidayRate: 300,
                weekendRate: 400
            }
        );
    } catch (error) {
        console.error("Error creating sample rates:", error);
    }
}

async function initializeRates() {
    await createSampleRates();
    return sampleRates;
}

module.exports = { initializeRates };

