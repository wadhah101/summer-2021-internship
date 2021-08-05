import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AWS from "aws-sdk";

const params = {
  restApiId: "STRING_VALUE" /* required */,
  deploymentId: "STRING_VALUE",
};

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const result = { event, context };
  const apiGateway = new AWS.APIGateway({ params });

  const stages = await apiGateway.getStages().promise();

  console.log(stages);

  return {
    statusCode: 200,
    body: JSON.stringify({
      stages,
    }),
  };
};
