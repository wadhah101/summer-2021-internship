import "source-map-support/register";
import { SNSEvent, Context } from "aws-lambda";

export const handler = async (
  event: SNSEvent,
  context: Context
): Promise<void> => {};
