const express = require("express");
const ProjectController = require("../controllers/project-controller");
const router = express.Router();

router.get("/", ProjectController.getProjects);
router.get("/:id", ProjectController.getProject);
router.post("/", ProjectController.createProject);
router.patch("/:id", ProjectController.updateProject);
router.patch("/:projectId/add-member", ProjectController.updateProjectMembers);
router.delete(":id", ProjectController.deleteProject);

module.exports = router;