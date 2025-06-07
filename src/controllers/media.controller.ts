import { Response } from "express" 

import { IReqUser } from "../utils/interfaces"

import uploader from "../utils/uploader"
import response from "../utils/response"

export default {
    async single(req: IReqUser, res: Response) {
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({
          data: null,
          message: "file not exist",
        });
      }

      try {
        if (!req.file) {
          return response.error(res, null, "File not found");
        }
        const result = await uploader.uploadSingle({
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
        });

        response.success(res, result, "Success upload a file");
      } catch {
        response.error(res, null, "Failed upload a file");
      }
    },
    async multiple(req: IReqUser, res: Response) {
        if (!req.files || req.files.length === 0) {
          return response.error(res, null, "files not found");
        }
    
        try {
          const result = await uploader.uploadMultiple(
            req.files as Express.Multer.File[]
          );
    
          response.success(res, result, "Success upload files");
        } catch {
          response.error(res, null, "Failed upload files");
        }
      },
    async remove(req: IReqUser, res: Response) {
        try {
            const { fileUrl } = req.body as { fileUrl: string}
            const result = await uploader.remove(fileUrl)
            response.success(res, result, "Success remove file")
        } catch {
            response.error(res, null, "Failed remove file")
        }
    },
}