-- Criar enums para TeamMember
CREATE TYPE "TeamMemberRole" AS ENUM (
  'ENGENHEIRO',
  'ARQUITETO',
  'MESTRE_OBRAS',
  'PEDREIRO',
  'ELETRICISTA',
  'ENCANADOR',
  'PINTOR',
  'CARPINTEIRO',
  'SERVENTE',
  'OUTRO'
);

CREATE TYPE "TeamMemberStatus" AS ENUM (
  'ATIVO',
  'INATIVO',
  'FERIAS',
  'AFASTADO'
);

-- Criar tabela team_members
CREATE TABLE "team_members" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT NOT NULL,
  "cpf" TEXT NOT NULL,
  "role" "TeamMemberRole" NOT NULL,
  "status" "TeamMemberStatus" NOT NULL DEFAULT 'ATIVO',
  "specialization" TEXT,
  "hourlyRate" DOUBLE PRECISION,
  "dailyRate" DOUBLE PRECISION,
  "hireDate" TIMESTAMP(3) NOT NULL,
  "birthDate" TIMESTAMP(3),
  "address" TEXT,
  "city" TEXT,
  "state" TEXT,
  "zipCode" TEXT,
  "emergencyContact" TEXT,
  "emergencyPhone" TEXT,
  "documents" TEXT[],
  "certifications" TEXT[],
  "notes" TEXT,
  "avatar" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- Criar tabela project_team_members (relacionamento)
CREATE TABLE "project_team_members" (
  "id" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "role" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "projectId" TEXT NOT NULL,
  "teamMemberId" TEXT NOT NULL,

  CONSTRAINT "project_team_members_pkey" PRIMARY KEY ("id")
);

-- Criar índices únicos
CREATE UNIQUE INDEX "team_members_email_key" ON "team_members"("email");
CREATE UNIQUE INDEX "team_members_cpf_key" ON "team_members"("cpf");
CREATE UNIQUE INDEX "project_team_members_projectId_teamMemberId_key" ON "project_team_members"("projectId", "teamMemberId");

-- Adicionar foreign keys
ALTER TABLE "project_team_members" ADD CONSTRAINT "project_team_members_projectId_fkey" 
  FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project_team_members" ADD CONSTRAINT "project_team_members_teamMemberId_fkey" 
  FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
