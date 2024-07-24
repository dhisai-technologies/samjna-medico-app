import {
  deleteFile,
  getFile,
  getFiles,
  updateFile,
  updateFileSchema,
  uploadFiles,
} from "@/controllers/file.controller";
import { parsePagination, parseSorting, validateRequest } from "@/middlewares";
import type { File } from "@packages/database";
import { Router } from "express";

const router: Router = Router();

import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
});

router.get(
  "/",
  parsePagination,
  parseSorting<File>({
    validColumns: ["updatedAt", "createdAt"],
  }),
  getFiles,
);
router.post("/upload", upload.array("files", 10), uploadFiles);
router.get("/:id", getFile);
router.patch("/:id", validateRequest(updateFileSchema), updateFile);
router.delete("/:id", deleteFile);

export default router;
