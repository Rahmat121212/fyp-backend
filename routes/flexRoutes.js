const express = require("express");
const router = express.Router();
const FlexController = require("../controllers/Flex");

// Create a Flex entry
router.post("/flex", FlexController.create);

// Read all Flex entries
router.get("/flex/:page", FlexController.flexs);

// Read a specific Flex entry by ID
router.get("/flex/:id", FlexController.fetchFlex);

// Update a specific Flex entry by ID
router.put("/flex/:id", FlexController.updateFlex);

// Delete a specific Flex entry by ID
router.delete("/flex/:id", FlexController.deleteFlex);

// Get all Flex categories
router.get("/flexs", FlexController.allFlexs);

// Get random Flex categories
router.get("/flexs/random", FlexController.randomFlexs);

module.exports = router;
