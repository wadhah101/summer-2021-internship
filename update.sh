# aws cloudformation update-stack --stack-name cfn-lint-test-pipelineV9 --capabilities CAPABILITY_NAMED_IAM   --template-body file://pipeline/cfn.pipeline.yml


sam build && sam deploy 