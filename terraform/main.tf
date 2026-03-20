terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket         = "quran-ai-tf-state-639209085183"
    key            = "quran-ai/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Create an Elastic Container Registry (ECR) for our Docker images
resource "aws_ecr_repository" "quran_ai_repo" {
  name                 = "quran-ai-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
