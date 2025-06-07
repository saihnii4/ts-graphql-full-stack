import { Router } from "express";

const router = Router();

router.get("/", (_req, res, _next) => {
  res.json({ msg: "Hello World!" });
});

export default router;
