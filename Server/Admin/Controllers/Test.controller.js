import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";

const createTest = asynchandler(async (req, res) => {
    if(true) throw new APIERR(400, "Something went wrong")

        if(true) res.status(200).json(new APIRES(200, "Successfully done"))
});

export { createTest };
