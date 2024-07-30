const express = require("express");
const router = express.Router();
const Form = require("../models/Forms");
const { isUserLoggedIn } = require("../middleware/Users");

// Endpoint to save a form
router.post("/forms", isUserLoggedIn, async (req, res) => {
  try {
    console.log("Saving the form to the db");
    const { name, elements } = req.body;
    const userId = req.user._id;

    const newForm = new Form({
      name,
      elements,
      userId,
    });

    await newForm.save();
    console.log("New form saved to the db", name,
      elements,
      userId);

    res.json({
      status: "SUCCESS",
      message: "Form saved successfully",
      form: newForm,
    });
  } catch (error) {
    console.error("Error saving form:", error);
    res
      .status(500)
      .json({ status: "FAILED", message: "Internal server error" });
  }
});

// Endpoint to get all forms for a user
router.get("/forms", isUserLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const forms = await Form.find({ userId });

    res.json({ status: "SUCCESS", forms });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res
      .status(500)
      .json({ status: "FAILED", message: "Internal server error" });
  }
});

router.get("/forms/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    console.log("Finding the id in the db")
    const form = await Form.findById(formId);
    console.log("Found the illustrate id")

    if (!form) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Form not found" });
    }

    res.json({ status: "SUCCESS", form });
  } catch (error) {
    console.error("Error fetching form:", error);
    res
      .status(500)
      .json({ status: "FAILED", message: "Internal server error" });
  }
});

// Endpoint to update a specific form by its ID
router.put("/forms/:formId", isUserLoggedIn, async (req, res) => {
  try {
    const { formId } = req.params;
    const { name, elements } = req.body;
    const userId = req.user._id;
    console.log("finding the id to do put operation");
    const form = await Form.findById(formId);
    console.log("found the id",form);

    if (!form) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Form not found" });
    }

    if (form.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ status: "FAILED", message: "Unauthorized access" });
    }

    form.name = name;
    form.elements = elements;

    await form.save();
    console.log("Form updated successfully",name,elements)

    res.json({ status: "SUCCESS", message: "Form updated successfully", form });
  } catch (error) {
    console.error("Error updating form:", error);
    res
      .status(500)
      .json({ status: "FAILED", message: "Internal server error" });
  }
});

// Endpoint to increment views
router.post("/forms/:formId/increment-view", async (req, res) => {
  try {
    console.log("IncrementView endpont hit")
    const { formId } = req.params;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ status: "FAILED", message: "Form not found" });
    }

    console.log("Increasing the view by 1")
    form.views += 1;
    await form.save();

    console.log("View incremented successfully, Current View is:",form.views)
    res.json({ status: "SUCCESS", message: "View incremented successfully" });
  } catch (error) {
    console.error("Error incrementing view:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
});

// Endpoint to increment starts
router.post("/forms/:formId/increment-start", async (req, res) => {
  try {
    console.log("User started interacting")
    const { formId } = req.params;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ status: "FAILED", message: "Form not found" });
    }

    console.log("Incrementing the Start")
    form.starts += 1;
    await form.save();

    console.log("Incremented the start, Current start is:",form.starts)
    res.json({ status: "SUCCESS", message: "Start incremented successfully" });
  } catch (error) {
    console.error("Error incrementing start:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
});

// Endpoint to increment completions and save interactions

/* 
router.post("/forms/:formId/complete", async (req, res) => {
  try {
    console.log("Form is completed");
    const { formId } = req.params;
    const { interactions } = req.body;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ status: "FAILED", message: "Form not found" });
    }

    console.log("Incrementing the completion count");
    form.completions += 1;
    form.interactions.push(...interactions);

    // Mark the form as completed
    form.completed = true;
    await form.save();

    console.log("Increment the completion count, current count:", form.completions);

    res.json({ status: "SUCCESS", message: "Completion incremented and interactions saved successfully" });
  } catch (error) {
    console.error("Error incrementing completion or saving interactions:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
}); */




// Route to save each interaction
router.post("/forms/:formId/interactions", async (req, res) => {
  try {
    console.log("Called the interaction api")
    const { formId } = req.params;
    const { interaction } = req.body; // { submittedAt, element, input }
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ status: "FAILED", message: "Form not found" });
    }

    form.interactions.push(interaction);
    await form.save();
    console.log("Saving each interaction",interaction)

    res.json({ status: "SUCCESS", message: "Interaction saved successfully" });
  } catch (error) {
    console.error("Error saving interaction:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
});

// Route to mark the form as complete
router.post("/forms/:formId/complete", async (req, res) => {
  try {
    console.log("Form is completed");
    const { formId } = req.params;
    const { interactions } = req.body; // Final interactions, if any
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ status: "FAILED", message: "Form not found" });
    }

    // Add final interactions, if any
    form.interactions.push(...interactions);
    form.completions += 1;
    form.completed = true; // Mark the form as completed

    await form.save();

    console.log("Increment the completion count, current count:", form.completions);
    res.json({ status: "SUCCESS", message: "Form marked as complete and interactions saved successfully" });
  } catch (error) {
    console.error("Error marking form as completed or saving interactions:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
});






// Endpoint to fetch responses for a specific form
router.get("/forms/:formId/responses", isUserLoggedIn, async (req, res) => {
  try {
    console.log("Response is hit")
    const { formId } = req.params;
    console.log('Form ID:', formId);
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ status: "FAILED", message: "Form not found" });
    }
    console.log("Hitted form is:",form)

    const responseData = {
      views: form.views,
      starts: form.starts,
      completions: form.completions,
      completionRate: form.starts ? ((form.completions / form.starts) * 100).toFixed(2) : 0,
      interactions: form.interactions.map(interaction => ({
        submittedAt: interaction.submittedAt,
        element: interaction.element,
        input: interaction.input,
      })),
      columns: form.elements.map((element, index) => `element${index + 1}`),
    };

    res.json({ status: "SUCCESS", ...responseData });
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
});


module.exports = router;
