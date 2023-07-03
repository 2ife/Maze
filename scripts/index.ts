const body = document.querySelector("body") as HTMLBodyElement,
  gameZone = document.querySelector("#gameZone") as HTMLCanvasElement;
class Maze{
row:number
cell:number
startCoord:number[]
destinationCoord:number[]
width:number
height:number
roomWidth:number
roomHeight:number
}
class Runner {
  basicImgSrc: string;
  currentCoord: number[];
  history: number[][];
  constructor(currentCoord: number[], history: number[][]) {
    this.basicImgSrc = "./images/runner.png";
    this.currentCoord = currentCoord;
    this.history = history;
  }
}

const setGameZoneSize = () => {
  gameZone.width = (body.clientWidth * 100) / 90;
  gameZone.height = (body.clientHeight * 100) / 90;
};
setGameZoneSize();
