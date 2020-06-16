import React, { useContext } from "react";
import moment, { Moment } from "moment";
import { Tooltip, makeStyles, Box } from "@material-ui/core";
import DarkModeContext from "../DarkMode";

interface StyleProps {
  darkMode: boolean;
}

const useStyles = makeStyles(() => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  /*  moment: {
    color: props.darkMode ? "#b8c5d9bd" : "#070b0fbd",
  }),*/
}));
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
