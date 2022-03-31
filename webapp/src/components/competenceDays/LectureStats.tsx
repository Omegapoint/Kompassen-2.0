import { Box, Divider, Typography } from '@mui/material';
import { Fragment, ReactElement, useContext, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useQuery } from 'react-query';
import { listLectureCategories } from '../../api/Api';
import { formatImgAsSVG, useAppSelector } from '../../lib/Lib';
import { padding } from '../../theme/Theme';
import SmallLoader from '../loader/SmallLoader';
import ChartIcon from './ChartIcon';
import EventContext from './EventContext';

const size = 6;

const LectureStats = (): ReactElement => {
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const { event } = useContext(EventContext);
  const { data, isLoading } = useQuery(`lectureCategories-${event.id}`, () =>
    listLectureCategories({ id: event.id })
  );

  const categories = useAppSelector((state) => state.categories);
  const mapped = data?.map((e) => {
    const category = categories?.find((e1) => e1.id === e.categoryID);
    return {
      title: category?.icon,
      desc: category?.name,
      value: e.count,
      color: category?.color || '',
    };
  });
  return (
    <Box sx={{ display: 'grid', gridGap: padding.small }}>
      <div>
        <Typography color="primary">Kategorifördelning över inskickade bidrag</Typography>
        <Divider />
      </div>
      {isLoading ? (
        <SmallLoader />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: '25% 1fr', gridGap: padding.small }}>
          {mapped?.length ? (
            <>
              <PieChart
                data={mapped}
                radius={PieChart.defaultProps.radius - size}
                segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                segmentsShift={(index) => (index === hovered ? size : 2)}
                animate
                onMouseOver={(_, index) => setHovered(index)}
                onMouseOut={() => setHovered(undefined)}
                startAngle={-90}
                label={(e) => (
                  <ChartIcon
                    one={mapped?.length === 1}
                    key={e.dataEntry.title}
                    onMouseOver={() => setHovered(e.dataIndex)}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...e}
                  />
                )}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridGap: padding.minimal,
                  gridTemplateColumns: 'max-content 1fr max-content',
                  alignItems: 'center',
                  '& p': { lineHeight: '1' },
                }}
              >
                {mapped?.map((e) => (
                  <Fragment key={e.title}>
                    <img alt="icon" width="12" height="12" src={formatImgAsSVG(e.title!)} />
                    <Typography>{e.desc}</Typography>
                    <Typography/>
                  </Fragment>
                ))}
              </Box>
            </>
          ) : (
            <Typography sx={{ display: 'grid', gridColumn: 'span 3', justifyItems: 'center' }}>
              Här var det tomt
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LectureStats;
