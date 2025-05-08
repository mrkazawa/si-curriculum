// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\controllers\mk\daftar-mk-controller.js
const MkModel = require("../../models/mk-model");

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
  // Default semester value for new MK
  const semesterDefault = 1;

  // Get prerequisite options (semester < default semester)
  MkModel.getAllBySemesterBelow(semesterDefault, (err, prerequisites) => {
    if (err) {
      console.error("Error fetching prerequisites:", err);
      return res.status(500).send("Error fetching prerequisites");
    }

    res.render("mk/daftar/create", {
      prerequisites: prerequisites,
      selectedPrereq: [],
      selectedSemester: semesterDefault,
    });
  });
};

// Handle semester change for prerequisites
exports.getPrerequisites = (req, res) => {
  const semester = parseInt(req.params.semester);

  if (isNaN(semester) || semester < 1 || semester > 8) {
    return res.status(400).json({ error: "Invalid semester" });
  }

  MkModel.getAllBySemesterBelow(semester, (err, prerequisites) => {
    if (err) {
      console.error("Error fetching prerequisites:", err);
      return res.status(500).json({ error: "Error fetching prerequisites" });
    }

    res.json({ prerequisites });
  });
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

    res.render("mk/daftar/index", { mataKuliah });
  });
};

// Create a new Mata Kuliah
exports.createMK = (req, res) => {
  const { kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester } = req.body;

  // Handle multiple prerequisites
  let prasyarat = null;
  if (Array.isArray(req.body.prasyarat) && req.body.prasyarat.length > 0) {
    prasyarat = req.body.prasyarat.join(",");
  } else if (req.body.prasyarat && req.body.prasyarat.trim() !== "") {
    prasyarat = req.body.prasyarat;
  }

  // Validate input
  if (!kode_mk || !nama_mk || !kompetensi || !jenis_mk || !sks || !semester) {
    return renderFormWithError(
      res,
      "mk/daftar/create",
      "All fields except prerequisites are required",
      {
        kode_mk,
        nama_mk,
        kompetensi,
        jenis_mk,
        sks,
        semester,
        prasyarat,
      }
    );
  }

  // Validate semester is between 1 and 8
  const semesterNum = parseInt(semester);
  if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
    return renderFormWithError(
      res,
      "mk/daftar/create",
      "Semester must be a number between 1 and 8",
      { kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester, prasyarat }
    );
  }

  // Validate SKS is a positive number
  const sksNum = parseInt(sks);
  if (isNaN(sksNum) || sksNum <= 0) {
    return renderFormWithError(
      res,
      "mk/daftar/create",
      "SKS must be a positive number",
      { kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester, prasyarat }
    );
  }

  MkModel.create(
    {
      kode_mk,
      nama_mk,
      kompetensi,
      jenis_mk,
      sks: sksNum,
      semester: semesterNum,
      prasyarat,
    },
    (err, result) => {
      if (err) {
        console.error("Error creating MK:", err);
        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "mk/daftar/create",
            "Kode MK already exists. Please use a unique code.",
            { kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester, prasyarat }
          );
        }
        return res.status(500).send("Error creating MK: " + err.message);
      }
      res.redirect("/mk/daftar");
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
    res.redirect("/mk/daftar");
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

    const mk = results[0];
    const selectedSemester = mk.semester;
    const selectedPrereq = mk.prasyarat ? mk.prasyarat.split(",") : [];

    // Get prerequisite options
    MkModel.getAllBySemesterBelow(selectedSemester, (err, prerequisites) => {
      if (err) {
        console.error("Error fetching prerequisites:", err);
        return res.status(500).send("Error fetching prerequisites");
      }

      res.render("mk/daftar/edit", {
        mk: mk,
        prerequisites: prerequisites,
        selectedPrereq: selectedPrereq,
        selectedSemester: selectedSemester,
      });
    });
  });
};

// Update a Mata Kuliah
exports.updateMK = (req, res) => {
  const id = req.params.id;
  const { kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester } = req.body;

  // Handle multiple prerequisites
  let prasyarat = null;
  if (Array.isArray(req.body.prasyarat) && req.body.prasyarat.length > 0) {
    prasyarat = req.body.prasyarat.join(",");
  } else if (req.body.prasyarat && req.body.prasyarat.trim() !== "") {
    prasyarat = req.body.prasyarat;
  }

  // Validate input
  if (!kode_mk || !nama_mk || !kompetensi || !jenis_mk || !sks || !semester) {
    return renderFormWithError(
      res,
      "mk/daftar/edit",
      "All fields except prerequisites are required",
      {
        id,
        kode_mk,
        nama_mk,
        kompetensi,
        jenis_mk,
        sks,
        semester,
        prasyarat,
      }
    );
  }

  // Validate semester is between 1 and 8
  const semesterNum = parseInt(semester);
  if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
    return renderFormWithError(
      res,
      "mk/daftar/edit",
      "Semester must be a number between 1 and 8",
      { id, kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester, prasyarat }
    );
  }

  // Validate SKS is a positive number
  const sksNum = parseInt(sks);
  if (isNaN(sksNum) || sksNum <= 0) {
    return renderFormWithError(
      res,
      "mk/daftar/edit",
      "SKS must be a positive number",
      { id, kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester, prasyarat }
    );
  }

  MkModel.update(
    id,
    {
      kode_mk,
      nama_mk,
      kompetensi,
      jenis_mk,
      sks: sksNum,
      semester: semesterNum,
      prasyarat,
    },
    (err) => {
      if (err) {
        console.error("Error updating MK:", err);
        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "mk/daftar/edit",
            "Kode MK already exists. Please use a unique code.",
            {
              id,
              kode_mk,
              nama_mk,
              kompetensi,
              jenis_mk,
              sks,
              semester,
              prasyarat,
            }
          );
        }
        return res.status(500).send("Error updating MK: " + err.message);
      }
      res.redirect("/mk/daftar");
    }
  );
};

// Render the visualization page
exports.renderVisualization = (req, res) => {
  MkModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching MK records:", err);
      return res.status(500).send("Error fetching MK records");
    }

    // Group MKs by semester
    const semesterData = {};
    let totalSystemSKS = 0;

    // Initialize semester data structure
    for (let i = 1; i <= 8; i++) {
      semesterData[i] = {
        totalSKS: 0,
        mkWajib: [],
        mkPilihan: [],
        mkwk: [],
      };
    }

    // Organize MKs by semester and type
    results.forEach((mk) => {
      const semester = mk.semester;

      // Add to appropriate category
      if (mk.jenis_mk === "MK Wajib") {
        semesterData[semester].mkWajib.push(mk);
      } else if (mk.jenis_mk === "MK Pilihan") {
        semesterData[semester].mkPilihan.push(mk);
      } else if (mk.jenis_mk === "MKWK") {
        semesterData[semester].mkwk.push(mk);
      }

      // Add SKS to semester total
      semesterData[semester].totalSKS += mk.sks;
      totalSystemSKS += mk.sks;
    });

    // Calculate max number of MKs in any category for table layout
    let maxMkWajib = 0;
    let maxMkPilihan = 0;
    let maxMkwk = 0;

    Object.values(semesterData).forEach((semData) => {
      maxMkWajib = Math.max(maxMkWajib, semData.mkWajib.length);
      maxMkPilihan = Math.max(maxMkPilihan, semData.mkPilihan.length);
      maxMkwk = Math.max(maxMkwk, semData.mkwk.length);
    });

    // Convert semester numbers to Roman numerals for display
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

    res.render("mk/visualization", {
      semesterData: semesterData,
      romanNumerals: romanNumerals,
      totalSystemSKS: totalSystemSKS,
      maxMkWajib: maxMkWajib,
      maxMkPilihan: maxMkPilihan,
      maxMkwk: maxMkwk,
    });
  });
};
