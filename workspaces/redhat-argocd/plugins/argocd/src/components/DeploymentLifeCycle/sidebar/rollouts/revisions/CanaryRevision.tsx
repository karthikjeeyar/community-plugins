import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import useCanaryMetadata from '../../../../../hooks/useCanaryMetadata';
import { Revision } from '../../../../../types/revision';
import { ROLLOUT_REVISION_ANNOTATION } from '../../../../../types/rollouts';
import AnalysisRuns from './AnalysisRuns/AnalysisRuns';
import ProgressBar from './ProgressBar';
import RevisionStatus from './RevisionStatus';
import RevisionType from './RevisionType';

interface RevisionCardProps {
  revision: Revision;
  animateProgressBar: boolean;
}

const useCanaryRevisionStyles = makeStyles((theme: Theme) => ({
  canaryItem: {
    // minHeight: theme.spacing(30),
    width: theme.spacing(60),
    overflowY: 'auto',
    margin: '1px',
  },
}));

const CanaryRevision: React.FC<RevisionCardProps> = ({
  revision,
  animateProgressBar = true,
}) => {
  const styles = useCanaryRevisionStyles();
  const { percentage, isStableRevision, isCanaryRevision } = useCanaryMetadata({
    revision,
  });

  if (!revision) {
    return null;
  }

  return (
    <Card
      elevation={2}
      className={styles.canaryItem}
      style={{ width: '500px' }}
      data-testid={`${revision?.metadata?.name}`}
    >
      <CardContent>
        <Grid container>
          <Grid item xs={9}>
            <Typography color="textPrimary" gutterBottom>
              {`Revision ${revision?.metadata?.annotations?.[ROLLOUT_REVISION_ANNOTATION]}`}
            </Typography>
          </Grid>
          {(isStableRevision || isCanaryRevision) && (
            <Grid item xs={3}>
              <Box sx={{ width: '100%' }}>
                <RevisionType label={isStableRevision ? 'Stable' : 'Canary'} />
              </Box>
            </Grid>
          )}
        </Grid>
        <Box sx={{ width: '100%' }}>
          <Grid container alignItems="flex-end">
            <Grid item xs={11} style={{ marginBottom: '3px' }}>
              <ProgressBar
                revision={revision}
                percentage={percentage}
                duration={animateProgressBar ? 0 : 2000}
              />
            </Grid>
            <Grid item xs={1}>
              <RevisionStatus revision={revision} />
            </Grid>
          </Grid>
        </Box>
        <br />
        {revision.analysisRuns?.length > 0 && (
          <AnalysisRuns analysisruns={revision.analysisRuns} />
        )}
      </CardContent>
    </Card>
  );
};
export default React.memo(CanaryRevision);
