var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.random = function (min, max) {
        return min + ((Math.random() * 4583) % (max - min));
    };
    Helper.randomInt = function (min, max) {
        var doudle = Helper.random(min, max);
        return (doudle - (doudle % 1));
    };
    Helper.randomChar = function () {
        var randomChar;
        var charType = Helper.randomInt(0, 5);
        if (charType > 1) {
            // set it to Katakana
            randomChar = String.fromCharCode(0x30A0 + Helper.randomInt(0, 96));
        }
        else {
            // set it to numeric
            randomChar = Helper.randomInt(0, 9);
        }
        return randomChar;
    };
    Helper.doubleToInt = function (n) {
        return n - n % 1;
    };
    Helper.maxWidth = window.innerWidth;
    Helper.maxHeight = window.innerHeight;
    Helper.matrixColors = ["#7FFF00", "#76EE00", "#66CD00", "#458B00", "#458B00"]; //, "#7CFC00"
    return Helper;
}());
var Coordinate = /** @class */ (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coordinate;
}());
var MatrixSymbol = /** @class */ (function () {
    function MatrixSymbol(x) {
        this.head = new Coordinate(x, Helper.random(10, 100));
        this.tail = new Coordinate(x, this.head.y);
        this.fontSize = Helper.randomInt(10, 21);
        this.colorIndex = 3 - Helper.doubleToInt((this.fontSize - 10) / 4);
        this.speed = Helper.randomInt(1, 30);
        this.speedCounter = this.speed;
        this.nextChar = Helper.randomChar();
        this.currentChar = this.nextChar;
    }
    MatrixSymbol.prototype.update = function () {
        if (this.head.y <= Helper.maxHeight + this.fontSize) {
            if (this.speedCounter < 0) {
                this.head.y += this.fontSize;
                this.currentChar = this.nextChar;
                this.nextChar = Helper.randomChar();
                this.speedCounter = this.speed;
            }
            else {
                this.speedCounter--;
            }
        }
        else {
            if (this.speedCounter < 0) {
                this.tail.y += (2 * this.fontSize);
                this.speedCounter = this.speed;
            }
            else {
                this.speedCounter--;
            }
        }
    };
    return MatrixSymbol;
}());
var MatrixRain = /** @class */ (function () {
    function MatrixRain(context) {
        this.context = context;
        this.maticxs = [];
        for (var i = 0; i < MatrixRain.matrixMaxCount; i++) {
            this.maticxs.push(new MatrixSymbol(i * MatrixRain.colSize));
        }
        this.runGame();
    }
    MatrixRain.prototype.runGame = function () {
        var _this = this;
        setInterval(function () {
            for (var i = _this.maticxs.length - 1; i >= 0; i--) {
                _this.maticxs[i].update();
            }
            _this.drawText();
        }, 10);
    };
    MatrixRain.prototype.drawText = function () {
        for (var i = 0; i < this.maticxs.length; i++) {
            // Draw text till head touches ground else start clearing text.
            if (this.maticxs[i].head.y <= Helper.maxHeight + this.maticxs[i].fontSize) {
                // Draw metrix
                if (this.maticxs[i].speedCounter <= 0) {
                    console.log(this.maticxs[i]);
                    // Draw next char
                    this.context.font = "bold " + this.maticxs[i].fontSize + "px Arial";
                    this.context.fillStyle = Helper.matrixColors[this.maticxs[i].colorIndex];
                    this.context.fillText(this.maticxs[i].nextChar, this.maticxs[i].head.x, this.maticxs[i].head.y);
                    // Clear last char
                    this.context.clearRect(this.maticxs[i].head.x, this.maticxs[i].head.y - 2 * this.maticxs[i].fontSize, this.maticxs[i].fontSize, this.maticxs[i].fontSize);
                    // Write last char
                    this.context.font = "bold " + (this.maticxs[i].fontSize - 2) + "px Arial";
                    this.context.fillStyle = Helper.matrixColors[this.maticxs[i].colorIndex + 1];
                    this.context.fillText(this.maticxs[i].currentChar, this.maticxs[i].head.x, this.maticxs[i].head.y - this.maticxs[i].fontSize);
                }
            }
            else if (this.maticxs[i].tail.y <= Helper.maxHeight + 4 * this.maticxs[i].fontSize) {
                // Delete matricx;
                this.context.clearRect(this.maticxs[i].tail.x, this.maticxs[i].tail.y - 2 * this.maticxs[i].fontSize, this.maticxs[i].fontSize, 2 * this.maticxs[i].fontSize);
            }
            else {
                // Remove matrix and add new
                this.maticxs.splice(i, 1, new MatrixSymbol(i * MatrixRain.colSize));
            }
        }
    };
    MatrixRain.colSize = 15;
    MatrixRain.matrixMaxCount = Helper.doubleToInt(Helper.maxWidth / MatrixRain.colSize);
    return MatrixRain;
}());
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    new MatrixRain(context);
}
resizeCanvas();
