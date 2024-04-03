import { assert } from 'chai';
import { CustomObject, Orientation, TreeStructure } from './../src/index';

describe('Initial', function () {
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
  const space = 10;

  it('should construct example structure with correct positions (Horizontal structure)', function () {
    const treeStructure = new TreeStructure({ customObjectSpace: space, orientation: Orientation.horizontal });
    treeStructure.prepare(list);
    treeStructure.execute();

    assert.strictEqual(a.getPosition().x, 1005);
    assert.strictEqual(a.getPosition().y, 10);

    assert.strictEqual(b.getPosition().x, 1055);
    assert.strictEqual(b.getPosition().y, 520);

    assert.strictEqual(c.getPosition().x, 1580);
    assert.strictEqual(c.getPosition().y, 520);

    assert.strictEqual(d.getPosition().x, 2000);
    assert.strictEqual(d.getPosition().y, 520);

    assert.strictEqual(e.getPosition().x, 375);
    assert.strictEqual(e.getPosition().y, 520);

    assert.strictEqual(i.getPosition().x, 115);
    assert.strictEqual(i.getPosition().y, 730);

    assert.strictEqual(i1.getPosition().x, -66.66666666666667);
    assert.strictEqual(i1.getPosition().y, 1040);

    assert.strictEqual(g.getPosition().x, 430);
    assert.strictEqual(g.getPosition().y, 730);

    assert.strictEqual(h.getPosition().x, 1055);
    assert.strictEqual(h.getPosition().y, 730);

    assert.strictEqual(k.getPosition().x, 1580);
    assert.strictEqual(k.getPosition().y, 730);

    assert.strictEqual(k1.getPosition().x, 1328.3333333333333);
    assert.strictEqual(k1.getPosition().y, 1040);

    assert.strictEqual(k2.getPosition().x, 1643.3333333333333);
    assert.strictEqual(k2.getPosition().y, 1040);

    assert.strictEqual(k3.getPosition().x, 1293.3333333333333);
    assert.strictEqual(k3.getPosition().y, 1250);

    assert.strictEqual(k4.getPosition().x, 1503.3333333333333);
    assert.strictEqual(k4.getPosition().y, 1250);

    assert.strictEqual(l.getPosition().x, 2315);
    assert.strictEqual(l.getPosition().y, 10);

    assert.strictEqual(l1.getPosition().x, 2210);
    assert.strictEqual(l1.getPosition().y, 220);

    assert.strictEqual(l2.getPosition().x, 2630);
    assert.strictEqual(l2.getPosition().y, 10);

    assert.strictEqual(l3.getPosition().x, 740);
    assert.strictEqual(l3.getPosition().y, 730);

    assert.strictEqual(l4.getPosition().x, 143.33333333333331);
    assert.strictEqual(l4.getPosition().y, 1040);

    assert.strictEqual(l5.getPosition().x, 2420);
    assert.strictEqual(l5.getPosition().y, 220);

    assert.strictEqual(h1.getPosition().x, 940);
    assert.strictEqual(h1.getPosition().y, 1040);

    assert.strictEqual(h2.getPosition().x, 873.3333333333334);
    assert.strictEqual(h2.getPosition().y, 1250);

    assert.strictEqual(h3.getPosition().x, 1083.3333333333333);
    assert.strictEqual(h3.getPosition().y, 1250);
  });

  it('should construct example structure with correct positions (Vertical structure)', function () {
    const treeStructure = new TreeStructure({ customObjectSpace: space, orientation: Orientation.vertical });
    treeStructure.prepare(list);
    treeStructure.execute();

    assert.strictEqual(a.getPosition().x, 10);
    assert.strictEqual(a.getPosition().y, 855);

    assert.strictEqual(b.getPosition().x, 220);
    assert.strictEqual(b.getPosition().y, 1055);

    assert.strictEqual(c.getPosition().x, 220);
    assert.strictEqual(c.getPosition().y, 1580);

    assert.strictEqual(d.getPosition().x, 220);
    assert.strictEqual(d.getPosition().y, 2000);

    assert.strictEqual(e.getPosition().x, 220);
    assert.strictEqual(e.getPosition().y, 375);

    assert.strictEqual(i.getPosition().x, 430);
    assert.strictEqual(i.getPosition().y, 115);

    assert.strictEqual(i1.getPosition().x, 740);
    assert.strictEqual(i1.getPosition().y, 10);

    assert.strictEqual(g.getPosition().x, 430);
    assert.strictEqual(g.getPosition().y, 430);

    assert.strictEqual(h.getPosition().x, 430);
    assert.strictEqual(h.getPosition().y, 1055);

    assert.strictEqual(k.getPosition().x, 430);
    assert.strictEqual(k.getPosition().y, 1580);

    assert.strictEqual(k1.getPosition().x, 740);
    assert.strictEqual(k1.getPosition().y, 1475);

    assert.strictEqual(k2.getPosition().x, 740);
    assert.strictEqual(k2.getPosition().y, 1790);

    assert.strictEqual(k3.getPosition().x, 950);
    assert.strictEqual(k3.getPosition().y, 1370);

    assert.strictEqual(k4.getPosition().x, 950);
    assert.strictEqual(k4.getPosition().y, 1580);

    assert.strictEqual(l.getPosition().x, 10);
    assert.strictEqual(l.getPosition().y, 2315);

    assert.strictEqual(l1.getPosition().x, 220);
    assert.strictEqual(l1.getPosition().y, 2210);

    assert.strictEqual(l2.getPosition().x, 10);
    assert.strictEqual(l2.getPosition().y, 2630);

    assert.strictEqual(l3.getPosition().x, 430);
    assert.strictEqual(l3.getPosition().y, 740);

    assert.strictEqual(l4.getPosition().x, 740);
    assert.strictEqual(l4.getPosition().y, 220);

    assert.strictEqual(l5.getPosition().x, 220);
    assert.strictEqual(l5.getPosition().y, 2420);

    assert.strictEqual(h1.getPosition().x, 740);
    assert.strictEqual(h1.getPosition().y, 1055);

    assert.strictEqual(h2.getPosition().x, 950);
    assert.strictEqual(h2.getPosition().y, 950);

    assert.strictEqual(h3.getPosition().x, 950);
    assert.strictEqual(h3.getPosition().y, 1160);
  });
});
