const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/listing");
const Review = require("./models/review");


module.exports.isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id).populate("owner");
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You don't have the permission to edit this listing.");
        return res.redirect("/listings/"+id);
    }
    next();
})

module.exports.isReviewAuthor=wrapAsync(async(req,res,next)=>{
    let {id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","You don't have the permission to delete this review.");
        return res.redirect("/listings/"+id);
    }
    next();
})
