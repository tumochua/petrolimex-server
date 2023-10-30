import homeServices from "../services/homeServices";

let getHomePage = (req, res) => {
  return res.render("test/about.ejs");
};

const handleGetlistUsers = async (req, res) => {
  try {
    console.log("userId", req.userId);
    const listUser = await homeServices.handleGetlistUsers();
    return res.status(200).json(listUser);
  } catch (error) {
    // res.status(200).json(error);
    console.log("check eror to list user", error);
  }
};

const handleTest = (req, res) => {
  console.log("nguten avn tu");
  res.send("tumochua");
};

module.exports = {
  getHomePage,
  handleGetlistUsers,
  handleTest,
};
