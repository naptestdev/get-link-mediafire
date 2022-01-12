import { getFileDownloadUrl } from "./file";

export const getFolderFiles = async (folderId) => {
  const formData = new FormData();

  formData.append("folder_key", folderId);
  formData.append("content_type", "files");
  formData.append("response_format", "json");

  const data = await (
    await fetch("https://www.mediafire.com/api/1.5/folder/get_content.php", {
      method: "POST",
      body: formData,
    })
  ).json();

  const urls = data.response.folder_content.files.map(
    (file) => file.links.normal_download
  );

  const sources = await Promise.all(urls.map((url) => getFileDownloadUrl(url)));

  return sources;
};
