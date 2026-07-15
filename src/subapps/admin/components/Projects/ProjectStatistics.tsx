import * as React from 'react';
import { Statistic } from 'antd';
import moment from 'moment';
import { ProjectStatistics } from '@bbp/nexus-sdk/es';

import FriendlyTimeAgo from '../../../../shared/components/FriendlyDate';

const ProjectStatisticsComponent: React.FC<{
  statistics: ProjectStatistics;
}> = ({ statistics }) => {
  return (
    <div className="project-statistics">
      <h3>Project statistics</h3>
      <div className="project-statistics__metrics">
        <Statistic title="Resources" value={statistics.resourcesCount} />
        <Statistic title="Events" value={statistics.eventsCount} />
      </div>
      {statistics.lastProcessedEventDateTime && (
        <p className="project-statistics__last-event">
          Last processed event{' '}
          <FriendlyTimeAgo
            date={moment(statistics.lastProcessedEventDateTime)}
          />
        </p>
      )}
    </div>
  );
};

export default ProjectStatisticsComponent;
