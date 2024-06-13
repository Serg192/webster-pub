export const stageToImageBlob = (stageRef, canvasSize) => {
  console.log("SIZE: ", canvasSize);
  const stage = stageRef.current;

  const stageCopy = stage.clone();

  stageCopy.setAttrs({
    x: 0,
    y: 0,
    scaleX: 0.3,
    scaleY: 0.3,
  });

  const dataURL = stageCopy.toDataURL({
    x: 0,
    y: 0,
    width: canvasSize.width * 0.3,
    height: canvasSize.height * 0.3,
    mimeType: `image/png`,
  });

  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return dataURLToBlob(dataURL);
};
