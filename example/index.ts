import { CustomObject, Orientation, TreeStructure } from 'tree-structure';

const htmlString = (item: CustomObject): string => {
  const randomColor = () => {
    return Math.floor(Math.random() * 16777215).toString(16);
  };
  return `               
          ctx.beginPath();
          ctx.lineWidth = "1";
          ctx.fillStyle = "#${randomColor()}";
          ctx.fillRect(${item.getPosition().x}, ${item.getPosition().y}, ${item.getWidth()}, ${item.getHeight()});
          
          ctx.strokeText("${item.getId()}", ${
            item.getPosition().x + item.getWidth() / 2
          }, ${item.getPosition().y + item.getHeight() / 2});
          ctx.stroke();        
      `;
};

const createHTML = (list: CustomObject[]): string => {
  let ht = `<!DOCTYPE html>
      <html>
      <head>
      <title>Distance Program</title>
      </head>
      <body>
          <canvas width="10000", height="10000" id="myCanvas">
          </canvas>
      </body>
      <script type="text/javascript">
          var canvas = document.getElementById("myCanvas");
          var ctx = canvas.getContext("2d");        
      `;

  for (const item of list) {
    ht += htmlString(item);
  }
  return (ht += `
      </script>
      </html>`);
};

const l1 = new CustomObject({ children: [], id: 'l1', width: 200, height: 200 });
const l5 = new CustomObject({ children: [], id: 'l5', width: 200, height: 200 });

const l = new CustomObject({ children: [l1, l5], id: 'l', width: 200, height: 200 });

const h2 = new CustomObject({ children: [], id: 'h2', width: 200, height: 200 });
const h3 = new CustomObject({ children: [], id: 'h3', width: 200, height: 200 });
const h1 = new CustomObject({ children: [h2, h3], id: 'h1', width: 200, height: 200 });

const k3 = new CustomObject({ children: [], id: 'k3', width: 200, height: 200 });
const k4 = new CustomObject({ children: [], id: 'k4', width: 200, height: 200 });
const k1 = new CustomObject({ children: [k3, k4], id: 'k1', width: 200, height: 200 });
const k2 = new CustomObject({ children: [], id: 'k2', width: 200, height: 200 });

const i1 = new CustomObject({ children: [], id: 'i1', width: 200, height: 200 });
const l4 = new CustomObject({ children: [], id: 'l4', width: 200, height: 200 });

const h = new CustomObject({ children: [h1], id: 'h', width: 200, height: 200 });

const k = new CustomObject({ children: [k1, k2], id: 'k', width: 200, height: 200 });

const i = new CustomObject({ children: [i1, l4], id: 'i', width: 200, height: 200 });
const g = new CustomObject({ children: [], id: 'g', width: 300, height: 300 });
const l3 = new CustomObject({ children: [], id: 'l3', width: 200, height: 200 });

const l2 = new CustomObject({ children: [], id: 'l2', width: 200, height: 200 });

const b = new CustomObject({ children: [h], id: 'b', width: 200, height: 200 });
const c = new CustomObject({ children: [k], id: 'c', width: 200, height: 200 });
const d = new CustomObject({ children: [], id: 'd', width: 200, height: 200 });
const e = new CustomObject({ children: [i, g, l3], id: 'e', width: 200, height: 200 });

const a = new CustomObject({
  children: [b, c, d, e],
  id: 'a',
  width: 200,
  height: 500
});

const list = [a, b, c, d, e, i, i1, g, h, k, k1, k2, k3, k4, l, l1, l2, l3, l4, l5, h1, h2, h3];

const treeStructure = new TreeStructure({ customObjectSpace: 10, orientation: Orientation.horizontal });

treeStructure.prepare(list);
treeStructure.execute();

//write html
import { writeFileSync } from 'fs';
writeFileSync('./index.html', createHTML(list), {
  flag: 'w'
});
