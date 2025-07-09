Listing=require("../models/listing");
const mapKey=process.env.MAP_API_KEY;

// Import the whole library
const maptilerClient=require("@maptiler/client");

// add your API key
maptilerClient.config.apiKey = mapKey;

// module.exports.index=async(req,res)=>{
//     const allListings=await Listing.find({});
//     res.render("./listings/index.ejs",{ allListings });
// }
module.exports.index = async (req, res) => {
    const { q } = req.query;
    let filter = {};
    if (q) {
        filter = {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } }
            ]
        };
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
    res.render("./listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exsit!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{ listing });
}

module.exports.createListing=async(req,res)=>{
    let response= await maptilerClient.geocoding.forward(req.body.listing.location);

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry=response.features[0].geometry;

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Added!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exsit!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_350");
    res.render("./listings/edit.ejs",{ listing,originalImageUrl });
}

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    let response= await maptilerClient.geocoding.forward(req.body.listing.location);
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    await Listing.findByIdAndUpdate(id,{geometry:response.features[0].geometry});

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}