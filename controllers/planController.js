// const plans = require("../data/plans");
const planModel = require("../models/planModels");
module.exports.checkplan = function (req, res, next) {
    if (Object.keys(req.body).length == 0) {
        return res.json({
            data: "Please enter data in post request"
        });
    }
    next();//ye hunne uss route k agle function m janne k lie help krta h
}

module.exports.gettopplan = (req, res, next) => {
    req.query = {
        price: { gte: 40 },
        sort: "-averagerating",
        limit: 5
    }
    next();
}
module.exports.getallplans = async (req, res) => {
    try {
        //original  query
        const oquery = { ...req.query };
        //exclude special words like select sort limit page
        var exearr = ["select", "page", "sort", "limit"];
        for (var i = 0; i < exearr.length; i++) {
            delete req.query[exearr[i]];
        }
        let str = JSON.stringify(req.query);
        str = str.replace(/gt|gte|lt|lte/g, function (match) {
            return "$" + match;
        })
        const data = JSON.parse(str);
        //query build
        let plans = planModel.find(data);
        if (oquery.sort) {
            var sortstring = oquery.sort.split("%").join(" ");
            plans.sort(sortstring);
        }
        if (oquery.select) {
            var selectstring = oquery.select.split("%").join(" ");
            plans.select(selectstring);
        }
        const page = Number(oquery.page) || 1;
        const limit = Number(oquery.limit) || 2;
        const toSkip = (page - 1) * limit;
        plans = plans.skip(toSkip).limit(limit);
        var newplan = await plans;
        res.json({
            newplan

        })
    }
    catch (err) {
        console.log(err);
        res.json({
            err
        })
    }
};

module.exports.createplan = async (req, res) => {
    try {
        const plan = req.body;
        const newplan = await planModel.create(plan);
        res.json({
            newplan
        })
    }
    catch (err) {
        res.json({
            err
        })
    }
}

module.exports.updateplan = async function (req, res) {
    try {
        const id = req.params._id;
        console.log(req.files);
        const cover = req.files.cover[0].filename;
        req.body.cover = cover;
        const pictures = req.files.pictures.map((picture) => {
            return picture.filename;
        });
        req.body.pictures = pictures;
        const value = req.body;
        const newplan = await planModel.findOneAndUpdate(id, value, { new: true });
        res.json({
            newplan,
            succ: "Uploaded Plan Images"
        })
    }
    catch (err) {
        res.json({
            err
        })
    }
}

module.exports.readplan = async function (req, res) {
    try {
        const id = req.params._id;
        const plan = await planModel.findOne(id);
        res.json({
            plan
        })
    }
    catch (err) {
        res.json({
            err
        })
    }
}

module.exports.deleteplan = async function (req, res) {
    try {
        const id = req.params.id;
        const deletedplans = await planModel.findByIdAndDelete(id);
        res.json({
            deletedplans
        })
    }
    catch (err) {
        res.json({
            err
        })
    }
}
