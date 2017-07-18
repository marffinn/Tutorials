var Move = function () {

    var that = this;

    this.grid = {
        width: 12,
        height: 12
    };

    this.showMoveableTiles = function () {
        var movableTiles = 3;
        var row = $(this).data('row');
        var tile = $(this).data('tile');

        $('.tile').removeClass('moveable');

        $('#grid .tile').filter(function(){
        	return Math.abs($(this).data('row') - row) <= movableTiles && Math.abs($(this).data('tile') - tile) <= movableTiles && !($(this).data('row') == row && $(this).data('tile') == tile)
        }).addClass('moveable');
    };

};

var makeGrid = function (width, height) {
    var tiles = '';

    for (var row = 0; row < height; row++) {
        for (var tile = 1; tile <= width; tile++) {
            tiles += '<div class="tile" data-tile="' + tile + '" data-row="' + (row + 1) + '"></div>';
        }
    }

    $('#grid').append(tiles);
};

var move = new Move();

makeGrid(10, 10);
