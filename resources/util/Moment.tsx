import React from "react";
import moment, { Moment } from "moment";
import { Tooltip, Box } from "@material-ui/core";

interface MomentProps {
  timestamp: string;
  relative?: boolean;
  fullTime?: boolean;
}
const Moment = ({
  timestamp,
  relative,
  fullTime,
}: MomentProps): JSX.Element => {
  const timeFormatted = moment(timestamp).format("MMMM DD YYYY - hh:mm:ss");
  // nested ternary, todo fix
  const date: string = relative
    ? moment(timestamp).local().fromNow()
    : fullTime
    ? timeFormatted
    : moment(timestamp).local().format("MMMM YYYY");

  return (
    <Tooltip title={timeFormatted} arrow interactive>
      <Box component="span">{date}</Box>
    </Tooltip>
  );
};

//Moment.propTypes = {
// time: PropTypes.string,
// profile: PropTypes.bool,
//};

export default Moment;
