"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const user_schema_1 = require("./user.schema");
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.validateRequest)(user_schema_1.loginSchema), user_controller_1.loginUser)
    .post("/register", (0, validateRequest_1.validateRequest)(user_schema_1.loginSchema), user_controller_1.registerUser);
exports.default = router;
