const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner } = require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


const listingController=require("../controllers/listing.js");

//joi as a function middleware 
const validateListing=(req,res,next)=> {
  let {error}=listingSchema.validate(req.body);

  if(error)
  {
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing),
  );


  //CREATE ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  );
  
//EDIT ROUTE 
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editForm));

//DELETE ROUTE 
router.delete("/:id/delete",isLoggedIn,wrapAsync(listingController.destroyListing));

module.exports=router;