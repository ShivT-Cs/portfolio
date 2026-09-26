variable "resource_groups" {
  description = "Map of resource groups to create."
  type = map(object({
    location = string
    tags     = map(string)
  }))
}

variable "common_tags" {
  description = "Tags merged into each resource group."
  type        = map(string)
  default     = {}
}
