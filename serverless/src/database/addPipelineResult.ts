import { join } from "path";
import "source-map-support/register";
import { DynamoDB, S3, CodePipeline } from "aws-sdk";
import { FullCFNResult } from "../@types/FullCFNResult";
import { CodePipelineEvent, Context } from "aws-lambda";
import unzipper from "unzipper";
import { Readable } from "stream";

const { TABLE_NAME } = process.env;
const db = new DynamoDB.DocumentClient();
const codepipeline = new CodePipeline();
const s3 = new S3();

const streamToString = (stream: Readable): Promise<string> => {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

export const handler = async (
  event: CodePipelineEvent,
  context: Context
): Promise<void> => {
  if (!TABLE_NAME) throw new Error("TABLE_NAME not defined");

  const inputArtifacts = event["CodePipeline.job"].data.inputArtifacts;
  const jobId = event["CodePipeline.job"].id;
  const putJobSuccess = () =>
    codepipeline.putJobSuccessResult({ jobId }).promise();
  const postJobFailure = (failureDetails: CodePipeline.FailureDetails) =>
    codepipeline.putJobFailureResult({ jobId, failureDetails });

  try {
    const lintingArt = inputArtifacts.find(
      (e) => e.name === "LintingArtifacts"
    );
    if (!lintingArt) throw new Error("linting artifact not defined");

    const nagArt = inputArtifacts.find((e) => e.name === "NagArtifacts");
    if (!nagArt) throw new Error("nag artifact not defined");

    const executionID = event["CodePipeline.job"].id;

    const lintZipStream = s3
      .getObject({
        Bucket: lintingArt.location.s3Location.bucketName,
        Key: lintingArt.location.s3Location.objectKey,
      })
      .createReadStream()
      .pipe(unzipper.ParseOne(/lint\.json/));
    const nagStream = s3
      .getObject({
        Bucket: nagArt.location.s3Location.bucketName,
        Key: nagArt.location.s3Location.objectKey,
      })
      .createReadStream()
      .pipe(unzipper.ParseOne(/nag\.json/));

    const [lint, nag] = await Promise.all([
      streamToString(nagStream),
      streamToString(lintZipStream),
    ]);

    const [CFNLintResult, CFNNagResult] = [JSON.parse(lint), JSON.parse(nag)];

    const Item: FullCFNResult = {
      executionID,
      CFNLintResult,
      date: new Date().toISOString(),
      CFNNagResult,
    };

    console.log(Item);

    const res = await db.put({ TableName: TABLE_NAME, Item }).promise();

    console.log(JSON.stringify(res));

    await putJobSuccess();
  } catch (e: unknown) {
    await postJobFailure({ message: String(e), type: "JobFailed" });
  }
};
