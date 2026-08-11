# MOA frontend deployment infrastructure

The production site uses the existing private `moa.jyyouk.shop` S3 bucket and
CloudFront distribution `EFJI4DCB3J6KJ`. The CloudFormation template creates
only the least-privilege GitHub OIDC role required to publish a verified build.

Deploy the role in `ap-northeast-2`:

```bash
aws cloudformation deploy \
  --stack-name moa-frontend-github-deploy \
  --template-file infra/cloudformation/github-deploy-role.yml \
  --capabilities CAPABILITY_NAMED_IAM
```

Configure these GitHub Actions variables:

- `AWS_DEPLOY_ROLE_ARN`
- `AWS_FRONTEND_BUCKET=moa.jyyouk.shop`
- `CLOUDFRONT_DISTRIBUTION_ID=EFJI4DCB3J6KJ`
- `CLOUDFRONT_DOMAIN_NAME=dmapku2erq8cp.cloudfront.net`
- `VITE_API_BASE_URL=https://api-moa.jyyouk.shop/api`

No long-lived AWS access key is required.
