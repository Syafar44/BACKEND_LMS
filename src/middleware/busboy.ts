import busboy from "busboy";
import { Request, Response } from "express";

export const handleUploadStream = (req: Request, res: Response, next: Function) => {
  const bb = busboy({ headers: req.headers });
  let fileBuffer: Buffer[] = [];
  let fileName = "";

  bb.on("file", (_, file, info) => {
    fileName = info.filename;

    file.on("data", (data) => {
      fileBuffer.push(data);
    });

    file.on("end", () => {
      (req as any).file = {
        buffer: Buffer.concat(fileBuffer),
        originalname: fileName,
      };
    });
  });

  bb.on("finish", () => {
    next();
  });

  req.pipe(bb);
};
