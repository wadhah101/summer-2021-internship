import "source-map-support/register";
import { APIGatewayProxyEvent, SNSEvent, Context } from "aws-lambda";

export const handler = async (
  event: SNSEvent,
  context: Context
): Promise<void> => {
  const pipelineResult = JSON.parse(event.Records[0].Sns.Message);
  console.log(pipelineResult);
  return;
};
