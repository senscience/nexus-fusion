import * as React from 'react';
import { ProjectStatistics } from '@bbp/nexus-sdk/es';
import { useNexusContext } from '@bbp/react-nexus';

import ProjectStatisticsComponent from '../components/Projects/ProjectStatistics';

const ProjectStatisticsContainer: React.FC<{
  orgLabel: string;
  projectLabel: string;
}> = ({ orgLabel, projectLabel }) => {
  const nexus = useNexusContext();
  const [statistics, setStatistics] = React.useState<ProjectStatistics>();

  React.useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await nexus.Project.statistics(orgLabel, projectLabel);
      setStatistics(response);
    } catch (error) {
      // The project statistics endpoint may be unavailable or forbidden (e.g. 403/404); fail gracefully
      // with no statistics rather than surfacing an error.
      setStatistics(undefined);
    }
  };

  if (!statistics) {
    return null;
  }

  return <ProjectStatisticsComponent statistics={statistics} />;
};

export default ProjectStatisticsContainer;
