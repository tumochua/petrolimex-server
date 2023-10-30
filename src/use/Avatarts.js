export const ConvertBuffer = async (buffer) => {
  if (buffer) {
    const base64 = await Buffer.from(buffer, "base64").toString("binary");
    return base64;
  }
};
