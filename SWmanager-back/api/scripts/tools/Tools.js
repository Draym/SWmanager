/**
 * Created by kevin on 03/01/2017.
 */

exports.dataToJson = function (value) {
    return JSON.parse(value.replace(/\\/gi, "").slice(1, -1));
};

exports.isTrue = function(value) {
    return value == 'true';
}

exports.diffNumbers = function (nb1, nb2) {
    if (nb1 > nb2) {
        return nb1 - nb2;
    } else {
        return nb2 - nb1;
    }
};

exports.numberInRange = function (nb, min, max) {
    if (!nb || !min || !max) {
        return false;
    }
    return (nb >= min && nb <= max);
};