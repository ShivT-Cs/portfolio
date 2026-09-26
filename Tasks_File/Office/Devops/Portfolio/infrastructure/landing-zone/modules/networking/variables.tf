variable "resource_group_name" {
  description = "Resource group name for networking resources."
  type        = string
}

variable "location" {
  description = "Azure location for networking resources."
  type        = string
}

variable "vnet_name" {
  description = "Virtual network name."
  type        = string
}

variable "address_space" {
  description = "Address spaces for virtual network."
  type        = list(string)
}

variable "subnets" {
  description = "Map of subnet definitions."
  type = map(object({
    address_prefix = string
  }))
}

variable "tags" {
  description = "Tags for networking resources."
  type        = map(string)
  default     = {}
}
