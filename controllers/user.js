const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User")

router.post("/users", async (req, res) => {
const { name, username } = req.body;
let { password } = req.body;

if(password.length < 3)
{ throw Error("Password must have at least 3 letters")}
else {

    const password = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({name, username, password})
    await user.save()
    res.status(200).json(user)
}

})

router.get("/users", async (req, res) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1} );
   
    res.status(200).json(users);


})

router.delete("/users", async (req, res) => {
    await User.deleteMany({});
    res.status(200).end()
})

module.exports = router