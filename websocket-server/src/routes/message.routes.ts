import express, { Request, Response, Router } from "express";
import { sendMessage } from "../controllers/message.controller";

const router: Router = express.Router();

router.post("/send/:chatId", (req: Request, res: Response) => {
    sendMessage(req, res)
});

export default router;
