const express = require("express");
const multer = require("multer");
const docxToPdf = require("docx-pdf");
const cors = require("cors");

const path = require("path");
const app = express();
const port = 3000;
app.use(cors());

// Setting up the file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    //     Defining output file path
    let outputPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`
    );
    docxToPdf(req.file.path, outputPath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error convertin docx to pdf",
        });
      }
      res.download(outputPath, () => {
        console.log("File downloaded");
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
