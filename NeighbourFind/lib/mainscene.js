var ma = [
    [0,0,0,0,0,0,0],
    [0,3,3,3,3,3,0],
    [0,3,2,2,2,3,0],
    [0,3,2,1,2,3,0],
    [0,3,2,2,2,3,0],
    [0,3,3,3,3,3,0],
    [0,0,0,0,0,0,0],
];

var matrix = [];
var dis = 1;
function neighbours( col, row, far ){ // far = Distance
    
    if( dis === 0 ){
        console.log('distance is 0 or below - change the distance');
    } 
    else {
        
        for( var i=1; i<=far; i++ ){
            
            var uu = { c: col-i,  r:row   };
            var ur = { c: col-i,  r:row+i };
            var rr = { c: col,    r:row+i };
            var rd = { c: col+i,  r:row+i };

            var dd = { c: col+i,  r:row   };
            var dl = { c: col+i,  r:row-i };
            var ll = { c: col,    r:row-i };
            var lu = { c: col-i,  r:row-i };

            matrix.push(uu);
            matrix.push(ur);
            matrix.push(rr);
            matrix.push(rd);

            matrix.push(dd);
            matrix.push(dl);
            matrix.push(ll);
            matrix.push(lu);
            
        }
        
        
    }
    
    console.log(matrix);
    
}

neighbours(3,3,2);