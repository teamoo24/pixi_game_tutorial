import * as PIXI from 'pixi.js';
window.onload = () => {
    const app = new PIXI.Application({ width: 400, height: 200 });
    document.body.append(app.view);
    const text = new PIXI.Text('Hello World!');
    text.style.fill = '#ffffff';
    app.stage.addChild(text);
};
