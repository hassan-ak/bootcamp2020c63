# EventBridge with Lambda

## Steps to code

1. Create new directory using `mkdir eventbridge_with_lambda`
2. Navigate to newly created directory using `cd eventbridge_with_lambda`
3. Create cdk v1 app using `npx aws-cdk@1.x init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install ec2 module using npm i @aws-cdk/aws-ec2. Update "./lib/eventbridge_with_lambda-stack.ts" to define virtual private cloud which created subnet IPv4 addresses for our net-working.
