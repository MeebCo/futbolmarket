# Deployment

CI/CD for Meebits Fútbol uses GitHub Actions. Deployments target AWS Amplify, with separate staging and main environments.

## Branch Strategy

| Branch   | GitHub Environment | Amplify Target |
|----------|--------------------|----------------|
| `staging` | staging | Staging app/branch |
| `main`    | production | Production app/branch |

## Pipeline Overview

1. **CI** (`.github/workflows/ci.yml`) – runs on **pull requests** to `staging` or `main`:
   - Lint, type check, build

2. **Deploy to Staging** / **Deploy to Production** (`.github/workflows/deploy.yml`) – runs on **push** to `staging` or `main`:
   - Lint, type check, build (validation)
   - Triggers Amplify build via AWS API
   - One workflow per push; name reflects target (Staging or Production)

## GitHub Setup

### 1. Create Environments

In **Settings → Environments**:

- **staging** – for `staging` branch deploys
- **production** – for `main` branch deploys (company naming convention)

### 2. Secrets and Variables

Use **Settings → Secrets and variables → Actions**.

**Secrets** (credentials – per environment or repo):

- `AWS_ACCESS_KEY_ID` – IAM user with `amplify:StartJob`
- `AWS_SECRET_ACCESS_KEY`

**Variables** (non-sensitive config):

- `AMPLIFY_APP_ID` – per environment (staging / production)
- `AMPLIFY_APP_ID_STAGING` – repo-level fallback for staging branch
- `AMPLIFY_APP_ID_MAIN` – repo-level fallback for production branch
- `AWS_REGION` – optional, default `us-east-1`

### 3. Amplify Environment Variables

Configure in **Amplify Console → App settings → Environment variables** per branch:

- `NEXT_PUBLIC_VIEW_ONLY` – `true` for view-only (hides Connect button). **Staging auto-sets this** in `amplify.yml` (uses `AWS_BRANCH`); override in Console if needed. For production, set here.
- `NEXT_PUBLIC_SITE_URL` – e.g. `https://staging.example.com` or `https://example.com`
- Other vars from `.env.example` as needed

**Note:** `NEXT_PUBLIC_*` vars are baked in at build time. GitHub variables do not affect the deployed site—only Amplify Console env vars (or `amplify.yml`) do.

## Amplify Setup

1. **Create Amplify app(s)** – one per environment or one app with two branches.
2. **Connect GitHub** – link the repo and select `staging` and `main`.
3. **Disable auto-build** – App settings → General → disable “Automatically build and deploy when changes are pushed” so only GitHub Actions triggers builds.
4. **Add branches** – ensure both `staging` and `main` exist in Amplify.

## IAM Permissions

The IAM user used by GitHub Actions needs at least:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "amplify:StartJob",
        "amplify:GetJob"
      ],
      "Resource": "arn:aws:amplify:*:*:apps/*"
    }
  ]
}
```

## Local Deployment (optional)

With AWS credentials configured:

```bash
./.deploy/amplify-trigger.sh <AMPLIFY_APP_ID> <branch-name>
```

## Future: EC2 / Docker

When moving to EC2, the same CI workflow can be extended with a deploy job that:

1. Builds a Docker image
2. Pushes to ECR
3. Updates ECS or an EC2 instance

The `.deploy/` folder can hold scripts for that migration.
