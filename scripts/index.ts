const body = document.querySelector("body") as HTMLBodyElement,
  gameZone = body.querySelector("#gameZone") as HTMLCanvasElement,
  stageBtn = body.querySelector(".stageContainer_stageBtn") as HTMLInputElement;
const ctx = gameZone.getContext("2d") as CanvasRenderingContext2D;

class Maze {
  row: number;
  cell: number;
  mazeData: number[][][];
  startCoord: number[];
  destinationCoord: number[];
  roomLineLength: number;
  width: number;
  height: number;
  constructor(
    mazeData: number[][][],
    startCoord: number[],
    destinationCoord: number[]
  ) {
    this.mazeData = mazeData;
    this.startCoord = startCoord;
    this.destinationCoord = destinationCoord;
    this.roomLineLength = 30;
    this.row = mazeData.length;
    this.cell = mazeData[0].length;
    this.width = this.roomLineLength * this.row;
    this.height = this.roomLineLength * this.cell;
  }
  draw = () => {
    setGameZoneSize(this.width, this.height);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    for (let y = 0; y < this.row; y++) {
      for (let x = 0; x < this.cell; x++) {
        const roomInfo = this.mazeData[y][x],
          basicXCoord = this.roomLineLength * x,
          basicYCoord = this.roomLineLength * y;
        if (!roomInfo[0]) {
          ctx.moveTo(basicXCoord, basicYCoord + this.roomLineLength);
          ctx.lineTo(
            basicXCoord + this.roomLineLength,
            basicYCoord + this.roomLineLength
          );
          ctx.stroke();
        }
        if (!roomInfo[1]) {
          ctx.moveTo(basicXCoord, basicYCoord);
          ctx.lineTo(basicXCoord + this.roomLineLength, basicYCoord);
          ctx.stroke();
        }
        if (!roomInfo[2]) {
          ctx.moveTo(basicXCoord + this.roomLineLength, basicYCoord);
          ctx.lineTo(
            basicXCoord + this.roomLineLength,
            basicYCoord + this.roomLineLength
          );
          ctx.stroke();
        }
        if (!roomInfo[3]) {
          ctx.moveTo(basicXCoord, basicYCoord);
          ctx.lineTo(basicXCoord, basicYCoord + this.roomLineLength);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = "beige";
    ctx.fillRect(
      this.startCoord[1] * this.roomLineLength + 1,
      this.startCoord[0] * this.roomLineLength + 1,
      this.roomLineLength - 2,
      this.roomLineLength - 2
    );
    ctx.fillStyle = "rgb(255, 200, 0)";
    ctx.fillRect(
      this.destinationCoord[1] * this.roomLineLength + 1,
      this.destinationCoord[0] * this.roomLineLength + 1,
      this.roomLineLength - 2,
      this.roomLineLength - 2
    );
  };
}
class Runner {
  basicImgSrc: string;
  currentCoord: number[];
  history: number[][];
  roomLineLength: number;
  constructor(currentCoord: number[]) {
    this.basicImgSrc = "./images/runner.png";
    this.currentCoord = currentCoord;
    this.history = [];
    this.roomLineLength = 30;
  }
  draw = () => {
    const img = new Image();
    img.addEventListener("load", () => {
      ctx.drawImage(
        img,
        this.roomLineLength * this.currentCoord[1] + this.roomLineLength / 10,
        this.roomLineLength * this.currentCoord[0] + this.roomLineLength / 10,
        (this.roomLineLength * 80) / 100,
        (this.roomLineLength * 80) / 100
      );
    });
    img.src = this.basicImgSrc;
  };
  erase = (maze: Maze) => {
    ctx.clearRect(
      this.roomLineLength * this.currentCoord[1] + this.roomLineLength / 10,
      this.roomLineLength * this.currentCoord[0] + this.roomLineLength / 10,
      (this.roomLineLength * 80) / 100,
      (this.roomLineLength * 80) / 100
    );
    if (
      this.currentCoord[0] === maze.startCoord[0] &&
      this.currentCoord[1] === maze.startCoord[1]
    ) {
      ctx.fillStyle = "beige";
      ctx.fillRect(
        this.currentCoord[1] * this.roomLineLength + 1,
        this.currentCoord[0] * this.roomLineLength + 1,
        this.roomLineLength - 2,
        this.roomLineLength - 2
      );
    }
  };
  move = (direction: "left" | "right" | "up" | "down", maze: Maze) => {
    this.history.push(this.currentCoord);
    this.erase(maze);
    switch (direction) {
      case "left": {
        this.currentCoord = [this.currentCoord[0], this.currentCoord[1] - 1];
        break;
      }
      case "right": {
        this.currentCoord = [this.currentCoord[0], this.currentCoord[1] + 1];
        break;
      }
      case "up": {
        this.currentCoord = [this.currentCoord[0] - 1, this.currentCoord[1]];
        break;
      }
      case "down": {
        this.currentCoord = [this.currentCoord[0] + 1, this.currentCoord[1]];
        break;
      }
    }
    this.draw();
    if (
      this.currentCoord[0] === maze.destinationCoord[0] &&
      this.currentCoord[1] === maze.destinationCoord[1]
    ) {
      console.log("도착!");
    }
  };
}
let maze: Maze, runner: Runner;
const setGameZoneSize = (width: number, length: number) => {
  gameZone.width = width;
  gameZone.height = length;
};
const pressKeyBoard = (event: KeyboardEvent) => {
  event.preventDefault();
  const key = event.key;
  if (
    key === "ArrowLeft" &&
    maze.mazeData[runner.currentCoord[0]][runner.currentCoord[1]][3]
  ) {
    runner.move("left", maze);
  } else if (
    key === "ArrowRight" &&
    maze.mazeData[runner.currentCoord[0]][runner.currentCoord[1]][2]
  ) {
    runner.move("right", maze);
  } else if (
    key === "ArrowUp" &&
    maze.mazeData[runner.currentCoord[0]][runner.currentCoord[1]][1]
  ) {
    runner.move("up", maze);
  } else if (
    key === "ArrowDown" &&
    maze.mazeData[runner.currentCoord[0]][runner.currentCoord[1]][0]
  ) {
    runner.move("down", maze);
  }
};
const enterStage = (event: { target: any }) => {
  const stageData = event.target,
    reader = new FileReader();
  reader.addEventListener("load", () => {
    const json = JSON.parse(reader.result as string),
      data = json.mazeData as number[][][],
      startCoord = json.startCoord as number[],
      destinationCoord = json.destinationCoord as number[];
    maze = new Maze(data, startCoord, destinationCoord);
    maze.draw();
    runner = new Runner(startCoord);
    runner.draw();
    window.addEventListener("keydown", pressKeyBoard);
  });
  reader.readAsText(stageData.files[0]);
};

setGameZoneSize((body.clientWidth * 3) / 10, (body.clientHeight * 3) / 10);
stageBtn.addEventListener("change", enterStage);
