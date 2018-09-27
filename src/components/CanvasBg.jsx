import React from 'react';
import { currentCirle, Circle } from '@/util/canvasBg';

class CanvasBg extends React.Component {
  componentDidMount() {
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    let circles = [];
    let current_circle = new currentCirle();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < circles.length; i++) {
        circles[i].move(w, h);
        circles[i].drawCircle(ctx);
        for (let j = i + 1; j < circles.length; j++) {
          circles[i].drawLine(ctx, circles[j]);
        }
      }
      if (current_circle.x) {
        current_circle.drawCircle(ctx);
        for (var k = 1; k < circles.length; k++) {
          current_circle.drawLine(ctx, circles[k]);
        }
      }
      requestAnimationFrame(draw);
    };

    const initCanvas = num => {
      for (var i = 0; i < num; i++) {
        circles.push(new Circle(Math.random() * w, Math.random() * h));
      }
      draw();
    };
    initCanvas(30);
  }
  render() {
    return (
      <canvas
        id="canvas"
        style={{ height: '100%', width: '100%', position: 'absolute' }}
      />
    );
  }
}

export default CanvasBg;
