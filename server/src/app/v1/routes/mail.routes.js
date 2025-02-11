import express from 'express'
import { mailController } from '../controllers/mail.controller.js';

const router = express.Router();

router.route("/mailGen").post(mailController);

export default router;