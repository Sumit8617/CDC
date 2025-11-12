import { APIERR,APIRES, asynchandler } from "../../Utils/index.utils.js"

export const createTest = asynchandler(async (req, res) => {
    const { testName, desctiption, duration, questions } = req.body;
    console.log(testName, questions);
    if ([testName, desctiption, duration, questions].some((f) => f.trim() === "")) {
        throw new APIERR(400, "all fields are required");
    }
    const newTest = await Test.create({
        testName,
        desctiption,
        duration,
        questions,
    });
    return res.APIRES(201, "Test Created Successfully") ;
})  ;
