
const {
    getLanguageById,
    SubmitBatch,
    SubmitToken
} = require("../utils/problemUtility");


const runCode = async (req, res) => {

    try {

        const {
                code,
                language,
                input
                } = req.body;

        // VALIDATION
        if (!code || !language) {

            return res.status(400).send("Some fields are missing");

        }

        // GET LANGUAGE ID
        const languageId = getLanguageById(language);

        if (!languageId) {

            return res.status(400).send("Invalid language");

        }

       const submission = [
        {
            source_code: code,
            language_id: languageId,
            stdin: input || ""
        }
       ];

        const submitResult = await SubmitBatch(submission);
        
        const tokens = submitResult.map((value) => {
            return value.token;
        });

        const finalResult = await SubmitToken(tokens);
        return res.status(200).json(finalResult);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Server error. Please try again later.");
    }
};


module.exports = { runCode };