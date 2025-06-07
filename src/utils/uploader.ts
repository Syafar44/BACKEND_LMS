import { google } from "googleapis";
import stream from "stream";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountJson = Buffer.from(
  process.env.GOOGLE_SERVICE_ACCOUNT_BASE64!,
  "base64"
).toString("utf8");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(serviceAccountJson),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const driveService = google.drive({ version: "v3", auth });

const uploadBufferToDrive = async (
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  },
  folderId = "1KyHzvvFvbqIu1_P1RUJwBHTkXrokuro4",
  makePublic = true
) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);

  const fileMetadata: any = {
    name: file.originalname,
    ...(folderId ? { parents: [folderId] } : {}),
  };

  const media = {
    mimeType: file.mimetype,
    body: bufferStream,
  };

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, mimeType",
  });

  const fileId = response.data.id;
  const mimeType = response.data.mimeType;

  if (makePublic && fileId) {
    await driveService.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  }

  let url = "";
  if (mimeType?.startsWith("image/")) {
    url = `https://drive.google.com/uc?export=view&id=${fileId}`;
  } else if (mimeType?.startsWith("video/")) {
    url = `https://drive.google.com/file/d/${fileId}/preview`;
  } else {
    url = `https://drive.google.com/file/d/${fileId}/view`;
  }

  return {
    id: fileId,
    url,
  };
};

const removeFileFromDrive = async (fileId: string) => {
  const result = await driveService.files.delete({ fileId });
  return result.data;
};

export default {
  async uploadSingle(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }) {
    return await uploadBufferToDrive(file);
  },

  async uploadMultiple(files: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }[]) {
    const uploads = files.map((file) => uploadBufferToDrive(file));
    return await Promise.all(uploads);
  },

  async remove(fileUrl: string) {
    const match = fileUrl.match(/[-\w]{25,}/);
    const fileId = match ? match[0] : null;
    if (!fileId) throw new Error("Invalid file URL");
    return await removeFileFromDrive(fileId);
  },
};
