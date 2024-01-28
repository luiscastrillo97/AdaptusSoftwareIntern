const tasks = require("./tasks");
const s3_driver = require("./s3_driver");

// all good
const test_values_all_good = {
  files: [1, 2, 3, 5, 6, 7, 8, 9],
  scanned_files: [1, 2, 3],
  errored_files: [4],
};

// files empty
const test_values_files_empty = {
  files: [],
  scanned_files: [1, 2, 3],
  errored_files: [4],
};

// not an array
const test_values_not_array = {
  files: [1, 2, 3, 5, 6, 7],
  scanned_files: [],
  errored_files: {},
};

// missing data
const test_values_missing_data = {
  files: [1, 2, 3, 5, 6, 7],
  errored_files: [4],
};

const get_unscanned_files = async (test_values, name) => {
  try {
    const output = await tasks({
      s3_driver,
    }).run(test_values);

    return { name, output };
  } catch (error) {
    return { name, error };
  }
};

(() => {
  return Promise.all([
    get_unscanned_files(test_values_all_good, "test_values_all_good"),
    get_unscanned_files(test_values_files_empty, "test_values_files_empty"),
    get_unscanned_files(test_values_not_array, "test_values_not_array"),
    get_unscanned_files(test_values_missing_data, "test_values_missing_data"),
  ]).then((results) => {
    results.map((response) => console.log(response));
  });
})();
