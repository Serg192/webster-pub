export const Tool = Object.freeze({
  POINTER: "POINTER",
  GRAB: "GRAB",
  RECTANGLE: "RECTANGLE",
  POLYGON: "POLYGON",
  CIRCLE: "CIRCLE",
  ARROW: "ARROW",
  TEXT: "TEXT",
  PENCIL: "PENCIL",
});

export const ShapeType = Object.freeze({
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  POLYGON: "POLYGON",
  ARROW: "ARROW",
  TEXT: "TEXT",
  LINE: "LINE",
  IMAGE: "IMAGE",
});

export class Position2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

export class Shape extends Position2D {
  constructor({
    x,
    y,
    id,
    selected,
    type,
    fill,
    stroke,
    strokeWidth,
    rotation,
  }) {
    super(x, y);
    this.id = id;
    this.selected = selected;
    this.type = type;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.rotation = rotation;
  }
}

export class Rectangle extends Shape {
  constructor({
    x,
    y,
    id,
    selected,
    width,
    height,
    fill,
    stroke,
    strokeWidth,
    rotation,
  }) {
    super({
      x,
      y,
      id,
      selected,
      type: ShapeType.RECTANGLE,
      fill,
      stroke,
      strokeWidth,
      rotation,
    });
    this.width = width;
    this.height = height;
  }
}

export class Polygon extends Shape {
  constructor({
    x,
    y,
    id,
    selected,
    radius,
    sides,
    fill,
    stroke,
    strokeWidth,
    rotation,
  }) {
    super({
      x,
      y,
      id,
      selected,
      type: ShapeType.POLYGON,
      fill,
      stroke,
      strokeWidth,
      rotation,
    });
    this.radius = radius;
    this.sides = sides;
  }
}

export class Circle extends Shape {
  constructor({
    x,
    y,
    id,
    selected,
    radiusX,
    radiusY,
    fill,
    stroke,
    strokeWidth,
    rotation,
  }) {
    super({
      x,
      y,
      id,
      selected,
      type: ShapeType.CIRCLE,
      fill,
      stroke,
      strokeWidth,
      rotation,
    });
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
}

export class Text extends Shape {
  constructor({ x, y, id, selected, text, fontSize, rotation }) {
    super({ x, y, id, selected, type: ShapeType.TEXT, rotation });
    this.text = text;
    this.fontSize = fontSize;
  }
}

export class Line extends Shape {
  constructor({
    x,
    y,
    id,
    selected,
    points,
    fill,
    stroke,
    strokeWidth,
    rotation,
  }) {
    super({
      x,
      y,
      id,
      selected,
      type: ShapeType.LINE,
      fill,
      stroke,
      strokeWidth,
      rotation,
    });
    this.points = points;
  }
}

export class Image extends Shape {
  constructor({
    x,
    y,
    id,
    selected,
    fill,
    stroke,
    strokeWidth,
    rotation,
    src,
    width,
    height,
  }) {
    super({
      x,
      y,
      id,
      selected,
      type: ShapeType.IMAGE,
      fill,
      stroke,
      strokeWidth,
      rotation,
    });
    this.image = src;
    this.width = width;
    this.height = height;
    this.scaleX = 1;
    this.scaleY = 1;
  }
}

export class Arrow extends Shape {
  constructor({
    x,
    y,
    id,
    selected,
    points,
    fill,
    stroke,
    strokeWidth,
    rotation,
  }) {
    super({
      x,
      y,
      id,
      selected,
      type: ShapeType.ARROW,
      fill,
      stroke,
      strokeWidth,
      rotation,
    });
    this.points = points;
  }
}