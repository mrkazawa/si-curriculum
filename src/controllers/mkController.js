const MkModel = require("../models/mkModel");

// Helper function to convert number to Roman numeral
const toRoman = (num) => {
  const romanNumerals = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
  };
  return romanNumerals[num] || num.toString();
};

// Helper function to render form with error
const renderFormWithError = (res, view, errorMessage, formData = {}) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
  });
};

// Render the form for adding a new MK
exports.renderForm = (req, res) => {
  res.render("mk/create");
};

// Render the table with all Mata Kuliah
exports.renderTable = (req, res) => {
  MkModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching MK records:", err);
      return res.status(500).send("Error fetching MK records");
    }

    // Convert semester numbers to Roman numerals for display
    const mataKuliah = results.map((mk) => ({
      ...mk,
      semester_roman: toRoman(mk.semester),
    }));

    res.render("mk/index", { mataKuliah });
  });
};

// Create a new Mata Kuliah
exports.createMK = (req, res) => {
  const { kode_mk, nama_mk, kompetensi, sks, semester } = req.body;

  // Validate input
  if (!kode_mk || !nama_mk || !kompetensi || !sks || !semester) {
    return renderFormWithError(res, "mk/create", "All fields are required", {
      kode_mk,
      nama_mk,
      kompetensi,
      sks,
      semester,
    });
  }

  // Validate semester is between 1 and 8
  const semesterNum = parseInt(semester);
  if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
    return renderFormWithError(
      res,
      "mk/create",
      "Semester must be a number between 1 and 8",
      { kode_mk, nama_mk, kompetensi, sks, semester }
    );
  }

  // Validate SKS is a positive number
  const sksNum = parseInt(sks);
  if (isNaN(sksNum) || sksNum <= 0) {
    return renderFormWithError(
      res,
      "mk/create",
      "SKS must be a positive number",
      { kode_mk, nama_mk, kompetensi, sks, semester }
    );
  }

  MkModel.create(
    {
      kode_mk,
      nama_mk,
      kompetensi,
      sks: sksNum,
      semester: semesterNum,
    },
    (err, result) => {
      if (err) {
        console.error("Error creating MK:", err);
        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "mk/create",
            "Kode MK already exists. Please use a unique code.",
            { kode_mk, nama_mk, kompetensi, sks, semester }
          );
        }
        return res.status(500).send("Error creating MK");
      }
      res.redirect("/mk");
    }
  );
};

// Delete a Mata Kuliah
exports.deleteMK = (req, res) => {
  const id = req.params.id;

  MkModel.delete(id, (err) => {
    if (err) {
      console.error("Error deleting MK:", err);
      return res.status(500).send("Error deleting MK");
    }
    res.redirect("/mk");
  });
};

// Render form for editing a Mata Kuliah
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  MkModel.getById(id, (err, results) => {
    if (err) {
      console.error("Error fetching MK for edit:", err);
      return res.status(500).send("Error fetching MK");
    }

    if (results.length === 0) {
      return res.status(404).send("MK not found");
    }

    res.render("mk/edit", { mk: results[0] });
  });
};

// Update a Mata Kuliah
exports.updateMK = (req, res) => {
  const id = req.params.id;
  const { kode_mk, nama_mk, kompetensi, sks, semester } = req.body;

  // Validate input
  if (!kode_mk || !nama_mk || !kompetensi || !sks || !semester) {
    return renderFormWithError(res, "mk/edit", "All fields are required", {
      id,
      kode_mk,
      nama_mk,
      kompetensi,
      sks,
      semester,
    });
  }

  // Validate semester is between 1 and 8
  const semesterNum = parseInt(semester);
  if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
    return renderFormWithError(
      res,
      "mk/edit",
      "Semester must be a number between 1 and 8",
      { id, kode_mk, nama_mk, kompetensi, sks, semester }
    );
  }

  // Validate SKS is a positive number
  const sksNum = parseInt(sks);
  if (isNaN(sksNum) || sksNum <= 0) {
    return renderFormWithError(
      res,
      "mk/edit",
      "SKS must be a positive number",
      { id, kode_mk, nama_mk, kompetensi, sks, semester }
    );
  }

  MkModel.update(
    id,
    {
      kode_mk,
      nama_mk,
      kompetensi,
      sks: sksNum,
      semester: semesterNum,
    },
    (err) => {
      if (err) {
        console.error("Error updating MK:", err);
        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "mk/edit",
            "Kode MK already exists. Please use a unique code.",
            { id, kode_mk, nama_mk, kompetensi, sks, semester }
          );
        }
        return res.status(500).send("Error updating MK");
      }
      res.redirect("/mk");
    }
  );
};
