-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'RESEARCHER', 'INSTRUCTOR', 'USER');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('ADMINISTRATIVE_STAFF', 'CLUSTER_ADMINISTRATOR', 'GRADUATE_STUDENT', 'MSC_STUDENT', 'PHD_STUDENT', 'POSDOCTORAL_FELLOW', 'RESEARCH_STAFF', 'TECHNICAL_STAFF', 'TECHNICAL_SUPPORT', 'TECHNOLOGY_TRANSFER', 'UNDERGRADUATE_STUDENT', 'VISITING_PROFESSOR');

-- CreateEnum
CREATE TYPE "FormerPositionType" AS ENUM ('PHD_STUDENT', 'MSC_STUDENT', 'POSDOCTORAL_FELLOW', 'RESEARCH_STAFF', 'UNDERGRADUATE_STUDENT');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('CONICET_ADVISOR', 'CONICET_COADVISOR', 'UNL_ADVISOR', 'UNL_COADVISOR', 'PROJECT_DIRECTOR', 'PROJECT_CODIRECTOR', 'FELLOWSHIP_DIRECTOR', 'FELLOWSHIP_CODIRECTOR');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PubType" AS ENUM ('JOURNAL', 'CONFERENCE', 'BOOK', 'BOOK_CHAPTER', 'THESIS', 'PATENT', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "office" TEXT,
    "phone" TEXT,
    "googleScholar" TEXT,
    "orcid" TEXT,
    "researchGate" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "customLinks" JSONB,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPosition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" "Position" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormerPosition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" "FormerPositionType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "details" TEXT,

    CONSTRAINT "FormerPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRelation" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "adviseeId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "tagId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "UserRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchLine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchLineEntry" (
    "id" TEXT NOT NULL,
    "researchLineId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER,
    "moderatorId" TEXT,
    "lastModerated" TIMESTAMP(3),

    CONSTRAINT "ResearchLineEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "researchLineId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "projectId" TEXT,
    "year" INTEGER NOT NULL,
    "doi" TEXT,
    "pdfUrl" TEXT,
    "pubType" "PubType" NOT NULL,
    "venue" TEXT NOT NULL,
    "citation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseInstructor" (
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "CourseInstructor_pkey" PRIMARY KEY ("courseId","userId")
);

-- CreateTable
CREATE TABLE "CourseMaterial" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_ResearcherLines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResearcherLines_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PublicationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PublicationToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPosition_userId_position_key" ON "UserPosition"("userId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserTag_userId_tagId_key" ON "UserTag"("userId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRelation_adviseeId_advisorId_relationType_tagId_key" ON "UserRelation"("adviseeId", "advisorId", "relationType", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_doi_key" ON "Publication"("doi");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "_ResearcherLines_B_index" ON "_ResearcherLines"("B");

-- CreateIndex
CREATE INDEX "_ProjectMembers_B_index" ON "_ProjectMembers"("B");

-- CreateIndex
CREATE INDEX "_PublicationToUser_B_index" ON "_PublicationToUser"("B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPosition" ADD CONSTRAINT "UserPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormerPosition" ADD CONSTRAINT "FormerPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRelation" ADD CONSTRAINT "UserRelation_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRelation" ADD CONSTRAINT "UserRelation_adviseeId_fkey" FOREIGN KEY ("adviseeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRelation" ADD CONSTRAINT "UserRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchLineEntry" ADD CONSTRAINT "ResearchLineEntry_researchLineId_fkey" FOREIGN KEY ("researchLineId") REFERENCES "ResearchLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchLineEntry" ADD CONSTRAINT "ResearchLineEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchLineEntry" ADD CONSTRAINT "ResearchLineEntry_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_researchLineId_fkey" FOREIGN KEY ("researchLineId") REFERENCES "ResearchLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstructor" ADD CONSTRAINT "CourseInstructor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstructor" ADD CONSTRAINT "CourseInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMaterial" ADD CONSTRAINT "CourseMaterial_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResearcherLines" ADD CONSTRAINT "_ResearcherLines_A_fkey" FOREIGN KEY ("A") REFERENCES "ResearchLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResearcherLines" ADD CONSTRAINT "_ResearcherLines_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToUser" ADD CONSTRAINT "_PublicationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToUser" ADD CONSTRAINT "_PublicationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
