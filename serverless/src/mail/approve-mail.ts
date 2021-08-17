import "source-map-support/register";
import { SNSEvent, Context } from "aws-lambda";
import { IAM } from "aws-sdk";

export const handler = async (
  event: SNSEvent,
  context: Context
): Promise<void> => {
  var iam = new IAM();

  const r = await iam.getGroup({ GroupName: "TODO", MaxItems: 10 }).promise();

  console.log(JSON.stringify(r.Users));
  console.log("eeeeeeeh");
};
