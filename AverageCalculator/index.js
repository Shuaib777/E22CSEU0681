require("dotenv").config();
const express = require("express");
const numbersRoutes = require("./routes/numbers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/numbers", numbersRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
