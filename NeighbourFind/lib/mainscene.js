var ma = [
    [4,4,4,4,4,4,4],
    [4,3,3,3,3,5,4],
    [4,3,2,2,2,3,4],
    [4,3,2,4,2,3,4],
    [4,3,2,2,2,3,4],
    [4,3,3,3,3,3,4],
    [4,4,4,4,4,4,4],
];

var dis = 1;
function neighbours( col, row, dis ){
  var matrix= [];
  for( var c = col - dis ; c <= col + dis ; c++ ){
      for( var r = row - dis ; r <= row + dis ; r++ ){
        var position = { x:c, y:r }
        matrix.push( position );
      }
  }
  return matrix;
}

console.log( neighbours(2,2,2) );
