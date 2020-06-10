import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Repository = (props) => {
  const { project } = props;
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {project.owner} / {project.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {project.description}
        </Typography>
        {project.repo_topics &&
          project.repo_topics.map((repo_topic) => (
            <Chip label={repo_topic.topic.name} variant="outlined" />
          ))}
        <Typography variant="overline" display="block">
          {project.language && project.language}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Repository;
