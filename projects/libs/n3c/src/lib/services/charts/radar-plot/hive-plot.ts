export interface Link {
  source(_: (d: any, i: any) => any): Link;
  target(_: (d: any, i: any) => any): Link;
  angle(_: (d: any, i: any) => number): Link;
  radius(_: (d: any, i: any) => number): Link;
  startRadius(_: (d: any, i: any) => number): Link;
  endRadius(_: (d: any, i: any) => number): Link;
  (d: any, i: any): string;
}

export function link(): Link {
  let source = (d: any, i: any) => d.source,
    target = (d: any, i: any) => d.target,
    angle = (d: any, i: any) => d.angle,
    startRadius = (d: any, i: any) => d.radius,
    endRadius = startRadius,
    arcOffset = -Math.PI / 2;

  function link(d: any, i: any): string {
    // @ts-ignore
    let s = node(source, this, d, i);
    // @ts-ignore
    let t = node(target, this, d, i);
    let x;

    if (t.a < s.a) {
      x = t;
      t = s;
      s = x;
    }

    if (t.a - s.a > Math.PI) {
      s.a += 2 * Math.PI;
    }

    const a1 = s.a + (t.a - s.a) / 3;
    const a2 = t.a - (t.a - s.a) / 3;

    return s.r0 - s.r1 || t.r0 - t.r1
      ? `M${Math.cos(s.a) * s.r0},${Math.sin(s.a) * s.r0}` +
          `L${Math.cos(s.a) * s.r1},${Math.sin(s.a) * s.r1}` +
          `C${Math.cos(a1) * s.r1},${Math.sin(a1) * s.r1}` +
          ` ${Math.cos(a2) * t.r1},${Math.sin(a2) * t.r1}` +
          ` ${Math.cos(t.a) * t.r1},${Math.sin(t.a) * t.r1}` +
          `L${Math.cos(t.a) * t.r0},${Math.sin(t.a) * t.r0}` +
          `C${Math.cos(a2) * t.r0},${Math.sin(a2) * t.r0}` +
          ` ${Math.cos(a1) * s.r0},${Math.sin(a1) * s.r0}` +
          ` ${Math.cos(s.a) * s.r0},${Math.sin(s.a) * s.r0}`
      : `M${Math.cos(s.a) * s.r0},${Math.sin(s.a) * s.r0}` +
          `C${Math.cos(a1) * s.r1},${Math.sin(a1) * s.r1}` +
          ` ${Math.cos(a2) * t.r1},${Math.sin(a2) * t.r1}` +
          ` ${Math.cos(t.a) * t.r1},${Math.sin(t.a) * t.r1}`;
  }

  function node(method: (d: any, i: any) => any, context: any, d: any, i: any) {
    const node = method.call(context, d, i),
      a = +(typeof angle === 'function' ? angle.call(context, node, i) : angle) + arcOffset,
      r0 = +(typeof startRadius === 'function' ? startRadius.call(context, node, i) : startRadius),
      r1 =
        startRadius === endRadius
          ? r0
          : +(typeof endRadius === 'function' ? endRadius.call(context, node, i) : endRadius);

    return {r0, r1, a};
  }

  link.source = function (_: (d: any, i: any) => any): Link {
    source = _;
    return link;
  };

  link.target = function (_: (d: any, i: any) => any): Link {
    target = _;
    return link;
  };

  link.angle = function (_: (d: any, i: any) => number): Link {
    angle = _;
    console.log('angle', _);
    return link;
  };

  link.radius = function (_: (d: any, i: any) => number): Link {
    startRadius = endRadius = _;
    return link;
  };

  link.startRadius = function (_: (d: any, i: any) => number): Link {
    startRadius = _;
    return link;
  };

  link.endRadius = function (_: (d: any, i: any) => number): Link {
    endRadius = _;
    return link;
  };

  return link;
}
