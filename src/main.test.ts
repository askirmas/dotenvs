import { main } from "./main"

describe(main.name, () => {
  it("1", () => {
    const files: Record<string, string> = {
      "npm0": "OVERRIDE=true",
      "npm1": "NPM1=Loaded",
      "arg0": "ARG0=Loaded",
      "arg1": "ARG1=Loaded",
    }
    , env = {
      "npm_package_env_file_0": "npm0",
      "npm_package_env_file_1": "npm1",
      "OVERRIDE": "false"
    }
    , argv = ["node", "script", "--env-file=arg0", "--env-file=arg1"]

    main(
      env,
      argv,
      k => files[k],
      true
    )

    expect(env).toStrictEqual({
      "npm_package_env_file_0": "npm0",
      "npm_package_env_file_1": "npm1",
      "NPM1": "Loaded",
      "ARG0": "Loaded",
      "ARG1": "Loaded",
      "OVERRIDE": "false"
    })
    expect(argv).toStrictEqual([
      "node", "script"
    ])
  })

  it("TDD isolation", () => {
    const env = {
      "global": "global"
    }
    , files: Record<string, string> = {
      "file1": join(
        "file1=file1",
        "file1_catch_global=${global}",
        "file1_catch_file2=${file2}"
      ),
      "file2": join(
        "file2=file2",
        "file2_catch_global=${global}",
        "file2_catch_file1=${file1}"
      )
    }
    , argv = ["node", "script", "--env-file=file1", "--env-file=file2"]

    main(
      env,
      argv,
      k => files[k],
      true
    )

    //TDD
    expect(env).not.toStrictEqual({
      "global": "global",
      "file1": "file1",
      "file1_catch_file2": "",
      "file1_catch_global": "global",
      "file2": "file2",
      "file2_catch_file1": "",
      "file2_catch_global": "global",
    })
    expect(env).toStrictEqual({
      "global": "global",
      "file1": "file1",
      "file1_catch_file2": "",
      "file1_catch_global": "",
      "file2": "file2",
      "file2_catch_file1": "",
      "file2_catch_global": "",
    })
  })
})

function join(...s: string[]) {
  return s.join("\n")
}
