<script>
  import { FOLDER_BASE, FILE_BASE } from "./shared/constant";
  import { getFileDownloadUrl } from "./services/file";
  import { forceDownload, copyToClipboard } from "./shared/utils";
  import { getFolderFiles } from "./services/folder";

  let inputValue = "";

  let needValidate = false;

  let invalid = "";

  let loading = false;

  let urls = [];

  const validate = () => {
    if (!inputValue.trim()) return "URL is required";
    else if (
      !inputValue.startsWith(FILE_BASE) &&
      !inputValue.startsWith(FOLDER_BASE)
    )
      return "We only support mediafire.com";
    else return "";
  };

  $: inputValue !== null && needValidate && (invalid = validate());

  const handleFormSubmit = () => {
    needValidate = true;

    const isInvalid = validate();

    if (!isInvalid) {
      handleDownload();
    }
  };

  const handleDownload = async () => {
    loading = true;
    if (inputValue.startsWith(FILE_BASE)) {
      getFileDownloadUrl(inputValue)
        .then((url) => {
          forceDownload(url);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loading = false;
        });
    } else if (inputValue.startsWith(FOLDER_BASE)) {
      const folderId = inputValue.replace(`${FOLDER_BASE}/`, "").split("/")[0];
      getFolderFiles(folderId)
        .then((data) => {
          urls = data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loading = false;
        });
    }
  };

  const handleCopy = () => {
    copyToClipboard(urls.join("\n"))
      .then(() => {
        console.log("Copy successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDownloadAll = () => {
    let index = 0;

    const interval = setInterval(() => {
      forceDownload(urls[index]);

      if (!urls[++index]) clearInterval(interval);
    }, 1500);
  };
</script>

<main>
  <img src="/mediafire.png" alt="" />
  <div>
    <h2>Get Link MediaFire</h2>
    <p>Support both files and folders</p>
  </div>
  <form on:submit|preventDefault={handleFormSubmit}>
    <input
      bind:value={inputValue}
      class="form-control {invalid ? 'is-invalid' : ''}"
      type="text"
      placeholder="File / Folder Link"
    />
    <div style="text-align: center; color: red;">{invalid}</div>

    <button class="btn btn-primary" disabled={loading}>
      {#if loading}
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
      {/if}
      <span> Download now</span></button
    >
  </form>

  {#if urls.length > 0}
    <textarea value={urls.join("\n")} readonly />
    <div style="display: flex; justify-content: flex-end; gap: 10px">
      <button on:click={handleCopy} class="btn btn-primary">Copy</button>
      <button on:click={handleDownloadAll} class="btn btn-primary"
        >Download All</button
      >
    </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  input {
    width: 100%;
    max-width: 300px;
  }

  textarea {
    width: 100%;
    resize: none;
    outline: none;
    height: 200px;
  }

  img {
    width: 100px;
    height: 100px;
  }

  h2,
  p {
    margin: 0 !important;
    text-align: center;
  }

  p {
    color: #9c9c9c;
  }
</style>
