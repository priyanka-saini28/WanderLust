const mongoose = require("mongoose");
const Review=require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({   //listing schema mtlb h schema bna rahe h 
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
  filename: String,
  url: String,
},

  price:  Number,
  location: String,
  country: String, 
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  



});

//delete middleware for ki agr listing delete ho toh usse related reviews bhi db se delete ho jaye 
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing)
  {
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);//listingSchema ko Listing ke andr le liya now Listing is our model
//db mei table banegi listings naam se (automatically model ke naam ko mongo lowercase mei plural form mei kr ke collection ka naam rakh deta h)

module.exports = Listing;
