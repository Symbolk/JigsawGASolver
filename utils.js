var compare = (prop) => {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        // descending order
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
    } 
}

var randomSort = (a, b) => {
    return Math.random() > .5 ? -1 : 1;
};

exports.compare=compare;
exports.randomSort=randomSort;