variable "resource_group_name" {
  description = "Resource group name for Key Vault resources."
  type        = string
}

variable "location" {
  description = "Azure location for Key Vault resources."
  type        = string
}

variable "key_vault_name_prefix" {
  description = "Prefix for Key Vault name."
  type        = string
}

variable "allowed_subnet_ids" {
  description = "Subnet IDs allowed to access Key Vault network ACL."
  type        = list(string)
  default     = []
}

variable "enable_rbac_authorization" {
  description = "Enable RBAC authorization for Key Vault."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags for Key Vault resources."
  type        = map(string)
  default     = {}
}
