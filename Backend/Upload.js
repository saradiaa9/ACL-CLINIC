// UPLOADING
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the path to the specific user's folder
    const Folder = path.join(__dirname, "../frontend/uploads");

    // Create the folder if it doesn't exist
    fs.mkdirSync(Folder, { recursive: true });
    console.log("Folder: ", Folder);

    cb(null, Folder);
  },
  filename: function (req, file, cb) {
    // Assuming req.query.username contains the patient's username
    const UsernameOrMedicineName = req.query.UsernameOrMedicineName;
    // Check file mimetype
    if (
      file.mimetype !== "application/pdf" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg"
    ) {
      return cb(new Error("Only pdfs or jpeg or jpg or png are allowed"));
    }

    // Set the base filename
    let baseFilename = `${UsernameOrMedicineName}-${file.originalname}`;

    // Function to check for duplicate filenames
    const checkAndAppendNumber = (filename, number) => {
      const finalFilename = number > 0 ? `${filename}(${number})` : filename;
      const Folder = path.join(__dirname, "../../frontend/uploads");
      if (fs.existsSync(path.join(Folder, `${finalFilename}`))) {
        return checkAndAppendNumber(baseFilename, number + 1);
      }
      return finalFilename;
    };

    // Set the final filename
    const finalFilename = checkAndAppendNumber(baseFilename, 0);

    // Use the final filename
    cb(null, `${finalFilename}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
