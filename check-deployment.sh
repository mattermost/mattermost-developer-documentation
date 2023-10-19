#!/bin/bash
set -e

max_retries=5
retry_interval=20

# Main paths to check
paths=("contribute" "integrate")

check_url() {
  local url="https://${BUCKET}.s3.amazonaws.com/branches/master/$1/index.html"
  local retry_count=0

  while [ $retry_count -lt $max_retries ]; do
    if curl -s --head --fail "$url" >/dev/null; then
      echo "Pass: $url is accessible."
      break
    else
      echo "Retry $((retry_count + 1)) of $max_retries: $url is not accessible. Retrying in $retry_interval seconds..."
      sleep $retry_interval
      retry_count=$((retry_count + 1))
    fi
  done

  if [ $retry_count -eq $max_retries ]; then
    echo "Fail: $url is not accessible after $max_retries retries."
  fi
}

# Loop through each path and check
for path in "${paths[@]}"; do
  check_url "$path"
done
