import {  getProjects  } from "@/app/projects/utils";
import Projects from '@/app/(components)/projects';
import { PageWrapper } from '@/app/(components)/page-wrapper';

export default async function ProjectsPage() {

  let projects = getProjects()
  return (
    <PageWrapper>
    <main className="flex flex-row justify-items-center justify-center min-h-screen p-2 sm:p-5">
      <Projects projects={projects}/>
    </main>
    </PageWrapper>
  );
}