export default function getComponentData(type) {
  const componentData = {
    elem_type: type,
    elem_id: Date.now(),
    top: Math.round(Math.random() * 500),
    left: Math.round(Math.random() * 500),
    zindex: 8,
    leftunits: "px",
    topunits: "px",
    widthunits: "px",
    heightunits: "px",
  };
  if (type === "shape") {
    componentData.bgcolor = "#c194fc";
    componentData.width = 100;
    componentData.height = 100;
    componentData.figure = "rectangle";
  }
  if (type === "text") {
    componentData.text = "Hello world!";
    componentData.fontsize = 20;
    componentData.fontfamily = "Arial";
    componentData.fontweight = "normal";
    componentData.lineheight = 1.2;
    componentData.color = "#000";
    componentData.width = 200;
  }
  if (type === "image") {
    componentData.img = "https://placehold.co/600x400";
    componentData.width = 150;
    componentData.height = 150;
  }
  return componentData;
}
