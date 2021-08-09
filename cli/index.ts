import {
  ChildProcessWithoutNullStreams,
  execSync,
  spawn,
  SpawnOptionsWithoutStdio,
  spawnSync,
} from "child_process";
import { Command } from "commander";
import path from "path";
const program = new Command();

const spawnAsync = (
  command: string,
  args?: ReadonlyArray<string>,
  options?: SpawnOptionsWithoutStdio
): Promise<string> => {
  const r = spawn(command, args, options);

  return new Promise((res, rej) => {
    r.stdout.on("data", (d: string) => res(String(d)));
  });
};

interface CfnTemplate {
  name: string;
  file: string;
}

interface Options {
  location: string;
  updateTemplate: string;
}

const cfnTemplates: CfnTemplate[] = [
  { name: "buckets", file: "bucket.template.yml" },
  { name: "codepipeline", file: "" },
  { name: "lambdas", file: "" },
  { name: "roles", file: "" },
];

program
  .option("-l --location <type>", "template folder location")
  .requiredOption("-u --update-template <file> ", "template name")
  .action(async (options: Options) => {
    const t = cfnTemplates.find((e) => e.name === options.updateTemplate);
    if (!t) throw new Error("eh");

    const shell = spawn("sh", [], { stdio: "inherit" });
    shell.on("close", (code) => {
      console.log("[shell] terminated :", code);
    });

    // const command = spawn("ls", [path.join(options.location)]);
  })
  .parseAsync();
