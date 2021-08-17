import { join } from "path";
import "source-map-support/register";
import { DynamoDB, S3 } from "aws-sdk";
import { FullCFNResult } from "../@types/FullCFNResult";

interface MyEventRule {
  version: string;
  id: string;
  "detail-type": string;
  source: string;
  account: string;
  time: Date;
  region: string;
  resources: string[];
  detail: Detail;
}

interface Detail {
  pipeline: string;
  "execution-id": string;
  stage: string;
  state: string;
  version: number;
}

const tableName = process.env.TABLE_NAME;
const db = new DynamoDB.DocumentClient();
const bucketName = process.env.BUCKET_NAME;
const s3 = new S3();

export const handler = async (event: MyEventRule): Promise<void> => {
  if (!tableName) throw new Error("tableName not defined");
  if (!bucketName) throw new Error("bucketName is not defined");
  const executionID = event.detail["execution-id"];

  const lintObjPromise = s3
    .getObject({ Bucket: bucketName, Key: join(executionID, "lint.json") })
    .promise()
    .then((e) => e.Body?.toString());

  const nagObjPromise = s3
    .getObject({ Bucket: bucketName, Key: join(executionID, "nag.json") })
    .promise()
    .then((e) => e.Body?.toString());

  const [lintStr, nagStr] = await Promise.all([lintObjPromise, nagObjPromise]);
  if (!lintStr) throw new Error("lint file not found");
  if (!nagStr) throw new Error("nag file not found");

  const [CFNLintResult, CFNNagResult] = [
    JSON.parse(lintStr),
    JSON.parse(nagStr),
  ];

  const Item: FullCFNResult = {
    executionID,
    CFNLintResult,
    date: new Date().toISOString(),
    CFNNagResult,
  };

  const res = await db.put({ TableName: tableName, Item }).promise();

  console.log(JSON.stringify(res));
};
