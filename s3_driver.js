const add = async (path, files) => {
  if (files?.length && path) {
    // AWS S3 process
    // ...
    // AWS Ok
    return Promise.resolve();
  }

  return Promise.reject({ message: "Path or files are invalid" });
};

module.exports = {
  add,
};
