resource "local_file" "secrets" {
  sensitive_content = <<EOF
#!/bin/bash

export ARM_CLIENT_ID='${azuread_application.app.application_id}'
export ARM_CLIENT_SECRET='${nonsensitive(azuread_application_password.app.value)}'
export ARM_SUBSCRIPTION_ID='${var.subscription}'
export ARM_TENANT_ID='${data.azuread_client_config.current.tenant_id}'
EOF
  filename          = "../production/secrets.sh"
}

output "secret" {
  value = nonsensitive(github_actions_secret.azure_credentials.plaintext_value)
}
