#!/usr/bin/env bash
# Trigger an AWS Amplify build for the current branch.
# Used by GitHub Actions deploy workflow; can also be run locally with AWS credentials.
#
# Usage: ./amplify-trigger.sh <app-id> <branch-name>
# Example: ./amplify-trigger.sh d1234567890abc main

set -euo pipefail

APP_ID="${1:?Usage: $0 <app-id> <branch-name>}"
BRANCH_NAME="${2:?Usage: $0 <app-id> <branch-name>}"

echo "Triggering Amplify build..."
echo "  App ID: $APP_ID"
echo "  Branch: $BRANCH_NAME"

JOB_ID=$(aws amplify start-job \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH_NAME" \
  --job-type RELEASE \
  --query 'jobSummary.jobId' \
  --output text)

echo "Build started. Job ID: $JOB_ID"
echo "Monitor at: https://console.aws.amazon.com/amplify/home#/$APP_ID/$BRANCH_NAME/$JOB_ID"
