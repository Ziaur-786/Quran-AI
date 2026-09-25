# 1. We must have a VPC (Virtual Private Cloud) network for our EKS cluster
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "quran-ai-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

# 2. Provision the EKS Cluster using the official AWS module
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "quran-ai-cluster"
  cluster_version = "1.30"

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.public_subnets

  # Enable public access so your GitHub Action can deploy to it later
  cluster_endpoint_public_access = true

  # 3. Create a managed Node Group (the actual EC2 Servers that run your Docker image)
  eks_managed_node_groups = {
    quran_ai_nodes = {
      # t3.small is cheap for testing (~$0.02 / hr)
      instance_types = ["t3.small"]
      min_size       = 1
      max_size       = 2
      desired_size   = 1
    }
  }

  # Allow the creator of the cluster (GitHub Actions IAM User) admin access
  enable_cluster_creator_admin_permissions = true
}
