import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import deepOrange from '@material-ui/core/colors/deepOrange';

import { AppState } from 'app/rootReducer';

import Container from './Canvas/Container';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
    },
  }),
);

export default function Content() {
  const classes = useStyles();
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<Container | null>(null);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const tool = useSelector((state: AppState) => state.boardState.tool);

  useEffect(() => {
    const onResize = () => {
      if (!divRef.current || !canvasRef.current || !doc) {
        return;
      }

      const { width, height } = divRef.current?.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      const options = {
        color: grey[50],
        eraserColor: deepOrange[400],
      };

      containerRef.current = new Container(canvasRef.current, doc.update.bind(doc), options);
      containerRef.current.setTool(tool);
      containerRef.current.drawAll(doc.getRootObject().shapes);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [doc, tool]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.name === 'remote-change') {
        containerRef.current?.drawAll(doc.getRootObject().shapes);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  useEffect(() => {
    containerRef.current?.setTool(tool);
  }, [doc, tool]);

  return (
    <div className={classes.root} ref={divRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}