import { PROXY_URL } from "../shared/constant";

export const getFileDownloadUrl = async (link) => {
  const source = await (await fetch(`${PROXY_URL}${link}`)).text();

  const parser = new DOMParser();

  const dom = parser.parseFromString(source, "text/html");

  const button = dom.querySelector("#downloadButton");

  const href = button.getAttribute("href");

  return href;
};
