variable "project_name" {
  description = "Sanitized project prefix used for naming resources."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9-]{3,24}$", var.project_name))
    error_message = "project_name must be 3-24 chars of lowercase letters, numbers, or dashes."
  }
}

variable "environment" {
  description = "Environment label used in naming and tags."
  type        = string

  validation {
    condition     = contains(["dev", "test", "prod", "demo"], var.environment)
    error_message = "environment must be one of: dev, test, prod, demo."
  }
}

variable "location" {
  description = "Azure location for all resources in this example."
  type        = string

  validation {
    condition     = length(trim(var.location)) > 0
    error_message = "location must be a non-empty string."
  }
}

variable "resource_groups" {
  description = "Map of resource groups to create for landing zone components."
  type = map(object({
    location = string
    tags     = map(string)
  }))

  validation {
    condition     = length(var.resource_groups) >= 2
    error_message = "Provide at least two resource groups (for example hub and workload)."
  }
}

variable "network_resource_group_key" {
  description = "Key in resource_groups map where network resources are placed."
  type        = string
  default     = "hub"
}

variable "network" {
  description = "Virtual network and subnet configuration."
  type = object({
    vnet_name      = string
    address_space  = list(string)
    subnets = map(object({
      address_prefix = string
    }))
  })

  validation {
    condition     = length(var.network.address_space) > 0 && length(var.network.subnets) >= 2
    error_message = "network must include at least one address space and two subnets."
  }
}

variable "key_vault_name_prefix" {
  description = "Prefix for Key Vault name. A short random suffix is appended in module."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9-]{3,16}$", var.key_vault_name_prefix))
    error_message = "key_vault_name_prefix must be 3-16 chars of lowercase letters, numbers, or dashes."
  }
}

variable "key_vault_subnet_name" {
  description = "Subnet name allowed to access Key Vault through network ACLs."
  type        = string
  default     = "platform"
}

variable "tags" {
  description = "Common tags applied to all modules."
  type        = map(string)
  default     = {}
}
