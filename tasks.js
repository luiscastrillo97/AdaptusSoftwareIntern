module.exports = (resources) => {
  const my = {};
  const shared = {
    // SHARED_VAR: value
    // ...
    SAVING_PARH: "/adaptus/luis_castrillo",
  };

  // ============================================================================

  my.run = async (input) => {
    const {
      bundled_config = undefined,
      _debug = undefined,
      s3_driver = undefined,
    } = resources;

    let output = {};

    try {
      const load_data = await load(input);
      const validate_data = await validate(load_data);
      const data = await setup(validate_data);

      // business logic goes here...
      const { files, scanned_files, errored_files } = data;

      const files_and_errored_set = new Set([...files, ...errored_files]);
      const files_and_errored = Array.from(files_and_errored_set);

      const files_to_scan = files_and_errored.filter((id) => {
        return !scanned_files.includes(id);
      });

      await s3_driver?.add(shared.SAVING_PARH, files_to_scan);

      // output = ...
      output = {
        data: files_to_scan,
      };
    } catch (e) {
      // if (e.message === ...
      //   throw new Error('...
      // }

      // Validate case
      if (e?.detail === "validate") {
        throw {
          status: "error",
          message: e?.message,
        };
      }

      // s3_driver case
      throw {
        status: "error",
        message: `There Was An Error Trying To Upload File: ${
          e?.message ?? ""
        }`,
      };

      // Default case
      _debug?.(e.stack);
    }

    return output;

    async function load(input = {}) {
      const config = {};
      // config.var1 = input.var1
      // ...
      config.files = input?.files;
      config.scanned_files = input?.scanned_files;
      config.errored_files = input?.errored_files;

      // config.config1 = await bundled_config.config('CONFIG1')
      // ...
      return config;
    }

    async function setup(config) {
      const data = { ...config };
      // ...
      return data;
    }

    async function validate(config) {
      [
        // [variable, "display name"],
        [config.files, "files"],
        [config.scanned_files, "scanned_files"],
        [config.errored_files, "errored_files"],
      ].forEach(([item, name]) => {
        if (!item) {
          throw {
            detail: "validate",
            message: `Missing Input: ${name} `,
          };
        }
        if (!Array.isArray(item)) {
          throw {
            detail: "validate",
            message: `${name} Is Not An Array`,
          };
        }

        if (name === "files" && !item.length) {
          throw {
            detail: "validate",
            message: "files Array Is Empty",
          };
        }
      });
      return config;
    }
  };

  return my;
};
