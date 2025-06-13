"use client";

import { LoadingState, EmptyState } from "../../components/ui";
import {
  ShowcaseNavigation,
  ShowcaseContainer,
} from "../../components/showcase";
import { useProjectData, useShowcaseScroll } from "../../hooks";

export default function ShowcasePage() {
  const { projects, loading } = useProjectData();
  const { currentProject, scrollToProject } = useShowcaseScroll({
    projectCount: projects.length,
  });

  if (loading) {
    return <LoadingState message="Loading Projects..." />;
  }

  if (!projects.length) {
    return (
      <EmptyState
        title="No Projects Found"
        message="There are no projects to showcase."
        actionLabel="Back to Home"
        actionHref="/"
      />
    );
  }

  return (
    <>
      <ShowcaseNavigation
        projectCount={projects.length}
        currentProject={currentProject}
        onProjectSelect={scrollToProject}
      />

      <ShowcaseContainer projects={projects} currentProject={currentProject} />
    </>
  );
}
