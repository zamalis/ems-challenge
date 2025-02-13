import path from "path";
import fs from "fs";

export const uploadFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extension = path.extname(file.name);
  const timestamp = new Date().getTime().toString();
  const filename = `${timestamp}${extension}`;

  const uploadDir = "uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  return `/${filePath}`;
};
