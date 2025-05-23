const express = require("express");
const app = express();
const verifyRoutes = require("./verifyRoutes");

app.use("/api", verifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
